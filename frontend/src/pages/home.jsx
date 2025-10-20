import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ElderlyContext } from '../context/context'; // Adjust path if needed

const Home = () => {
  // --- Context Integration ---
  const { user, getTasks, getMedication, getMetrics, getRequests } = useContext(ElderlyContext);

  // --- State for fetched data ---
  const [tasks, setTasks] = useState([]);
  const [medications, setMedications] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [requests, setRequests] = useState([]);

  // --- Fetch all dashboard data on component mount ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksData, medsData, metricsData, requestsData] = await Promise.all([
          getTasks(),
          getMedication(),
          getMetrics(),
          getRequests(),
        ]);

        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setMedications(Array.isArray(medsData) ? medsData : []);
        setRequests(Array.isArray(requestsData) ? requestsData : []);
        
        // Find the most recent metric reading (assuming the last one in the array is the newest)
        if (Array.isArray(metricsData) && metricsData.length > 0) {
          setLatestMetrics(metricsData[metricsData.length - 1]);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // You can set an error state here if you wish
      }
    };

    if (user) { // Only fetch data when user is logged in
      fetchDashboardData();
    }
  }, [user, getTasks, getMedication, getMetrics, getRequests]);

  const pendingRequestsCount = requests.filter(req => req.Status?.toLowerCase() === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome Back, {user.userName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {user?.role === 'family'
              ? "Here's the latest on your loved one's care."
              : "Here's what's happening today."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tasks Today */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Tasks Scheduled</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{tasks.length}</p>
          </div>
          {/* Medications */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Medications</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">{medications.length}</p>
          </div>
          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Requests</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">{pendingRequestsCount}</p>
          </div>
          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-indigo-300">
             <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mb-4">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <h3 className="text-gray-600 text-sm font-medium mb-1">Critical Alerts</h3>
             <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">0</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
              <Link to="/tasks" className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
                See More →
              </Link>
            </div>
            <div className="space-y-4">
              {tasks.length > 0 ? tasks.slice(0, 3).map((task, index) => ( // Show first 3 tasks
                <div key={task._id || index} className="p-4 rounded-xl border-l-4 bg-indigo-50 border-indigo-400 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-700">{task.time}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{task.title}</h3>
                    </div>
                  </div>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No tasks scheduled for today.</p>}
            </div>
          </div>

          {/* Latest Health Metrics */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
              <h2 className="text-xl font-bold">Latest Vitals ({latestMetrics?.timstamp || 'N/A'})</h2>
            </div>
            <div className="p-6">
                {latestMetrics ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <h3 className="text-base font-semibold text-gray-900">Blood Pressure</h3>
                            <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{latestMetrics.blood_pressure}</p>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <h3 className="text-base font-semibold text-gray-900">Heart Rate</h3>
                            <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{latestMetrics.heart_rate} bpm</p>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <h3 className="text-base font-semibold text-gray-900">Glucose Level</h3>
                            <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{latestMetrics.glucose_level} mg/dL</p>
                        </div>
                    </div>
                ) : <p className="text-gray-500 text-center py-4">No recent metric readings found.</p>}
            </div>
             <div className="px-6 pb-4 text-right">
               <Link to="/metric" className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 inline-block">
                 See More →
               </Link>
             </div>
          </div>
        </div>

        {/* Medications Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Medications Schedule</h2>
            <Link to="/medication" className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
              See More →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.length > 0 ? medications.slice(0, 3).map((med, index) => ( // Show first 3 medications
              <div key={med._id || index} className="p-5 bg-cyan-50 rounded-xl border-l-4 border-cyan-600 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{med.name}</h3>
                <p className="text-cyan-700 font-semibold text-sm">{med.dosage}</p>
              </div>
            )) : <p className="text-gray-500 text-center py-4 md:col-span-3">No medications scheduled.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;