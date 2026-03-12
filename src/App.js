// Import React and the useState hook for state management
import React, { useState, useEffect } from 'react';

// Import our custom components
import TimeEntryForm from './components/TimeEntryForm';
import TimeList from './components/TimeList';
import Statistics from './components/Statistics';

// Import component-specific styles
import './App.css';

/**
 * Main App Component
 * This is the root component of our TimeKeeper application
 * It manages the state of all time entries and coordinates between child components
 */
function App() {
  const normalizeProgress = (value) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return 0;
    }

    return Math.min(100, Math.max(0, Math.round(parsed)));
  };

  const normalizeEntry = (entry) => ({
    ...entry,
    progress: normalizeProgress(entry.progress),
  });

  // State to store all time entries
  // useState hook creates a state variable and a function to update it
  // We initialize it with data from localStorage or an empty array
  const [timeEntries, setTimeEntries] = useState(() => {
    // Try to load saved entries from localStorage when the component first mounts
    const savedEntries = localStorage.getItem('timeEntries');

    if (!savedEntries) {
      return [];
    }

    try {
      const parsedEntries = JSON.parse(savedEntries);
      if (!Array.isArray(parsedEntries)) {
        return [];
      }

      // Ensure legacy entries without progress are safely normalized.
      return parsedEntries.map(normalizeEntry);
    } catch (error) {
      return [];
    }
  });

  // useEffect hook to save timeEntries to localStorage whenever they change
  // This ensures data persistence across browser sessions
  useEffect(() => {
    // Save the current timeEntries array to localStorage as a JSON string
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]); // Dependency array - effect runs when timeEntries changes

  /**
   * Function to add a new time entry
   * @param {Object} entry - The new time entry object to add
   */
  const addTimeEntry = (entry) => {
    // Create a new entry object with a unique ID and the provided data
    const newEntry = normalizeEntry({
      id: Date.now(), // Use timestamp as a simple unique ID
      ...entry, // Spread operator to include all properties from the entry parameter
      timestamp: new Date().toISOString(), // Add ISO timestamp for when entry was created
    });
    
    // Update state by adding the new entry to the beginning of the array
    // We use the spread operator to create a new array (React requires immutability)
    setTimeEntries([newEntry, ...timeEntries]);
  };

  /**
   * Function to delete a time entry by its ID
   * @param {number} id - The unique ID of the entry to delete
   */
  const deleteTimeEntry = (id) => {
    // Filter out the entry with the matching ID
    // This creates a new array without the deleted entry
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  /**
   * Function to edit an existing time entry
   * @param {number} id - The ID of the entry to edit
   * @param {Object} updatedEntry - The updated entry data
   */
  const editTimeEntry = (id, updatedEntry) => {
    // Map through all entries and replace the one with matching ID
    setTimeEntries(timeEntries.map(entry => 
      entry.id === id 
        ? normalizeEntry({ ...entry, ...updatedEntry }) // Merge existing entry with updates
        : entry // Keep other entries unchanged
    ));
  };

  // JSX return - defines the component's UI structure
  return (
    // Main container div with className for styling
    <div className="App">
      {/* Header section */}
      <header className="App-header">
        {/* Application title */}
        <h1>⏰ TimeKeeper</h1>
        {/* Subtitle/tagline */}
        <p>Track your time, build positive habits</p>
      </header>

      {/* Main content area */}
      <main className="App-main">
        {/* 
          TimeEntryForm component - handles user input for new time entries
          We pass the addTimeEntry function as a prop so the form can add entries
        */}
        <TimeEntryForm onAddEntry={addTimeEntry} />

        {/* 
          Statistics component - displays summary statistics of time entries
          We pass timeEntries as a prop so it can calculate statistics
        */}
        <Statistics timeEntries={timeEntries} />

        {/* 
          TimeList component - displays all time entries
          We pass three props:
          - entries: the array of all time entries to display
          - onDelete: function to call when user wants to delete an entry
          - onEdit: function to call when user wants to edit an entry
        */}
        <TimeList 
          entries={timeEntries}
          onDelete={deleteTimeEntry}
          onEdit={editTimeEntry}
        />
      </main>

      {/* Footer section */}
      <footer className="App-footer">
        {/* Copyright and credits */}
        <p>© 2026 TimeKeeper - Manage your time wisely</p>
      </footer>
    </div>
  );
}

// Export the App component as the default export
// This allows other files to import it with: import App from './App'
export default App;
