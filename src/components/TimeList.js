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

  const normalizeEventCards = (cards) => {
    if (!Array.isArray(cards)) {
      return [];
    }

    return cards
      .map((card) => ({
        duration: Number(card?.duration) > 0 ? Number(card.duration) : 0,
        detail: typeof card?.detail === 'string' ? card.detail.trim() : '',
      }))
      .filter((card) => card.duration > 0 && card.detail);
  };

  const getComputedDuration = (entry) => {
    const cards = normalizeEventCards(entry.eventCards);

    if (cards.length > 0) {
      return cards.reduce((total, card) => total + card.duration, 0);
    }

    const legacyDuration = Number(entry.duration);
    return Number.isFinite(legacyDuration) && legacyDuration > 0 ? legacyDuration : 0;
  };

  const updateEditedCard = (index, field, value) => {
    setEditedEntry({
      ...editedEntry,
      eventCards: editedEntry.eventCards.map((card, cardIndex) => (
        cardIndex === index ? { ...card, [field]: value } : card
      )),
    });
  };

  const addEditedCard = () => {
    setEditedEntry({
      ...editedEntry,
      eventCards: [...(editedEntry.eventCards || []), { duration: '', detail: '' }],
    });
  };

  const removeEditedCard = (index) => {
    const currentCards = editedEntry.eventCards || [];
    if (currentCards.length === 1) {
      return;
    }

    setEditedEntry({
      ...editedEntry,
      eventCards: currentCards.filter((_, cardIndex) => cardIndex !== index),
    });
  };

  /**
   * Initiates edit mode for a specific entry
   * @param {Object} entry - The entry object to edit
   */
  const startEdit = (entry) => {
    const normalizedCards = normalizeEventCards(entry.eventCards);
    const duration = getComputedDuration(entry);

    const cardsForEdit = normalizedCards.length > 0
      ? normalizedCards.map((card) => ({ duration: String(card.duration), detail: card.detail }))
      : [{ duration: duration > 0 ? String(duration) : '', detail: entry.notes?.trim() || 'Work segment' }];

    // Set the ID of the entry being edited
    setEditingId(entry.id);
    // Copy the entry data to the edit state
    setEditedEntry({
      ...entry,
      duration,
      eventCards: cardsForEdit,
      progress: Number.isFinite(Number(entry.progress)) ? Number(entry.progress) : 0,
    });
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
    // Validate that activity is provided
    if (!editedEntry.activity?.trim()) {
      alert('Please fill in the activity field');
      return;
    }

    const progressValue = Number(editedEntry.progress);
    if (!Number.isInteger(progressValue) || progressValue < 0 || progressValue > 100) {
      alert('Progress must be an integer between 0 and 100');
      return;
    }

    let normalizedCards = [];
    try {
      normalizedCards = (editedEntry.eventCards || []).map((card, index) => {
        const duration = Number(card.duration);
        const detail = card.detail?.trim() || '';

        if (!Number.isFinite(duration) || duration <= 0) {
          throw new Error(`Event ${index + 1}: duration must be a positive number`);
        }

        if (!detail) {
          throw new Error(`Event ${index + 1}: detail is required`);
        }

        return { duration, detail };
      });
    } catch (error) {
      alert(error.message);
      return;
    }

    const derivedDuration = normalizedCards.reduce((total, card) => total + card.duration, 0);

    // Call the parent's edit callback with the edited data
    onEdit(id, {
      activity: editedEntry.activity.trim(),
      duration: derivedDuration,
      eventCards: normalizedCards,
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
        {entries.map((entry) => {
          const normalizedCards = normalizeEventCards(entry.eventCards);
          const durationValue = getComputedDuration(entry);

          return (
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
                
                <div className="edit-event-cards">
                  {(editedEntry.eventCards || []).map((card, index) => (
                    <div key={index} className="edit-event-card-row">
                      <input
                        type="number"
                        value={card.duration}
                        onChange={(e) => updateEditedCard(index, 'duration', e.target.value)}
                        placeholder="Minutes"
                        min="0"
                        step="1"
                      />
                      <input
                        type="text"
                        value={card.detail}
                        onChange={(e) => updateEditedCard(index, 'detail', e.target.value)}
                        placeholder="What did you do?"
                      />
                      <button
                        type="button"
                        className="small-remove-button"
                        onClick={() => removeEditedCard(index)}
                        disabled={(editedEntry.eventCards || []).length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="small-add-button" onClick={addEditedCard}>
                    + Add Event Card
                  </button>
                  <p className="edit-duration-preview">
                    Total: {formatDuration((editedEntry.eventCards || []).reduce((total, card) => {
                      const duration = Number(card.duration);
                      return Number.isFinite(duration) && duration > 0 ? total + duration : total;
                    }, 0))}
                  </p>
                </div>
                
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
                  <span className="duration">⏱️ {formatDuration(durationValue)}</span>
                  <span className="entry-progress">🎯 {Number.isFinite(Number(entry.progress)) ? Math.round(Number(entry.progress)) : 0}%</span>
                </div>
                
                {/* Activity name */}
                <h3 className="activity-name">{entry.activity}</h3>
                
                {/* Notes section (only shown if notes exist) */}
                {entry.notes && (
                  <p className="notes">{entry.notes}</p>
                )}

                {normalizedCards.length > 0 && (
                  <div className="event-breakdown">
                    <h4>Event Breakdown</h4>
                    <ul>
                      {normalizedCards.map((card, index) => (
                        <li key={`${entry.id}-card-${index}`}>
                          <span className="event-segment-duration">{formatDuration(card.duration)}</span>
                          <span className="event-segment-detail">{card.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
          );
        })}
      </div>
    </div>
  );
}

// Export component
export default TimeList;
