/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { SuggestedCourse } from '@/src/models/systemSuggestedCoursesModel';
import { useRecommendations } from '@/src/hooks/recommendationHook/useCourseRecommendationHook';

interface ViewRecommedCourseProps {
  studentId: number;
  sessionType: string;
  sessionYear: number;
}

export const ViewRecommedCourse: React.FC<ViewRecommedCourseProps> = ({
  studentId,
  sessionType,
  sessionYear,
}) => {
  const {
    llmRecommendations,
    selectedCourses,
    allRecommendedCourses,
    totalSelectedCredits,
    allowedCreditHours,
    isGenerating,
    generateError,
    finalizeError,
    isFinalizing,
    generateRecommendations,
    toggleCourseSelection,
    isCourseSelected,
    getCoursesByPriority,
    getPriorityBreakdown,
    getWarningMessage,
    finalizeRecommendations,
  } = useRecommendations();

  const handleGenerate = () => {
    generateRecommendations(studentId, sessionType, sessionYear);
  };

  const handleFinalize = async () => {
    if (!llmRecommendations) return;
    const success = await finalizeRecommendations(studentId, llmRecommendations.summary.totalRequiredCredits);
    if (success) {
      alert('Recommendations finalized successfully!');
    }
  };

  if (isGenerating) {
    return <div className="loading">Generating recommendations...</div>;
  }

  if (generateError) {
    return <div className="error">Error: {generateError}</div>;
  }

  if (!llmRecommendations) {
    return <button onClick={handleGenerate}>Generate Recommendations</button>;
  }

  const priorityBreakdown = getPriorityBreakdown();
  const warningMessage = getWarningMessage();

  const renderCourseCard = (course: SuggestedCourse, priority: string) => {
    const isSelected = isCourseSelected(course.courseId, course.courseName);
    const isOffered = course.isOffered !== false;

    return (
      <div 
        key={`${course.courseId || course.courseName}-${priority}`}
        className={`course-card ${isSelected ? 'selected' : ''} ${!isOffered ? 'not-offered' : ''}`}
        style={{
          border: '1px solid #ddd',
          padding: '12px',
          margin: '8px 0',
          borderRadius: '4px',
          backgroundColor: isSelected ? '#e3f2fd' : 'white',
          opacity: isOffered ? 1 : 0.7,
        }}
      >
        <label style={{ display: 'block', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleCourseSelection(course)}
            disabled={!isOffered}
          />
          <strong>{course.courseName}</strong>
          <span style={{ marginLeft: '8px' }}>
            {course.credits} credits
          </span>
          <span 
            style={{ 
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: priority === 'critical' ? '#ff4444' :
                             priority === 'high' ? '#ff8800' :
                             priority === 'medium' ? '#ffcc00' : '#66bb6a',
              color: 'white'
            }}
          >
            {priority.toUpperCase()}
          </span>
          {!isOffered && (
            <span style={{ color: 'red', marginLeft: '8px' }}>⚠️ Not Offered</span>
          )}
        </label>
        {course.reason && (
          <p style={{ margin: '4px 0 0 24px', fontSize: '14px', color: '#666' }}>
            {course.reason}
          </p>
        )}
        {course.timeSlot && (
          <p style={{ margin: '2px 0 0 24px', fontSize: '12px', color: '#888' }}>
            🕐 {course.timeSlot}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="recommendation-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Summary Section */}
      <div className="summary" style={{ 
        background: '#f5f5f5', 
        padding: '16px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>📊 Recommendation Summary</h3>
        {warningMessage && (
          <div style={{ color: '#ff6b00', background: '#fff3e0', padding: '8px', borderRadius: '4px' }}>
            ⚠️ {warningMessage}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          <p><strong>Total Required:</strong> {llmRecommendations.summary.totalRequiredCredits} credits</p>
          <p><strong>Credits Allowed:</strong> {allowedCreditHours} credits</p>
          <p><strong>Selected:</strong> {totalSelectedCredits} credits</p>
          <p><strong>Remaining:</strong> {(allowedCreditHours || 0) - totalSelectedCredits} credits</p>
        </div>
        {totalSelectedCredits > (allowedCreditHours || 0) && (
          <div style={{ color: 'red', marginTop: '8px' }}>
            ⚠️ Warning: Selected credits exceed allowed limit!
          </div>
        )}
        {priorityBreakdown && (
          <div style={{ marginTop: '8px' }}>
            <p><strong>Priority Breakdown:</strong></p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>🔴 Critical: {priorityBreakdown.critical}</span>
              <span>🟠 High: {priorityBreakdown.high}</span>
              <span>🟡 Medium: {priorityBreakdown.medium}</span>
              <span>🟢 Low: {priorityBreakdown.low}</span>
            </div>
          </div>
        )}
      </div>

      {/* Courses Section */}
      <div className="courses">
        {['critical', 'high', 'medium', 'low'].map((priority) => {
          const courses = getCoursesByPriority(priority);
          if (!courses || courses.length === 0) return null;
          
          return (
            <div key={priority} className="priority-section" style={{ marginBottom: '16px' }}>
              <h4 style={{ 
                borderBottom: `3px solid ${
                  priority === 'critical' ? '#ff4444' :
                  priority === 'high' ? '#ff8800' :
                  priority === 'medium' ? '#ffcc00' : '#66bb6a'
                }`,
                paddingBottom: '4px'
              }}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority ({courses.length} courses)
              </h4>
              {courses.map((course:any) => renderCourseCard(course, priority))}
            </div>
          );
        })}
      </div>

      {/* Selected Courses Summary */}
      {selectedCourses.length > 0 && (
        <div className="selected-summary" style={{
          marginTop: '20px',
          padding: '16px',
          background: '#e8f5e9',
          borderRadius: '8px'
        }}>
          <h4>✅ Selected Courses ({selectedCourses.length})</h4>
          <ul style={{ margin: '8px 0 0 0' }}>
            {selectedCourses.map((course:any) => (
              <li key={course.courseId || course.courseName}>
                {course.courseName} - {course.credits} credits
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleGenerate}
          style={{ padding: '10px 20px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Regenerate
        </button>
        <button 
          onClick={handleFinalize}
          disabled={selectedCourses.length === 0 || isFinalizing}
          style={{ 
            padding: '10px 20px', 
            background: selectedCourses.length > 0 ? '#4caf50' : '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: selectedCourses.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          {isFinalizing ? 'Finalizing...' : 'Finalize Recommendations'}
        </button>
      </div>

      {finalizeError && (
        <div style={{ color: 'red', marginTop: '8px' }}>Error: {finalizeError}</div>
      )}
    </div>
  );
};