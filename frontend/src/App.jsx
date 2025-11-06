import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedChunks, setExpandedChunks] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url || !query) {
      setError('Please provide both URL and search query');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSearchPerformed(true);

    try {
      const response = await axios.post('http://localhost:8000/api/search', {
        url: url,
        query: query
      });

      setResults(response.data);
      
      if (response.data.length === 0) {
        setError('No matches found for your query');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to search. Please check the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getMatchPercentage = (score) => {
    return Math.round(score * 100);
  };

  const toggleHTML = (index) => {
    setExpandedChunks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Website Content Search
            </h1>
            <p className="text-xl text-slate-300 font-light">
              Search through website content with precision using AI-powered semantic search
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Website URL</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 hover:bg-white/10 transition-all duration-300 focus-within:border-indigo-500 focus-within:bg-white/15">
                  <span className="text-xl">🌐</span>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Query Input with Search Button */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Search Query</label>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 hover:bg-white/10 transition-all duration-300 focus-within:border-indigo-500 focus-within:bg-white/15">
                    <span className="text-xl">🔍</span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter your search term"
                      className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl p-5 mb-8 animate-pulse">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Search Error</h3>
                  <p className="text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Header */}
          {results.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Search Results
              </h2>
              <p className="text-slate-300">Found {results.length} matching content chunks</p>
              <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-3"></div>
            </div>
          )}

          {/* Results Grid */}
          {results.length > 0 && (
            <div className="space-y-5">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:shadow-2xl transform hover:scale-102"
                >
                  {/* Result Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-white leading-relaxed text-sm sm:text-base">
                        {result.chunk.length > 300 ? result.chunk.substring(0, 300) + '...' : result.chunk}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {getMatchPercentage(result.relevance_score)}%
                        </div>
                        <p className="text-xs text-slate-300 font-medium">match</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Chunk Info */}
                  <div className="flex items-center gap-3 mb-4 text-sm">
                    <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 rounded-full font-medium">
                      Chunk #{result.chunk_index + 1}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full font-medium">
                      {result.token_count} tokens
                    </span>
                  </div>

                  {/* Path */}
                  <div className="text-xs text-slate-400 mb-4 truncate">
                    📍 {result.path}
                  </div>

                  {/* View HTML Toggle */}
                  <button
                    onClick={() => toggleHTML(index)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                    </svg>
                    <span>&lt;/&gt;</span>
                    <span>View HTML</span>
                    <span className="ml-auto">{expandedChunks[index] ? '▼' : '▶'}</span>
                  </button>

                  {/* HTML Content */}
                  {expandedChunks[index] && (
                    <div className="mt-4 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
                        <code>{result.chunk}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {searchPerformed && results.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <svg className="w-20 h-20 mx-auto text-slate-400 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-400 text-lg">No results found. Try a different search query or URL.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add keyframe animations to tailwind */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;
