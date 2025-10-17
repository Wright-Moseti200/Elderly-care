import React from 'react';

const Metric = () => {
  // Sample health metrics data grouped by timestamp - only specified readings
  const groupedMetrics = [
    {
      timestamp: '2023-10-27 08:00 AM',
      metrics: [
        { id: 1, type: 'Blood Pressure', value: '120/80', status: 'Normal', color: 'green' },
        { id: 2, type: 'Heart Rate', value: '72 bpm', status: 'Normal', color: 'green' },
        { id: 3, type: 'Glucose Level', value: '110 mg/dL', status: 'Warning', color: 'yellow' },
      ]
    }
    // Removed other timestamp groups
  ];

  // Function to get status badge styles based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Critical':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Function to get the overall status for a group of metrics based on the most severe status
  const getGroupStatus = (metrics) => {
     // Define severity order (critical > warning > normal)
     const severityOrder = { 'Critical': 3, 'Warning': 2, 'Normal': 1 };
     let highestSeverity = 0;
     let groupStatus = 'Normal'; // Default

     metrics.forEach(metric => {
       const severity = severityOrder[metric.status] || 0; // Default to 0 if status not found
       if (severity > highestSeverity) {
         highestSeverity = severity;
         groupStatus = metric.status;
       }
     });

     return groupStatus;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto"> {/* Restored original max-width for card container */}
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Health Metrics
          </h1>
          <p className="text-gray-600 mt-2">Your recent health measurements grouped by time</p>
        </div>

        {/* List of Metric Cards */}
        <div className="space-y-6"> {/* Restored original space between cards */}
          {groupedMetrics.map((group) => {
            const groupStatus = getGroupStatus(group.metrics); // Determine status for the whole group
            return (
              <div
                key={group.timestamp}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200" // Restored original rounded and shadow
              >
                {/* Card Header - Time and Overall Status */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white"> {/* Restored original padding */}
                  <div className="flex items-center justify-between">
                     <h2 className="text-lg font-bold">Readings at {group.timestamp}</h2> {/* Restored original font size */}
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(groupStatus)}`}> {/* Restored original badge size */}
                       {groupStatus}
                     </span>
                  </div>
                </div>

                {/* List of Metrics inside the card */}
                <ul className="divide-y divide-gray-100 p-4"> {/* Restored original padding */}
                  {group.metrics.map((metric) => (
                    <li key={metric.id} className="py-3 first:pt-0 last:pb-0"> {/* Restored original vertical padding */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900">{metric.type}</h3> {/* Restored original font size */}
                          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
                            {metric.value} {/* Restored original font size */}
                          </p>
                        </div>
                         {/* Status Text - Using checkmark or warning icon */}
                         <span className={`flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${ // Restored original badge size
                           metric.status === 'Normal'
                             ? 'bg-green-100 text-green-800 border border-green-300'
                             : metric.status === 'Warning'
                               ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                               : 'bg-red-100 text-red-800 border border-red-300' // Example for Critical
                         }`}>
                           {metric.status === 'Normal' ? '✓' : '⚠'} {metric.status} {/* Display icon and status text */}
                         </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Optional: Note */}
        <div className="mt-6 text-center text-sm text-gray-500"> {/* Restored original margin and font size */}
          <p>Metrics are for informational purposes. Consult your healthcare provider for medical advice.</p>
        </div>
      </div>
    </div>
  );
};

export default Metric;