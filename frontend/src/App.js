import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import SearchBar from './components/SearchBar';
import AdvancedFilter from './components/AdvancedFilter';
import { notesAPI } from './services/api';
import './styles/App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [pinned, setPinned] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Load notes and categories on component mount
  useEffect(() => {
    loadNotes();
    loadCategories();
  }, [searchQuery, selectedCategory, priority, pinned, showArchived, sortBy, sortOrder]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchQuery.trim()) {
        response = await notesAPI.searchNotes(searchQuery);
      } else {
        // Build filter parameters
        const filterParams = {
          category: selectedCategory || undefined,
          priority: priority || undefined,
          pinned: pinned || undefined,
          archived: showArchived.toString(),
          sortBy,
          sortOrder
        };
        
        // Remove undefined values
        Object.keys(filterParams).forEach(key => 
          filterParams[key] === undefined && delete filterParams[key]
        );
        
        response = await notesAPI.getAllNotes(filterParams);
      }
      
      setNotes(response.data || []);
    } catch (err) {
      setError('Failed to load notes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await notesAPI.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      console.log('Creating note with data:', noteData);
      const response = await notesAPI.createNote(noteData);
      console.log('Note created successfully:', response);
      setNotes(prevNotes => [response.data, ...prevNotes]);
      setShowForm(false);
      loadCategories(); // Refresh categories in case new one was added
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note: ' + err.message);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === id ? response.data : note))
      );
      setEditingNote(null);
      setShowForm(false);
      loadCategories(); // Refresh categories
    } catch (err) {
      setError('Failed to update note: ' + err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note: ' + err.message);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const response = await notesAPI.togglePinNote(id);
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === id ? response.data : note))
      );
    } catch (err) {
      setError('Failed to toggle pin: ' + err.message);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const response = await notesAPI.toggleArchiveNote(id);
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === id ? response.data : note))
      );
    } catch (err) {
      setError('Failed to toggle archive: ' + err.message);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Notes App</h1>
        <p>Manage your notes efficiently</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <AdvancedFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priority={priority}
            onPriorityChange={setPriority}
            pinned={pinned}
            onPinnedChange={setPinned}
            showArchived={showArchived}
            onShowArchivedChange={setShowArchived}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + New Note
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {showForm && (
          <NoteForm
            note={editingNote}
            onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
            onCancel={handleCloseForm}
          />
        )}

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : (
          <NoteList
            notes={notes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleArchive={handleToggleArchive}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React • API Documentation: <a href="http://localhost:3000/api-docs" target="_blank" rel="noopener noreferrer">Swagger UI</a></p>
      </footer>
    </div>
  );
}

export default App;

