# Website Content Search - AI-Powered Semantic Search

A full-stack web application that enables semantic search through website content using AI embeddings. Search any website by URL and find relevant content using natural language queries powered by machine learning.

## 🚀 Features

-   **AI-Powered Semantic Search** - Uses SentenceTransformers for intelligent, context-aware search
-   **Vector Database** - ChromaDB for efficient similarity-based searching
-   **Clean Text Extraction** - Automatically extracts and cleans content from any website
-   **Real-time Results** - Fast search results with relevance scoring
-   **Beautiful UI** - Modern, responsive interface built with React and Tailwind CSS
-   **Multiple Content Types** - Works with any HTML structure (paragraphs, headings, lists, etc.)
-   **Relevance Scoring** - Shows match percentage for each result

## 🏗️ Architecture

### Frontend

-   **Framework**: React 19 with Vite
-   **Styling**: Tailwind CSS 4
-   **HTTP Client**: Axios
-   **Port**: 5173 (development)

### Backend

-   **Framework**: FastAPI
-   **Vector Database**: ChromaDB
-   **Embeddings**: SentenceTransformers (all-MiniLM-L6-v2)
-   **Web Scraping**: BeautifulSoup + lxml
-   **Port**: 8000

## 📋 Prerequisites

-   Node.js 16+ and npm
-   Python 3.8+
-   pip (Python package manager)

## 🔧 Installation

### Backend Setup

1.  Navigate to backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```python
    python -m venv .venv
    ```

3.  Activate the virtual environment:

    On Windows:
    ```powershell
    .venv\Scripts\activate
    ```
    On macOS/Linux:
    ```bash
    source .venv/bin/activate
    ```

4.  Upgrade pip:
    ```bash
    pip install --upgrade pip
    ```

5.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Frontend Setup

1.  Navigate to frontend directory:
    ```bash
    cd ../frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## 📦 Dependencies

### Backend (`requirements.txt`)

```text
fastapi==0.104.1
uvicorn[standard]==0.24.0
beautifulsoup4==4.12.2
lxml==4.9.3
requests==2.31.0
sentence-transformers==2.2.2
transformers==4.32.0
huggingface-hub==0.25.2
chromadb==0.5.3
tiktoken==0.5.1
pydantic==2.5.0
python-multipart==0.0.6
torch==2.0.1
```

