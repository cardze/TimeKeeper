// Import React
import React from 'react';

// Import component-specific styles
import './Statistics.css';

/**
 * Statistics Component
 * Displays summary statistics about time entries
 * Calculates total time spent and breakdown by category
 * 
 * @param {Array} timeEntries - Array of all time entry objects
 */
function Statistics({ timeEntries }) {
  /**
   * Calculate total time spent across all entries
   * @returns {number} Total duration in minutes
   */
  const calculateTotalTime = () => {
    // Use reduce to sum up all durations
    // reduce takes an accumulator and current value, returns accumulated sum
    return timeEntries.reduce((total, entry) => {
      // Add current entry's duration to the total
      return total + parseFloat(entry.duration);
    }, 0); // Start with 0 as initial value
  };

  /**
   * Calculate time spent per category
   * @returns {Object} Object with category names as keys and total minutes as values
   */
  const calculateCategoryBreakdown = () => {
    // Create an empty object to store category totals
    const breakdown = {};
    
    // Loop through all time entries
    timeEntries.forEach((entry) => {
      // Get the category of current entry
      const category = entry.category;
      
      // If category doesn't exist in breakdown, initialize it with 0
      if (!breakdown[category]) {
        breakdown[category] = 0;
      }
      
      // Add current entry's duration to the category total
      breakdown[category] += parseFloat(entry.duration);
    });
    
    // Return the breakdown object
    return breakdown;
  };

  /**
   * Format minutes into hours and minutes
   * @param {number} minutes - Total minutes
   * @returns {string} Formatted string (e.g., "2h 30m")
   */
  const formatTime = (minutes) => {
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    // Return formatted string based on values
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (mins > 0) {
      return `${mins}m`;
    } else {
      return '0m';
    }
  };

  /**
   * Get emoji for category
   * @param {string} category - Category name
   * @returns {string} Emoji representing the category
   */
  const getCategoryEmoji = (category) => {
    // Map categories to emojis
    const emojiMap = {
      work: '💼',
      study: '📚',
      exercise: '💪',
      leisure: '🎮',
      social: '👥',
      personal: '🧘',
      other: '📌',
    };
    return emojiMap[category] || '📌';
  };

  /**
   * Calculate percentage of total time for a category
   * @param {number} categoryTime - Time spent in this category
   * @param {number} totalTime - Total time across all categories
   * @returns {string} Percentage as string (e.g., "25.5%")
   */
  const calculatePercentage = (categoryTime, totalTime) => {
    // Avoid division by zero
    if (totalTime === 0) return '0';
    // Calculate percentage and round to 1 decimal place
    return ((categoryTime / totalTime) * 100).toFixed(1);
  };

  // Calculate statistics
  const totalTime = calculateTotalTime();
  const categoryBreakdown = calculateCategoryBreakdown();
  
  // Get sorted categories by time spent (descending order)
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1]); // Sort by value (time) in descending order

  // If no entries, show empty state
  if (timeEntries.length === 0) {
    return null; // Don't show statistics section if no data
  }

  // Render statistics
  return (
    <div className="statistics">
      {/* Section heading */}
      <h2>📊 Statistics</h2>
      
      {/* Total time card */}
      <div className="stats-card total-time-card">
        <div className="stat-label">Total Time Tracked</div>
        <div className="stat-value">{formatTime(totalTime)}</div>
        <div className="stat-subtitle">{timeEntries.length} activities</div>
      </div>

      {/* Category breakdown section */}
      {sortedCategories.length > 0 && (
        <div className="category-breakdown">
          <h3>Time by Category</h3>
          
          {/* List all categories with their statistics */}
          <div className="category-list">
            {sortedCategories.map(([category, time]) => (
              // Individual category item with unique key
              <div key={category} className="category-item">
                {/* Category header with emoji and name */}
                <div className="category-header">
                  <span className="category-name">
                    {getCategoryEmoji(category)} {category}
                  </span>
                  <span className="category-time">
                    {formatTime(time)}
                  </span>
                </div>
                
                {/* Progress bar visualization */}
                <div className="progress-bar-container">
                  {/* 
                    Progress bar fill - width is set based on percentage
                    Style attribute is set dynamically using inline styles
                  */}
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${calculatePercentage(time, totalTime)}%` }}
                  >
                    {/* Show percentage inside the bar if it's wide enough */}
                    <span className="progress-percentage">
                      {calculatePercentage(time, totalTime)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export component
export default Statistics;
