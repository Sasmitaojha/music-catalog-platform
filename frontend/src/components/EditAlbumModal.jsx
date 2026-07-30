import React, { useState, useEffect } from 'react';
import { X, Star, Save, Edit3 } from 'lucide-react';

export default function EditAlbumModal({ album, isOpen, onClose, onUpdate }) {
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (album) {
      setRating(album.userRating || 3);
      setNotes(album.userNotes || '');
    }
  }, [album]);

  if (!isOpen || !album) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(album.id, {
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
            <Edit3 className="h-5 w-5" />
            <h2 className="text-base font-bold text-white">Edit Library Entry</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Album Header */}
        <div className="my-4 flex items-center gap-4 rounded-xl bg-slate-900/80 p-3 border border-white/5">
          <img src={album.artworkUrl} alt={album.title} className="h-14 w-14 rounded-lg object-cover" />
          <div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{album.title}</h3>
            <p className="text-xs font-medium text-indigo-300">{album.artistName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Rating</label>
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
              <span className="ml-2 text-xs font-bold text-amber-400">{rating} Stars</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2 text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2 text-xs">
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Update Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
