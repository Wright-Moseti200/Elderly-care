import React from 'react';

const Medication = () => {
  // Sample medication data
  const medications = [
    { id: 1, name: 'Aspirin', dose: '75mg', frequency: 'Once daily', time: 'Morning' },
    { id: 2, name: 'Metformin', dose: '500mg', frequency: 'Twice daily', time: 'Morning & Evening' },
    { id: 3, name: 'Lisinopril', dose: '10mg', frequency: 'Once daily', time: 'Evening' },
    { id: 4, name: 'Atorvastatin', dose: '20mg', frequency: 'Once daily', time: 'Night' },
    { id: 5, name: 'Levothyroxine', dose: '50mcg', frequency: 'Once daily', time: 'Morning (on empty stomach)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Medication Schedule
          </h1>
          <p className="text-gray-600 mt-2">Your prescribed medications and dosages</p>
        </div>

        {/* Medication List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {medications.map((med) => (
              <li key={med.id} className="p-5 hover:bg-blue-50 transition-colors">
                <div className="flex items-center">
                  {/* Icon Placeholder */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>

                  {/* Medication Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 truncate">{med.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {med.dose}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {med.frequency}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {med.time}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Optional: Add a note or footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Please consult your doctor or pharmacist before making any changes to your medication.</p>
        </div>
      </div>
    </div>
  );
};

export default Medication;