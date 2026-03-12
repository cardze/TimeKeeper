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
  
  // State for the duration input field (in minutes)
  const [duration, setDuration] = useState('');
  
  // State for the category/type of activity
  const [category, setCategory] = useState('work');
  
  // State for optional notes/description
  const [notes, setNotes] = useState('');

  // State for task progress percentage
  const [progress, setProgress] = useState('0');

  /**
   * Form submission handler
   * Prevents default form submission behavior and validates/processes the data
   * @param {Event} e - The form submission event
   */
  const handleSubmit = (e) => {
    // Prevent the default form submission which would reload the page
    e.preventDefault();
    
    // Validation: Check if activity name and duration are provided
    // trim() removes whitespace from both ends of the string
    if (!activity.trim() || !duration) {
      // Show an alert if validation fails
      alert('Please fill in both activity and duration fields');
      return; // Exit the function early if validation fails
    }

    // Validation: Check if duration is a positive number
    if (parseFloat(duration) <= 0) {
      alert('Duration must be a positive number');
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
      duration: parseFloat(duration), // Convert string to number
      category, // ES6 shorthand for category: category
      notes: notes.trim(), // Remove extra whitespace from notes
      progress: progressValue,
    };

    // Call the parent's callback function to add the entry
    onAddEntry(entry);

    // Reset all form fields to their initial state after successful submission
    setActivity('');
    setDuration('');
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

        {/* Duration Input Field */}
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes):</label>
          {/* 
            Number input for duration
            - min: minimum allowed value (0)
            - step: allows decimal values (0.5 for half minutes)
          */}
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 30, 60, 90"
            min="0"
            step="0.5"
            required
          />
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
