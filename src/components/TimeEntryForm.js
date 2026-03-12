// Import React and useState hook for managing form state
import React, { useState } from 'react';

// Import component-specific styles
import './TimeEntryForm.css';

/**
 * TimeEntryForm Component
 * This component renders a form that allows users to add new time entries
 * It manages its own internal state for form inputs and passes data to parent via callback
 * 
 * @param {Function} onAddEntry - Callback function to handle adding a new entry
 */
function TimeEntryForm({ onAddEntry }) {
  // State for the activity name input field
  // useState returns [currentValue, setterFunction]
  const [activity, setActivity] = useState('');
  
  // State for dynamic event cards that describe work segments
  const [eventCards, setEventCards] = useState([{ duration: '', detail: '' }]);
  
  // State for the category/type of activity
  const [category, setCategory] = useState('work');
  
  // State for optional notes/description
  const [notes, setNotes] = useState('');

  // State for task progress percentage
  const [progress, setProgress] = useState('0');

  const updateEventCard = (index, field, value) => {
    setEventCards(eventCards.map((card, cardIndex) => (
      cardIndex === index ? { ...card, [field]: value } : card
    )));
  };

  const addEventCard = () => {
    setEventCards([...eventCards, { duration: '', detail: '' }]);
  };

  const removeEventCard = (index) => {
    if (eventCards.length === 1) {
      return;
    }

    setEventCards(eventCards.filter((_, cardIndex) => cardIndex !== index));
  };

  const calculateTotalDuration = () => {
    return eventCards.reduce((total, card) => {
      const duration = Number(card.duration);
      if (!Number.isFinite(duration) || duration <= 0) {
        return total;
      }

      return total + duration;
    }, 0);
  };

  /**
   * Form submission handler
   * Prevents default form submission behavior and validates/processes the data
   * @param {Event} e - The form submission event
   */
  const handleSubmit = (e) => {
    // Prevent the default form submission which would reload the page
    e.preventDefault();
    
    // Validation: Check if activity name is provided
    // trim() removes whitespace from both ends of the string
    if (!activity.trim()) {
      // Show an alert if validation fails
      alert('Please fill in the activity field');
      return; // Exit the function early if validation fails
    }

    let normalizedCards = [];
    try {
      normalizedCards = eventCards.map((card, index) => {
        const parsedDuration = Number(card.duration);
        const detail = card.detail.trim();

        if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
          throw new Error(`Event ${index + 1}: duration must be a positive number`);
        }

        if (!detail) {
          throw new Error(`Event ${index + 1}: detail is required`);
        }

        return {
          duration: parsedDuration,
          detail,
        };
      });
    } catch (error) {
      alert(error.message);
      return;
    }

    const progressValue = Number(progress);
    if (!Number.isInteger(progressValue) || progressValue < 0 || progressValue > 100) {
      alert('Progress must be an integer between 0 and 100');
      return;
    }

    // Create the entry object with all the form data
    const entry = {
      activity: activity.trim(), // Remove extra whitespace
      eventCards: normalizedCards,
      category, // ES6 shorthand for category: category
      notes: notes.trim(), // Remove extra whitespace from notes
      progress: progressValue,
    };

    // Call the parent's callback function to add the entry
    onAddEntry(entry);

    // Reset all form fields to their initial state after successful submission
    setActivity('');
    setEventCards([{ duration: '', detail: '' }]);
    setCategory('work');
    setNotes('');
    setProgress('0');
  };

  // JSX return - defines the form UI
  return (
    // Form container with CSS class
    <div className="time-entry-form">
      {/* Section heading */}
      <h2>Add New Activity</h2>
      
      {/* Form element with onSubmit event handler */}
      <form onSubmit={handleSubmit}>
        {/* Activity Name Input Field */}
        <div className="form-group">
          {/* Label for accessibility and UX */}
          <label htmlFor="activity">Activity Name:</label>
          {/* 
            Input element for activity name
            - value: controlled component - React controls the input value
            - onChange: update state whenever user types
            - required: HTML5 validation attribute
          */}
          <input
            type="text"
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g., Team Meeting, Reading, Exercise"
            required
          />
        </div>

        <div className="form-group">
          <label>Event Cards (duration + detail):</label>
          <p className="form-help-text">Add one or more time segments. Total is calculated automatically.</p>
          <div className="event-cards-list">
            {eventCards.map((card, index) => (
              <div key={index} className="event-card-row">
                <input
                  type="number"
                  value={card.duration}
                  onChange={(e) => updateEventCard(index, 'duration', e.target.value)}
                  placeholder="Minutes"
                  min="0"
                  step="1"
                />
                <input
                  type="text"
                  value={card.detail}
                  onChange={(e) => updateEventCard(index, 'detail', e.target.value)}
                  placeholder="What did you do in this segment?"
                />
                <button
                  type="button"
                  className="event-card-remove"
                  onClick={() => removeEventCard(index)}
                  disabled={eventCards.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="event-card-add" onClick={addEventCard}>
            + Add Event Card
          </button>
          <p className="event-total">Total planned duration: {calculateTotalDuration()} min</p>
        </div>

        {/* Category Selection Dropdown */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          {/* 
            Select dropdown for category
            Allows users to categorize their activities
          */}
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {/* Predefined category options */}
            <option value="work">💼 Work</option>
            <option value="study">📚 Study</option>
            <option value="exercise">💪 Exercise</option>
            <option value="leisure">🎮 Leisure</option>
            <option value="social">👥 Social</option>
            <option value="personal">🧘 Personal</option>
            <option value="other">📌 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="progress">Task Progress (%):</label>
          <input
            type="number"
            id="progress"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="e.g., 0 to 100"
            min="0"
            max="100"
            step="1"
            required
          />
        </div>

        {/* Optional Notes Field */}
        <div className="form-group">
          <label htmlFor="notes">Notes (optional):</label>
          {/* 
            Textarea for multi-line notes
            - rows: initial visible rows
          */}
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details..."
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          {/* Button icon and text */}
          ➕ Add Activity
        </button>
      </form>
    </div>
  );
}

// Export component for use in other files
export default TimeEntryForm;
