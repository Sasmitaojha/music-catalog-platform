import React, { useState, useEffect } from 'react';
import { BarChart3, Disc, Star, TrendingUp, Music, Layers, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function AnalyticsPage({ savedAlbums = [] }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [savedAlbums]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const {
    totalAlbums = 0,
    averageRating = 0,
    totalTracks = 0,
    topGenre = 'None',
    releasesByYear = [],
    genreBreakdown = [],
    ratingsDistribution = [],
    trackCountHistogram = [],
    topArtists = []
  } = analytics || {};

  const colors = ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <span className="badge badge-purple mb-2">Library Insights & Analytics</span>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-400" />
            <span>Catalog Analytics Dashboard</span>
          </h2>
        </div>
        <button onClick={fetchAnalytics} className="btn-secondary py-2 px-4 text-xs">
          <RefreshCw className="h-4 w-4" /> Refresh Stats
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Saved Albums</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Disc className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-white">{totalAlbums}</p>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" /> In your personal catalog
          </div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rating</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-amber-300">{averageRating.toFixed(2)} <span className="text-xs font-semibold text-slate-400">/ 5.0</span></p>
          <div className="mt-2 text-[11px] text-slate-400">Curated quality index</div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Track Count</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Music className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-cyan-300">{totalTracks}</p>
          <div className="mt-2 text-[11px] text-slate-400">Accumulated track depth</div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Genre</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-pink-300 line-clamp-1">{topGenre}</p>
          <div className="mt-2 text-[11px] text-slate-400">Most collected sound category</div>
        </div>
      </div>

      {/* 4 Interactive Visual Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* CHART 1: Releases by Year (Line & Area Chart) */}
        <div className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" /> Chart 1: Releases by Year (Timeline)
            </h3>
            <span className="badge badge-purple">Line Chart</span>
          </div>

          {releasesByYear.length > 0 ? (
            <div className="h-64 flex flex-col justify-end pt-4">
              <div className="flex h-48 items-end gap-2 border-b border-white/10 pb-2">
                {releasesByYear.map((item, idx) => {
                  const maxVal = Math.max(...releasesByYear.map(r => r.value)) || 1;
                  const heightPct = Math.max((item.value / maxVal) * 100, 10);
                  return (
                    <div key={item.label} className="group relative flex-1 flex flex-col items-center">
                      {/* Tooltip */}
                      <div className="absolute -top-9 hidden group-hover:flex bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-indigo-500/40 z-20 whitespace-nowrap shadow-xl">
                        {item.label}: {item.value} album(s)
                      </div>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-500 group-hover:from-indigo-400 group-hover:to-pink-400"
                      />
                      <span className="mt-2 text-[10px] text-slate-400 truncate w-full text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-16">Add albums with release dates to visualize timeline.</p>
          )}
        </div>

        {/* CHART 2: Genre Breakdown (Donut Chart) */}
        <div className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink-500" /> Chart 2: Genre Distribution
            </h3>
            <span className="badge badge-pink">Donut Chart</span>
          </div>

          {genreBreakdown.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
              {/* Custom SVG Donut */}
              <div className="relative h-44 w-44 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9154" fill="none" stroke="#1f2937" strokeWidth="3.8" />
                  {(() => {
                    let accumulated = 0;
                    const total = genreBreakdown.reduce((sum, item) => sum + item.value, 0) || 1;
                    return genreBreakdown.map((item, index) => {
                      const pct = (item.value / total) * 100;
                      const strokeDasharray = `${pct} ${100 - pct}`;
                      const strokeDashoffset = 100 - accumulated;
                      accumulated += pct;
                      return (
                        <circle
                          key={item.label}
                          cx="18"
                          cy="18"
                          r="15.9154"
                          fill="none"
                          stroke={colors[index % colors.length]}
                          strokeWidth="3.8"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-700"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-white">{totalAlbums}</span>
                  <span className="text-[10px] text-slate-400 uppercase">Albums</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="w-full space-y-2">
                {genreBreakdown.slice(0, 5).map((item, index) => {
                  const total = genreBreakdown.reduce((sum, i) => sum + i.value, 0) || 1;
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                        <span className="text-slate-300 font-medium">{item.label}</span>
                      </div>
                      <span className="font-bold text-white">{item.value} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-16">No genre metadata available.</p>
          )}
        </div>

        {/* CHART 3: Ratings Distribution (Vertical Bar Chart) */}
        <div className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Chart 3: User Rating Breakdown (1-5 Stars)
            </h3>
            <span className="badge badge-amber">Bar Chart</span>
          </div>

          {ratingsDistribution.length > 0 ? (
            <div className="h-56 flex items-end gap-4 pt-6 pb-2 border-b border-white/10">
              {ratingsDistribution.map((item) => {
                const maxVal = Math.max(...ratingsDistribution.map(r => r.value)) || 1;
                const heightPct = Math.max((item.value / maxVal) * 100, 8);
                return (
                  <div key={item.label} className="group relative flex-1 flex flex-col items-center">
                    <div className="absolute -top-7 hidden group-hover:block text-[10px] font-bold text-amber-300">
                      {item.value} album(s)
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-yellow-400 transition-all duration-300 group-hover:brightness-125"
                    />
                    <span className="mt-2 text-xs font-semibold text-slate-300">{item.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-16">No user ratings recorded yet.</p>
          )}
        </div>

        {/* CHART 4: Track Count Histogram (Horizontal Bar Chart) */}
        <div className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Chart 4: Track Count Histogram
            </h3>
            <span className="badge badge-emerald">Horizontal Bar</span>
          </div>

          {trackCountHistogram.length > 0 ? (
            <div className="space-y-3.5 py-2">
              {trackCountHistogram.map((item) => {
                const maxVal = Math.max(...trackCountHistogram.map(t => t.value)) || 1;
                const widthPct = Math.max((item.value / maxVal) * 100, 5);
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <span className="font-bold text-emerald-400">{item.value} album(s)</span>
                    </div>
                    <div className="h-3.5 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${widthPct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-16">Histogram data empty.</p>
          )}
        </div>

      </div>
    </div>
  );
}
