import React, { useState } from 'react';
import { Library, LayoutGrid, List, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Star, Plus, Disc3 } from 'lucide-react';
import AlbumCard from '../components/AlbumCard';
import EditAlbumModal from '../components/EditAlbumModal';

export default function LibraryPage({
  albums = [],
  loading,
  onUpdateAlbum,
  onDeleteAlbum,
  onGoToSearch
}) {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Extract unique genres for filter dropdown
  const genres = Array.from(new Set(albums.map((a) => a.genre).filter(Boolean)));

  // Filter local albums
  let filteredAlbums = albums.filter((a) => {
    const matchesSearch =
      !search.trim() ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.artistName.toLowerCase().includes(search.toLowerCase()) ||
      (a.userNotes && a.userNotes.toLowerCase().includes(search.toLowerCase()));

    const matchesGenre = genreFilter === 'all' || (a.genre && a.genre.toLowerCase() === genreFilter.toLowerCase());
    const matchesRating = minRatingFilter === 0 || (a.userRating && a.userRating >= minRatingFilter);

    return matchesSearch && matchesGenre && matchesRating;
  });

  // Sort
  filteredAlbums.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'title' || sortBy === 'artistName' || sortBy === 'genre') {
      valA = (valA || '').toLowerCase();
      valB = (valB || '').toLowerCase();
    } else if (sortBy === 'userRating') {
      valA = valA || 0;
      valB = valB || 0;
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlbums.length / pageSize) || 1;
  const paginatedAlbums = filteredAlbums.slice(page * pageSize, (page + 1) * pageSize);

  const handleOpenEditModal = (album) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
      <div className="page-header mb-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="badge badge-purple mb-2">User Saved Library</span>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Library className="h-8 w-8 text-indigo-400" />
              <span>My Music Library</span>
              <span className="text-sm font-normal text-slate-400">({albums.length} saved albums)</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-white/10 bg-slate-900/80 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-1.5 transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button onClick={onGoToSearch} className="btn-primary text-xs py-2 px-4">
              <Plus className="h-4 w-4" /> Add New Albums
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel mb-6 p-4 flex flex-col lg:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Filter by title, artist, or personal notes..."
            className="input-field pl-10 text-xs py-2.5 rounded-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Genre Filter */}
          <select
            value={genreFilter}
            onChange={(e) => { setGenreFilter(e.target.value); setPage(0); }}
            className="input-field py-2.5 px-3 text-xs rounded-lg bg-slate-900 text-indigo-200"
          >
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Min Rating Filter */}
          <select
            value={minRatingFilter}
            onChange={(e) => { setMinRatingFilter(Number(e.target.value)); setPage(0); }}
            className="input-field py-2.5 px-3 text-xs rounded-lg bg-slate-900 text-amber-300"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars Only</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field py-2.5 px-3 text-xs rounded-lg bg-slate-900 text-slate-200"
          >
            <option value="createdAt">Date Added</option>
            <option value="userRating">User Rating</option>
            <option value="title">Title (A-Z)</option>
            <option value="artistName">Artist Name</option>
          </select>

          {/* Sort Direction */}
          <button
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary py-2.5 px-3 text-xs"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="uppercase text-[10px] font-bold">{sortDir}</span>
          </button>
        </div>
      </div>

      {/* Library Content */}
      {paginatedAlbums.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'space-y-3'}>
          {paginatedAlbums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              isSaved={true}
              onEdit={handleOpenEditModal}
              onDelete={onDeleteAlbum}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel flex flex-col items-center justify-center p-12 text-center my-8">
          <Disc3 className="h-12 w-12 text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-slate-300">Your Saved Library is Empty</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Search the public iTunes catalog to add albums, rate them, and build your analytics dashboard.
          </p>
          <button onClick={onGoToSearch} className="btn-primary mt-4 py-2 px-5 text-xs">
            <Plus className="h-4 w-4" /> Browse Public Catalog
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
          <span>
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditAlbumModal
        album={selectedAlbum}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdateAlbum}
      />
    </div>
  );
}
