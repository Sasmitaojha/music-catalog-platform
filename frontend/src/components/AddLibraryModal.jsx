import React, { useState } from 'react';
import { X, Star, Save, Disc } from 'lucide-react';

export default function AddLibraryModal({ album, isOpen, onClose, onSave }) {
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !album) return null;

  const title = album.collectionName || album.title || 'Album';
  const artist = album.artistName || 'Artist';
  const artwork = album.artworkUrl100 || album.artworkUrl;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        appleCatalogId: album.collectionId || album.appleCatalogId,
        title: title,
        artistName: artist,
        genre: album.primaryGenreName || album.genre || 'General',
        releaseDate: album.releaseDate || '',
        trackCount: album.trackCount || 0,
        artworkUrl: artwork,
        userRating: rating,
        userNotes: notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md overflow-hidden p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Disc className="h-5 w-5" />
            <h2 className="text-base font-bold text-white">Save to My Library</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Album Summary Card */}
        <div className="my-4 flex items-center gap-4 rounded-xl bg-slate-900/80 p-3 border border-white/5">
          <img src={artwork} alt={title} className="h-16 w-16 rounded-lg object-cover" />
          <div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{title}</h3>
            <p className="text-xs font-medium text-indigo-300">{artist}</p>
            <p className="mt-1 text-[11px] text-slate-400">{album.primaryGenreName || album.genre}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Selection */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
              Personal Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400 drop-shadow' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-amber-400">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* User Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
              Personal Notes / Critique (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Favorite track: Parachutes. Great production depth!"
              className="input-field resize-none text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2 text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2 text-xs">
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Add to Library'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
