# Website Content Search - AI-Powered Semantic Search

A full-stack web application that enables semantic search through website content using AI embeddings. Search any website by URL and find relevant content using natural language queries powered by machine learning.

## 🚀 Features

- **AI-Powered Semantic Search** - Uses SentenceTransformers for intelligent, context-aware search
- **Vector Database** - ChromaDB for efficient similarity-based searching
- **Clean Text Extraction** - Automatically extracts and cleans content from any website
- **Real-time Results** - Fast search results with relevance scoring
- **Beautiful UI** - Modern, responsive interface built with React and Tailwind CSS
- **Multiple Content Types** - Works with any HTML structure (paragraphs, headings, lists, etc.)
- **Relevance Scoring** - Shows match percentage for each result

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Port**: 5173 (development)

### Backend
- **Framework**: FastAPI
- **Vector Database**: ChromaDB
- **Embeddings**: SentenceTransformers (all-MiniLM-L6-v2)
- **Web Scraping**: BeautifulSoup + lxml
- **Port**: 8000

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- pip (Python package manager)

## 🔧 Installation

### Backend Setup

1. Navigate to backend directory:
