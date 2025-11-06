from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import requests
from bs4 import BeautifulSoup
import chromadb
from sentence_transformers import SentenceTransformer
import tiktoken
import hashlib
import re
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Website Content Search API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Initialize tokenizer
encoding = tiktoken.get_encoding("cl100k_base")


class SearchRequest(BaseModel):
    url: str
    query: str
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        """Validate URL format"""
        url_pattern = re.compile(
            r'^https?://'
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'
            r'localhost|'
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
            r'(?::\d+)?'
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(v):
            raise ValueError('Invalid URL format. Please use http:// or https://')
        return v


class SearchResult(BaseModel):
    chunk: str
    relevance_score: float
    path: str
    chunk_index: int
    token_count: int


def fetch_html(url: str) -> str:
    """Fetch HTML content from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        logger.error(f"Error fetching URL: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")


def clean_html(html: str) -> str:
    """Parse and clean HTML content"""
    soup = BeautifulSoup(html, 'lxml')
    
    # Remove script, style, and other non-content tags
    for tag in soup(['script', 'style', 'meta', 'link', 'noscript', 'header', 'footer', 'nav']):
        tag.decompose()
    
    # Get text content
    text = soup.get_text(separator=' ', strip=True)
    
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def count_tokens(text: str) -> int:
    """Count tokens in text"""
    return len(encoding.encode(text))


def chunk_text(text: str, max_tokens: int = 500) -> List[str]:
    """Split text into chunks with max_tokens"""
    chunks = []
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    current_chunk = ""
    current_tokens = 0
    
    for sentence in sentences:
        sentence_tokens = count_tokens(sentence)
        
        # If single sentence exceeds max_tokens, split by words
        if sentence_tokens > max_tokens:
            words = sentence.split()
            for word in words:
                word_tokens = count_tokens(word + " ")
                if current_tokens + word_tokens > max_tokens:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = word + " "
                    current_tokens = word_tokens
                else:
                    current_chunk += word + " "
                    current_tokens += word_tokens
        else:
            if current_tokens + sentence_tokens > max_tokens:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + " "
                current_tokens = sentence_tokens
            else:
                current_chunk += sentence + " "
                current_tokens += sentence_tokens
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks


def create_collection_name(url: str) -> str:
    """Create a valid collection name from URL"""
    url_hash = hashlib.md5(url.encode()).hexdigest()[:16]
    return f"collection_{url_hash}"


@app.post("/api/search", response_model=List[SearchResult])
async def search_content(request: SearchRequest):
    """Main endpoint to search website content"""
    try:
        url_str = request.url
        logger.info(f"Processing search for URL: {url_str}, Query: {request.query}")
        
        # Step 1: Fetch and clean HTML
        html_content = fetch_html(url_str)
        cleaned_text = clean_html(html_content)
        
        # Step 2: Chunk the content
        chunks = chunk_text(cleaned_text, max_tokens=500)
        logger.info(f"Created {len(chunks)} chunks from content")
        
        if not chunks:
            raise HTTPException(status_code=400, detail="No content found on the page")
        
        # Step 3: Create/get collection
        collection_name = create_collection_name(url_str)
        
        # Delete existing collection if it exists
        try:
            chroma_client.delete_collection(name=collection_name)
        except:
            pass
        
        collection = chroma_client.create_collection(
            name=collection_name,
            metadata={"url": url_str}
        )
        
        # Step 4: Generate embeddings and add to vector database
        embeddings = model.encode(chunks).tolist()
        
        collection.add(
            embeddings=embeddings,
            documents=chunks,
            ids=[f"chunk_{i}" for i in range(len(chunks))],
            metadatas=[
                {
                    "chunk_index": i,
                    "token_count": count_tokens(chunk),
                    "path": url_str
                }
                for i, chunk in enumerate(chunks)
            ]
        )
        
        # Step 5: Search for query
        query_embedding = model.encode([request.query]).tolist()
        
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=min(10, len(chunks))
        )
        
        # Step 6: Format results
        search_results = []
        
        for i in range(len(results['documents'][0])):
            search_results.append(SearchResult(
                chunk=results['documents'][0][i],
                relevance_score=1 - results['distances'][0][i],
                path=results['metadatas'][0][i]['path'],
                chunk_index=results['metadatas'][0][i]['chunk_index'],
                token_count=results['metadatas'][0][i]['token_count']
            ))
        
        logger.info(f"Returning {len(search_results)} results")
        return search_results
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing search: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
