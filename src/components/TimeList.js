// Import React and useState hook
import React, { useState } from 'react';

// Import component-specific styles
import './TimeList.css';

/**
 * TimeList Component
 * Displays a list of all time entries with options to edit and delete
 * 
 * @param {Array} entries - Array of time entry objects to display
 * @param {Function} onDelete - Callback function to delete an entry
 * @param {Function} onEdit - Callback function to edit an entry
 */
function TimeList({ entries, onDelete, onEdit }) {
  // State to track which entry is currently being edited (stores entry ID or null)
  const [editingId, setEditingId] = useState(null);
  
  // State to store the edited values temporarily while editing
  const [editedEntry, setEditedEntry] = useState({});

  /**
   * Initiates edit mode for a specific entry
   * @param {Object} entry - The entry object to edit
   */
  const startEdit = (entry) => {
    // Set the ID of the entry being edited
    setEditingId(entry.id);
    // Copy the entry data to the edit state
    setEditedEntry({ ...entry, progress: Number.isFinite(Number(entry.progress)) ? Number(entry.progress) : 0 });
  };

  /**
   * Cancels edit mode and discards changes
   */
  const cancelEdit = () => {
    // Clear editing state
    setEditingId(null);
    setEditedEntry({});
  };

  /**
   * Saves the edited entry
   * @param {number} id - The ID of the entry being saved
   */
  const saveEdit = (id) => {
    // Validate that activity and duration are provided
    if (!editedEntry.activity?.trim() || !editedEntry.duration) {
      alert('Please fill in both activity and duration fields');
      return;
    }

    // Validate that duration is positive
    if (parseFloat(editedEntry.duration) <= 0) {
      alert('Duration must be a positive number');
      return;
    }

    const progressValue = Number(editedEntry.progress);
    if (!Number.isInteger(progressValue) || progressValue < 0 || progressValue > 100) {
      alert('Progress must be an integer between 0 and 100');
      return;
    }

    // Call the parent's edit callback with the edited data
    onEdit(id, {
      activity: editedEntry.activity.trim(),
      duration: parseFloat(editedEntry.duration),
      category: editedEntry.category,
      notes: editedEntry.notes?.trim() || '',
      progress: progressValue,
    });

    // Exit edit mode
    cancelEdit();
  };

  /**
   * Formats a duration in minutes to a human-readable string
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration string (e.g., "2h 30m" or "45m")
   */
  const formatDuration = (minutes) => {
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    // Return formatted string based on duration
    if (hours > 0 && mins > 0) {
      // Both hours and minutes (e.g., "2h 30m")
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      // Only hours (e.g., "2h")
      return `${hours}h`;
    } else {
      // Only minutes (e.g., "45m")
      return `${mins}m`;
    }
  };

  /**
   * Formats an ISO timestamp to a readable date/time string
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted date/time string
   */
  const formatTimestamp = (timestamp) => {
    // Create Date object from ISO string
    const date = new Date(timestamp);
    
    // Format options for toLocaleString
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    // Return formatted string (e.g., "Feb 11, 2026, 12:30 PM")
    return date.toLocaleString('en-US', options);
  };

  /**
   * Returns the appropriate emoji for a category
   * @param {string} category - The category name
   * @returns {string} Emoji representing the category
   */
  const getCategoryEmoji = (category) => {
    // Map category names to emojis
    const emojiMap = {
      work: '💼',
      study: '📚',
      exercise: '💪',
      leisure: '🎮',
      social: '👥',
      personal: '🧘',
      other: '📌',
    };
    // Return corresponding emoji or default
    return emojiMap[category] || '📌';
  };

  // Render message if there are no entries
  if (entries.length === 0) {
    return (
      <div className="time-list">
        <h2>Your Activities</h2>
        {/* Empty state message with encouraging text */}
        <div className="empty-state">
          <p>📝 No activities tracked yet.</p>
          <p>Start by adding your first activity above!</p>
        </div>
      </div>
    );
  }

  // Render the list of entries
  return (
    <div className="time-list">
      {/* Section heading with entry count */}
      <h2>Your Activities ({entries.length})</h2>
      
      {/* Container for all entry cards */}
      <div className="entries-container">
        {/* Map through entries array and render each entry */}
        {entries.map((entry) => (
          // Individual entry card with unique key
          <div key={entry.id} className="entry-card">
            {/* Check if this entry is being edited */}
            {editingId === entry.id ? (
              // Render edit mode UI
              <div className="edit-mode">
                {/* Activity name input */}
                <input
                  type="text"
                  value={editedEntry.activity || ''}
                  onChange={(e) => setEditedEntry({ ...editedEntry, activity: e.target.value })}
                  placeholder="Activity name"
                />
                
                {/* Duration input */}
                <input
                  type="number"
                  value={editedEntry.duration || ''}
                  onChange={(e) => setEditedEntry({ ...editedEntry, duration: e.target.value })}
                  placeholder="Duration (min)"
                  min="0"
                  step="0.5"
                />
                
                {/* Category select dropdown */}
                <select
                  value={editedEntry.category || 'work'}
                  onChange={(e) => setEditedEntry({ ...editedEntry, category: e.target.value })}
                >
                  <option value="work">💼 Work</option>
                  <option value="study">📚 Study</option>
                  <option value="exercise">💪 Exercise</option>
                  <option value="leisure">🎮 Leisure</option>
                  <option value="social">👥 Social</option>
                  <option value="personal">🧘 Personal</option>
                  <option value="other">📌 Other</option>
                </select>

                <input
                  type="number"
                  value={editedEntry.progress ?? 0}
                  onChange={(e) => setEditedEntry({ ...editedEntry, progress: e.target.value })}
                  placeholder="Progress (%)"
                  min="0"
                  max="100"
                  step="1"
                />
                
                {/* Notes textarea */}
                <textarea
                  value={editedEntry.notes || ''}
                  onChange={(e) => setEditedEntry({ ...editedEntry, notes: e.target.value })}
                  placeholder="Notes (optional)"
                  rows="2"
                />
                
                {/* Action buttons for edit mode */}
                <div className="edit-buttons">
                  {/* Save button */}
                  <button 
                    className="save-button" 
                    onClick={() => saveEdit(entry.id)}
                  >
                    ✓ Save
                  </button>
                  {/* Cancel button */}
                  <button 
                    className="cancel-button" 
                    onClick={cancelEdit}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Render view mode UI
              <>
                {/* Entry header with category and duration */}
                <div className="entry-header">
                  {/* Category badge with emoji */}
                  <span className="category-badge">
                    {getCategoryEmoji(entry.category)} {entry.category}
                  </span>
                </div>

                <div className="entry-metrics">
                  {/* Duration display */}
                  <span className="duration">⏱️ {formatDuration(entry.duration)}</span>
                  <span className="entry-progress">🎯 {Number.isFinite(Number(entry.progress)) ? Math.round(Number(entry.progress)) : 0}%</span>
                </div>
                
                {/* Activity name */}
                <h3 className="activity-name">{entry.activity}</h3>
                
                {/* Notes section (only shown if notes exist) */}
                {entry.notes && (
                  <p className="notes">{entry.notes}</p>
                )}
                
                {/* Timestamp showing when entry was created */}
                <p className="timestamp">🕒 {formatTimestamp(entry.timestamp)}</p>
                
                {/* Action buttons container */}
                <div className="entry-actions">
                  {/* Edit button */}
                  <button 
                    className="edit-button"
                    onClick={() => startEdit(entry)}
                  >
                    ✏️ Edit
                  </button>
                  {/* Delete button with confirmation */}
                  <button 
                    className="delete-button"
                    onClick={() => {
                      // Confirm before deleting
                      if (window.confirm('Are you sure you want to delete this activity?')) {
                        onDelete(entry.id);
                      }
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Export component
export default TimeList;
