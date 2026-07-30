import React, { useState, useEffect } from 'react';
import { Search, Music2, Sparkles, Loader2, Play } from 'lucide-react';
import api from '../services/api';
import AlbumCard from '../components/AlbumCard';
import AddLibraryModal from '../components/AddLibraryModal';

const featuredCards = [
  { title: 'Bollywood Beats', subtitle: 'Discover iconic Indian movie tracks and modern hits' },
  { title: 'Top Hits', subtitle: 'Fresh tracks from worldwide artists' },
  { title: 'Soul Sessions', subtitle: 'Deep cuts for the perfect mood' },
];

export default function SearchPage({ savedAlbums = [], onAlbumSaved }) {
  const [query, setQuery] = useState('Bollywood');
  const [entity, setEntity] = useState('album');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [audioObj, setAudioObj] = useState(null);
  const [spotlight, setSpotlight] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        fetchSearch(query, entity);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query, entity]);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const response = await api.get(`/search?query=Tum+Hi+Ho&type=song&limit=1`);
        if (response.data && response.data.results && response.data.results.length > 0) {
          setSpotlight(response.data.results[0]);
        }
      } catch (err) {
        console.error('Failed to load Bollywood spotlight', err);
      }
    };

    fetchSpotlight();
  }, []);

  const fetchSearch = async (searchTerm, searchEntity) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/search?query=${encodeURIComponent(searchTerm)}&type=${searchEntity}&limit=30`);
      if (response.data && response.data.results) {
        setResults(response.data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch catalog items from iTunes API');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSaveModal = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const togglePreview = (previewUrl) => {
    if (!previewUrl) return;
    if (playingPreview === previewUrl) {
      audioObj.pause();
      setPlayingPreview(null);
    } else {
      if (audioObj) audioObj.pause();
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      setAudioObj(newAudio);
      setPlayingPreview(previewUrl);
      newAudio.onended = () => setPlayingPreview(null);
    }
  };

  const savedAppleIds = new Set(savedAlbums.map((a) => a.appleCatalogId));

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
      <div className="search-hero mb-8 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(29,_185,_84,_0.18),_transparent_22%),_radial-gradient(circle_at_bottom_right,_rgba(29,_185,_84,_0.08),_transparent_28%),_linear-gradient(150deg,_rgba(8,_16,_27,_0.96),_rgba(4,_8,_14,_0.98))] border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)] overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <span className="hero-tag">Spotify-style premium catalog</span>
              <h1 className="hero-heading">Discover, preview, and save music in one premium experience.</h1>
              <p className="hero-description">
                Browse the global catalog with a polished dark interface—Bollywood, pop, and more—then preview tracks and save favorites instantly.
              </p>
            </div>

            <div className="hero-search-panel glass-panel p-6 rounded-[1.75rem] border-white/10 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col gap-4 sm:flex-row items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search artists, albums, or tracks..."
                    className="input-field pl-12 pr-4 py-4 text-sm rounded-[1.25rem]"
                  />
                </div>

                <button
                  onClick={() => fetchSearch(query, entity)}
                  className="btn-primary py-4 px-6 rounded-[1.5rem] text-sm min-w-[140px]"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span>Search</span>
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="hero-pill">Instant playback</div>
                <div className="hero-pill">Bollywood discovery</div>
                <div className="hero-pill">Save favorites</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="hero-feature-card glass-card p-6 rounded-[2rem] bg-[#071014]/95 border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase text-slate-500 tracking-[0.28em]">Daily Mix</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">Tonight’s best new discoveries</h2>
                </div>
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#1db954] to-[#1ed760] shadow-[0_18px_45px_-18px_rgba(29,185,84,0.75)]" />
              </div>

              <div className="mt-6 space-y-3">
                {featuredCards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-[#1db954]/30">
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{card.subtitle}</p>
                  </div>
                ))}
              </div>

              <button className="btn-primary mt-6 w-full py-3.5 rounded-full text-sm flex items-center justify-center gap-2">
                <Play className="h-4 w-4" /> Play Mix
              </button>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 border-white/10">
              <p className="text-[11px] uppercase text-slate-500 tracking-[0.28em]">Featured</p>
              <h3 className="mt-3 text-lg font-semibold text-white">Album drops you can’t miss</h3>
              <p className="mt-2 text-sm text-slate-400">Browse top albums from artists around the world, all styled with a premium polished interface.</p>
              <div className="mt-5 grid gap-3">
                {featuredCards.map((card) => (
                  <div key={card.title} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0d1922]/80 p-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1db954] to-[#1ed760]" />
                    <div>
                      <p className="text-sm font-semibold text-white">{card.title}</p>
                      <p className="text-xs text-slate-500">{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Quick Search:
        </span>
        {['Bollywood', 'A.R. Rahman', 'Taylor Swift', 'Daft Punk', 'Miles Davis', 'Pink Floyd', 'Beyonce'].map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className={`badge cursor-pointer transition-all ${
              query === term ? 'badge-emerald font-bold scale-105' : 'badge-purple hover:bg-indigo-500/20'
            }`}
          >
            {term}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 p-4 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {spotlight && (
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-[#071014]/90 p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Bollywood Spotlight</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Tum Hi Ho</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Listen to one of the most iconic Bollywood love songs and save your favorite track as a polished card in your library.
              </p>
            </div>

            <div className="max-w-[360px]">
              <AlbumCard
                album={spotlight}
                isSaved={savedAppleIds.has(spotlight.collectionId || spotlight.trackId)}
                onSave={handleOpenSaveModal}
                onPreview={togglePreview}
                isPlaying={playingPreview === spotlight.previewUrl}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-lg font-bold text-white">
          <Music2 className="h-5 w-5 text-emerald-400" />
          <span>Catalog Results</span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching iTunes...
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {results.map((item, index) => {
            const albumId = item.collectionId || item.trackId;
            const isSaved = savedAppleIds.has(albumId);
            return (
              <AlbumCard
                key={albumId || index}
                album={item}
                isSaved={isSaved}
                onSave={handleOpenSaveModal}
                onPreview={togglePreview}
                isPlaying={playingPreview === item.previewUrl}
              />
            );
          })}
        </div>
      ) : !loading ? (
        <div className="glass-panel flex flex-col items-center justify-center p-12 text-center my-8">
          <Music2 className="h-12 w-12 text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-slate-300">No Catalog Results Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Try searching for another artist or album title above.
          </p>
        </div>
      ) : null}

      <AddLibraryModal
        album={selectedAlbum}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAlbumSaved}
      />
    </div>
  );
}
