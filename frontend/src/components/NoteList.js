import React from 'react';

const NoteList = ({ notes, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <p>No notes found. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <div key={note.id} className={`note-card ${note.isPinned ? 'pinned' : ''} ${note.isArchived ? 'archived' : ''}`}>
          <div className="note-header">
            <h3 className="note-title">{note.title}</h3>
            <div className="note-actions">
              <button
                className="btn-icon"
                onClick={() => onTogglePin(note.id)}
                title={note.isPinned ? 'Unpin' : 'Pin'}
              >
                📌
              </button>
              <button
                className="btn-icon"
                onClick={() => onToggleArchive(note.id)}
                title={note.isArchived ? 'Unarchive' : 'Archive'}
              >
                {note.isArchived ? '📦' : '📁'}
              </button>
              <button
                className="btn-icon"
                onClick={() => onEdit(note)}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="btn-icon delete"
                onClick={() => onDelete(note.id)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="note-content">
            <p>{note.content}</p>
          </div>

          <div className="note-meta">
            {note.category && (
              <span className="note-category">{note.category}</span>
            )}
            {note.tags && note.tags.length > 0 && (
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}
            <div className="note-priority">
              <span className={`priority priority-${note.priority}`}>
                {note.priority}
              </span>
            </div>
          </div>

          <div className="note-footer">
            <small className="note-date">
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </small>
            {note.updatedAt !== note.createdAt && (
              <small className="note-date">
                Updated: {new Date(note.updatedAt).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;

