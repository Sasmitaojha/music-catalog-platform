import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Search, TrendingUp, Music, Loader2, Award, Compass, ArrowRight } from 'lucide-react';
import api from '../services/api';
import AlbumCard from '../components/AlbumCard';

export default function AiInsightsPage({ savedAlbums = [], onGoToSearch }) {
  const [mode, setMode] = useState('recommendations');
  const [nlQuery, setNlQuery] = useState('5 star albums with high track count');
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInsight(mode, mode === 'nl_query' ? nlQuery : '');
  }, [mode, savedAlbums]);

  const fetchInsight = async (targetMode, queryText) => {
    setLoading(true);
    try {
      const response = await api.post('/ai/insights', {
        mode: targetMode,
        query: queryText,
      });
      setInsight(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNlQuerySubmit = (e) => {
    e.preventDefault();
    fetchInsight('nl_query', nlQuery);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
      <div className="page-header mb-8">
        <div className="rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-pink-900/40 p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="badge badge-pink mb-3 flex items-center gap-1 w-max">
              <Sparkles className="h-3.5 w-3.5" /> AI Music Intelligence
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              AI Music Discovery
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 leading-7">
              Personalized recommendations, trend summaries, and natural language catalog search all in one polished music insights hub.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                <div className="flex items-center gap-3 text-pink-300">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold text-white">Recommendations</span>
                </div>
                <p className="mt-3 text-slate-400">Discover albums tailored to your saved collection.</p>
              </div>
              <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                <div className="flex items-center gap-3 text-indigo-300">
                  <Search className="h-4 w-4" />
                  <span className="font-semibold text-white">Natural Language</span>
                </div>
                <p className="mt-3 text-slate-400">Ask AI questions about your library and catalog.</p>
              </div>
              <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                <div className="flex items-center gap-3 text-emerald-300">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold text-white">Trend Summary</span>
                </div>
                <p className="mt-3 text-slate-400">See the most relevant genres and listening patterns.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setMode('recommendations')}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all ${
                mode === 'recommendations'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Recommendations</span>
            </button>

            <button
              onClick={() => setMode('nl_query')}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all ${
                mode === 'nl_query'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Natural Language</span>
            </button>

            <button
              onClick={() => setMode('trend_summary')}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all ${
                mode === 'trend_summary'
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trend Summary</span>
            </button>
          </div>
        </div>
      </div>

      {mode === 'nl_query' && (
        <form onSubmit={handleNlQuerySubmit} className="glass-panel mb-8 p-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-400" />
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Ask AI e.g. 'Top Bollywood tracks', 'High-energy albums', 'Trending synth pop'"
              className="input-field pl-12 pr-4 py-3 text-sm rounded-xl"
            />
          </div>
          <button type="submit" className="btn-primary py-3 px-6 rounded-xl text-xs whitespace-nowrap">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-pink-300" />}
            <span>Ask AI</span>
          </button>
        </form>
      )}

      {loading ? (
        <div className="glass-panel flex flex-col items-center justify-center p-16 text-center my-8">
          <Loader2 className="h-10 w-10 animate-spin text-pink-400 mb-3" />
          <h4 className="text-base font-bold text-white">Analyzing Catalog Profile...</h4>
          <p className="text-xs text-slate-400 mt-1">Evaluating genres, ratings, and track depth</p>
        </div>
      ) : insight ? (
        <div className="space-y-8">
          <div className="glass-panel p-6 border-l-4 border-l-pink-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Executive Summary</p>
                  <h3 className="font-bold text-white text-xl">Instant insights for your music library</h3>
                </div>
              </div>
              <p className="max-w-2xl text-sm text-indigo-200">{insight.insightSummary}</p>
            </div>
            {insight.detailedAnalysis && (
              <p className="mt-6 text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-4">
                {insight.detailedAnalysis}
              </p>
            )}
          </div>

          {insight.recommendations && insight.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5 text-pink-400" />
                <span>AI Suggested Albums to Explore</span>
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {insight.recommendations.map((rec, idx) => (
                  <div key={idx} className="glass-card p-5 border-l-2 border-l-indigo-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-purple">{rec.genre}</span>
                      <Award className="h-4 w-4 text-amber-400" />
                    </div>
                    <h4 className="font-bold text-white text-base">{rec.title}</h4>
                    <p className="text-xs font-semibold text-indigo-300 mt-0.5">{rec.artist}</p>
                    <p className="mt-3 text-xs text-slate-300 italic border-t border-white/5 pt-2">
                      "{rec.reason}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insight.matchingAlbums && insight.matchingAlbums.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Music className="h-5 w-5 text-indigo-400" />
                <span>Matching Saved Albums ({insight.matchingAlbums.length})</span>
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {insight.matchingAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} isSaved={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
