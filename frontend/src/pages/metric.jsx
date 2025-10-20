import React, { useState, useEffect, useContext } from 'react';
import { ElderlyContext } from '../context/context'; // Adjust path if needed

const Metric = () => {
  // --- Context Integration ---
  const { user, getMetrics, addMetrics, error: contextError, setError } = useContext(ElderlyContext);

  // --- State ---
  const [metricsList, setMetricsList] = useState([]);
  const [localError, setLocalError] = useState(null);
  const [newMetric, setNewMetric] = useState({
    blood_pressure: '',
    heart_rate: '',
    glucose_level: ''
  });

  // --- Fetch Metrics on Mount or User Change ---
  useEffect(() => {
    const fetchMetrics = async () => {
      setLocalError(null);
      if (contextError && setError) setError(null);
      try {
        const fetchedMetrics = await getMetrics();
        // Ensure we always have an array
        setMetricsList(Array.isArray(fetchedMetrics) ? fetchedMetrics : []);
      } catch (err) {
        setLocalError('Failed to load health metrics.');
        console.error("Metric.jsx: Error fetching metrics:", err);
      }
    };
    if (user) { fetchMetrics(); } else { setMetricsList([]); }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // --- Handlers ---
  const handleInputChange = (e) => { /* ... (no changes) ... */
    setNewMetric({ ...newMetric, [e.target.name]: e.target.value });
  };
  const handleAddMetric = async (e) => { /* ... (no changes - posts new metric, refetches list) ... */
     e.preventDefault();
    if (!newMetric.blood_pressure || !newMetric.heart_rate || !newMetric.glucose_level) {
      setLocalError('Please fill in all metric fields.');
      return;
    }
    setLocalError(null);
    if (contextError && setError) setError(null);
    try {
      await addMetrics(newMetric);
      setNewMetric({ blood_pressure: '', heart_rate: '', glucose_level: '' });
      const updatedMetrics = await getMetrics();
      setMetricsList(Array.isArray(updatedMetrics) ? updatedMetrics : []);
    } catch (err) {
      setLocalError('Failed to add metric reading.');
      console.error("Metric.jsx: Error adding metric:", err);
    }
  };

  // --- Render Logic ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
               Health Metrics
             </h1>
             <p className="text-gray-600 mt-2">
                {user?.role === 'caregiver' ? 'Record and view recent health measurements' : 'Recent health measurements'}
             </p>
        </div>

        {/* Error Display */}
        {(localError || contextError) && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{localError || contextError}</span>
            </div>
        )}

        {/* Add Metric Form (Conditionally Rendered for 'caregiver') */}
        {user?.role === 'caregiver' && (
            <div className="mb-8">
               {/* ... (Form JSX remains the same) ... */}
               <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Add New Metric Reading</h2>
                <form onSubmit={handleAddMetric} className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div> <label htmlFor="blood_pressure" className="block mb-1 font-medium text-gray-700 text-sm">Blood Pressure</label> <input type="text" id="blood_pressure" name="blood_pressure" value={newMetric.blood_pressure} onChange={handleInputChange} placeholder="e.g., 120/80" required className="input-style"/> </div>
                    <div> <label htmlFor="heart_rate" className="block mb-1 font-medium text-gray-700 text-sm">Heart Rate (bpm)</label> <input type="number" id="heart_rate" name="heart_rate" value={newMetric.heart_rate} onChange={handleInputChange} placeholder="e.g., 72" required className="input-style"/> </div>
                    <div> <label htmlFor="glucose_level" className="block mb-1 font-medium text-gray-700 text-sm">Glucose Level (mg/dL)</label> <input type="number" id="glucose_level" name="glucose_level" value={newMetric.glucose_level} onChange={handleInputChange} placeholder="e.g., 95" required className="input-style"/> </div>
                    <button type="submit" className="w-full btn-primary"> Add Metric Reading </button>
                </form>
                <style jsx>{`
                    .input-style { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; transition: border-color 0.2s, box-shadow 0.2s; }
                    .input-style:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
                    .btn-primary { padding: 0.625rem 1rem; background-image: linear-gradient(to right, #3B82F6, #1D4ED8); color: white; font-weight: 600; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
                    .btn-primary:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                `}</style>
            </div>
        )}

        {/* --- MODIFIED Metrics List Display --- */}
        <div>
           <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Recorded Metrics</h2>
           <div className="space-y-6"> {/* Add space between each reading group */}
             {user ? (
               metricsList && metricsList.length > 0 ? (
                 // Display newest readings first
                 metricsList.slice().reverse().map((reading, index) => (
                   // Create a distinct card for each reading instance (timestamp)
                   <div key={reading._id || `metric-${index}`} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                      {/* Card Header with Timestamp */}
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 border-b border-gray-300">
                          <h3 className="text-sm font-semibold text-gray-700">
                              Reading Time: {reading.timstamp || 'N/A'}
                          </h3>
                      </div>
                      {/* Card Body with the 3 metrics */}
                      <div className="p-4 space-y-3">
                          {/* Blood Pressure */}
                          <div className="flex items-center justify-between">
                              <span className="text-base font-medium text-gray-800">Blood Pressure:</span>
                              <span className="text-lg font-bold text-blue-700">
                                  {reading.blood_pressure || 'N/A'}
                              </span>
                          </div>
                           {/* Heart Rate */}
                           <div className="flex items-center justify-between">
                              <span className="text-base font-medium text-gray-800">Heart Rate:</span>
                              <span className="text-lg font-bold text-blue-700">
                                  {reading.heart_rate ? `${reading.heart_rate} bpm` : 'N/A'}
                              </span>
                          </div>
                           {/* Glucose Level */}
                           <div className="flex items-center justify-between">
                              <span className="text-base font-medium text-gray-800">Glucose Level:</span>
                              <span className="text-lg font-bold text-blue-700">
                                  {reading.glucose_level ? `${reading.glucose_level} mg/dL` : 'N/A'}
                              </span>
                          </div>
                      </div>
                   </div>
                 ))
               ) : (
                 // Message shown if logged in but no metrics found
                 <div className="p-5 text-center text-gray-500 bg-white rounded-xl shadow">No health metrics have been recorded yet.</div>
               )
             ) : (
               // Message shown if user data hasn't loaded yet
               <div className="p-5 text-center text-gray-500 bg-white rounded-xl shadow">Loading user data...</div>
             )}
           </div>
        </div>

        {/* Optional Note */}
        <div className="mt-8 text-center text-sm text-gray-500"> {/* Increased top margin */}
          <p>Metrics are for informational purposes. Consult your healthcare provider for medical advice.</p>
        </div>
      </div>
    </div>
  );
};

export default Metric;