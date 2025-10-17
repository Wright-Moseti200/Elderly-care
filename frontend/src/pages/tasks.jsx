import React from 'react';

const Tasks = () => {
  // Sample task data - 'status' field is kept for filtering the summary if needed, but not displayed per task
  const tasks = [
    { id: 1, title: 'Blood Pressure Check', patient: 'Margaret Johnson', time: '9:00 AM', urgent: true },
    { id: 2, title: 'Medication Administration', patient: 'Robert Smith', time: '10:30 AM', urgent: false },
    { id: 3, title: 'Physical Therapy Session', patient: 'Dorothy Williams', time: '2:00 PM', urgent: false },
    { id: 4, title: 'Doctor Consultation', patient: 'James Brown', time: '3:15 PM', urgent: true },
    { id: 5, title: 'Vital Signs Monitoring', patient: 'Patricia Miller', time: '4:45 PM', urgent: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Today's Tasks
          </h1>
          <p className="text-gray-600 mt-2">Manage and track your scheduled tasks</p>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`p-5 transition-all ${
                  task.urgent ? 'bg-red-50 border-l-4 border-red-500' : 'bg-white'
                }`}
              >
                <div className="flex items-start">
                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">{task.time}</span>
                      {task.urgent && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                          URGENT
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{task.title}</h3>
                    <p className="text-gray-600 mt-1">Patient: {task.patient}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tasks;