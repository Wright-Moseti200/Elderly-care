import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Sample data - status removed from tasks and medications
  const tasks = [
    { id: 1, title: 'Blood Pressure Check', patient: 'Margaret Johnson', time: '9:00 AM', urgent: true },
    { id: 2, title: 'Medication Administration', patient: 'Robert Smith', time: '10:30 AM', urgent: false },
    { id: 3, title: 'Physical Therapy Session', patient: 'Dorothy Williams', time: '2:00 PM', urgent: false }
  ];

  const medications = [
    { id: 1, name: 'Aspirin 75mg', patient: 'Margaret Johnson', time: '8:00 AM' },
    { id: 2, name: 'Metformin 500mg', patient: 'Robert Smith', time: '9:00 AM' },
    { id: 3, name: 'Lisinopril 10mg', patient: 'Dorothy Williams', time: '12:00 PM' }
  ];

  // Sample health metrics data for the Home page - all taken at the same time
  const healthMetrics = [
    { id: 1, type: 'Blood Pressure', value: '120/80' },
    { id: 2, type: 'Heart Rate', value: '72 bpm' },
    { id: 3, type: 'Glucose Level', value: '110 mg/dL' }
  ];
  const metricTimestamp = '2023-10-27 08:00 AM'; // Single timestamp for the group

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50"> {/* Changed background gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2"> {/* Changed header gradient */}
            Welcome Back, Lucy! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your patients today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300"> {/* Simplified border */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Patients</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">24</p>
            <p className="text-indigo-600 text-sm mt-2 font-medium">↑ 2 new this week</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300"> {/* Simplified border */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Tasks Today</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">12</p>
            <p className="text-gray-600 text-sm mt-2 font-medium">8 completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300"> {/* Simplified border */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Medications</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">8</p>
            <p className="text-indigo-600 text-sm mt-2 font-medium">2 due soon</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300"> {/* Simplified border */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Critical Alerts</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">3</p>
            <p className="text-indigo-600 text-sm mt-2 font-medium">Requires attention</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks - Status Removed */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"> {/* Simplified border */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
              <Link
                to="/tasks"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                See More →
              </Link>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
                    task.urgent
                      ? 'bg-indigo-50 border-indigo-600'
                      : 'bg-indigo-50 border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700">{task.time}</span>
                        {task.urgent && (
                          <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mt-2">{task.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">Patient: {task.patient}</p>
                    </div>
                    {/* Status badge removed */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Metrics - Single Time Group */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200"> {/* Simplified border, removed p-6 from main div */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white"> {/* Header for metrics card - includes timestamp */}
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold">Readings at {metricTimestamp}</h2> {/* Changed title to include timestamp */}
                 {/* Overall status badge removed */}
              </div>
            </div>
            <div className="p-6"> {/* Padding moved inside the body div */}
              <div className="space-y-4">
                {healthMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between py-2 first:pt-0 last:pb-0" // Space between items
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{metric.type}</h3>
                      <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                        {metric.value}
                      </p>
                    </div>
                    {/* Individual status text/icon removed */}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-2"> {/* Link container */}
              <Link
                to="/metric" // Changed link to /metric page
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 inline-block"
              >
                See More →
              </Link>
            </div>
          </div>
        </div>

        {/* Medications Section - Status Removed */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6 border border-gray-200"> {/* Simplified border */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Medications Schedule</h2>
            <Link
              to="/medication" // Changed link to /medication page
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
            >
              See More →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-5 bg-indigo-50 rounded-xl border-l-4 border-indigo-600 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  {/* Status badge removed */}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{med.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{med.patient}</p>
                <p className="text-indigo-700 font-semibold text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {med.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;