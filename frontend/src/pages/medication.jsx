import React, { useState, useEffect, useContext } from 'react';
import { ElderlyContext } from '../context/context'; // Adjust path if needed

const Medication = () => {
  // --- Context Integration ---
  const { user, getMedication, addMedication, error: contextError } = useContext(ElderlyContext);

  // --- State ---
  const [medications, setMedications] = useState([]);
  const [localError, setLocalError] = useState(null);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '' });

  // --- Fetch Medications on Mount ---
  useEffect(() => {
    const fetchMedication = async () => {
      setLocalError(null); // Clear previous errors
      try {
        const fetchedMeds = await getMedication();
        // Ensure backend returns an array (check context function if needed)
        setMedications(Array.isArray(fetchedMeds) ? fetchedMeds : []);
      } catch (err) {
        setLocalError('Failed to load medication schedule.');
        console.error(err);
      }
    };

    if (user) { // Only fetch if user is loaded
      fetchMedication();
    }
  }, [user, getMedication]); // Refetch if user or function changes

  // --- Handlers ---
  const handleInputChange = (e) => {
    setNewMedication({ ...newMedication, [e.target.name]: e.target.value });
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.dosage) {
      setLocalError('Please enter both medication name and dosage.');
      return;
    }
    setLocalError(null);
    try {
      await addMedication(newMedication);
      setNewMedication({ name: '', dosage: '' }); // Clear form
      // Refetch medications list
      const updatedMeds = await getMedication();
      setMedications(Array.isArray(updatedMeds) ? updatedMeds : []);
    } catch (err) {
      setLocalError('Failed to add medication.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Medication Schedule
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'family' ? 'Manage prescribed medications' : 'Prescribed medications and dosages'}
          </p>
        </div>

        {/* Error Display */}
        {(localError || contextError) && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{localError || contextError}</span>
          </div>
        )}

        {/* Add Medication Form (Family Only) */}
        {user?.role === 'family' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Add New Medication</h2>
            <form onSubmit={handleAddMedication} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700 text-sm">Medication Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMedication.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Aspirin"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="dosage" className="block mb-1 font-medium text-gray-700 text-sm">Dosage & Frequency</label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={newMedication.dosage}
                  onChange={handleInputChange}
                  placeholder="e.g., 75mg Once Daily Morning"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition-all duration-200"
              >
                Add Medication
              </button>
            </form>
          </div>
        )}

        {/* Medication List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {medications && medications.length > 0 ? (
              medications.map((med, index) => (
                <li key={med._id || `med-${index}`} className="p-5 hover:bg-blue-50 transition-colors"> {/* Use _id if available */}
                  <div className="flex items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>

                    {/* Medication Info - Use 'name' and 'dosage' from backend */}
                    <div className="ml-4 flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 truncate">{med.name || 'N/A'}</h2>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {med.dosage || 'N/A'}
                        </span>
                        {/* Add other fields if your backend provides them */}
                        {/* Example:
                           {med.frequency && <span className="...">{med.frequency}</span>}
                           {med.time && <span className="...">{med.time}</span>}
                        */}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-5 text-center text-gray-500">No medication schedule found.</li>
            )}
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