import React from 'react';
import { Star, Calendar, Disc, Plus, Play, CheckCircle2 } from 'lucide-react';

export default function AlbumCard({
  album,
  isSaved,
  onSave,
  onPreview,
  isPlaying,
  onEdit,
  onDelete,
  viewMode = 'grid'
}) {
  const artwork = album.artworkUrl || album.artworkUrl100 || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80';
  const title = album.title || album.trackName || album.collectionName || 'Untitled Album';
  const artist = album.artistName || 'Unknown Artist';
  const genre = album.genre || album.primaryGenreName || 'General';
  const releaseYear = (album.releaseDate || '').substring(0, 4) || 'N/A';
  const tracks = album.trackCount || (album.trackCount === 0 ? 0 : album.trackCount) || 1;
  const rating = album.userRating || 0;
  const previewUrl = album.previewUrl || null;

  const renderStars = (starRating) => {
    return (
      <div className="flex items-center gap-1 text-emerald-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= starRating ? 'fill-emerald-400 text-emerald-400' : 'text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="glass-panel flex items-center justify-between p-4 transition-all hover:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <img
            src={artwork}
            alt={title}
            className="h-16 w-16 rounded-3xl object-cover shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
          />
          <div>
            <h3 className="font-semibold text-white line-clamp-1">{title}</h3>
            <p className="text-xs text-slate-400 font-medium">{artist}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="badge badge-emerald">{genre}</span>
              <span>{releaseYear}</span>
              <span>{tracks} tracks</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rating > 0 && renderStars(rating)}
          {isSaved ? (
            <button
              onClick={() => onDelete(album.id)}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => onSave(album)}
              className="btn-primary py-1.5 px-3 text-xs"
            >
              Save
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-album-card group overflow-hidden rounded-[2rem] border border-white/10 bg-[#071014] shadow-[0_32px_70px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)]">
      <div className="relative overflow-hidden rounded-[2rem]">
        <img
          src={artwork}
          alt={title}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04110f] via-transparent to-transparent opacity-90" />
        {previewUrl && (
          <button
            onClick={() => onPreview ? onPreview(previewUrl) : null}
            className="spotify-play-overlay absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1db954] text-white shadow-[0_20px_40px_rgba(29,185,84,0.35)] transition duration-200 hover:scale-110"
          >
            <Play className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={() => onSave(album)}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition duration-200 hover:bg-white/15"
        >
          {isSaved ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
        {isSaved && (
          <span className="absolute top-4 left-4 rounded-full bg-[#1db954]/90 px-3 py-1 text-[11px] font-semibold text-black">
            Saved
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.24em] text-slate-500">
          <span>Album</span>
          <span className="badge badge-emerald">{genre}</span>
        </div>

        <h3 className="text-lg font-semibold text-white line-clamp-2">{title}</h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-1">{artist}</p>

        <div className="mt-5 grid gap-3 text-[12px] text-slate-400">
          <div className="flex items-center justify-between rounded-3xl bg-white/5 p-3">
            <span>Released</span>
            <span className="font-semibold text-slate-100">{releaseYear}</span>
          </div>
          <div className="flex items-center justify-between rounded-3xl bg-white/5 p-3">
            <span>Tracks</span>
            <span className="font-semibold text-slate-100">{tracks}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {rating > 0 ? (
            <div className="flex items-center gap-1">{renderStars(rating)}</div>
          ) : (
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">No rating</span>
          )}

          <button
            onClick={() => onSave(album)}
            className="btn-primary rounded-full px-4 py-2 text-xs flex items-center gap-2 justify-center"
          >
            {isSaved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
