import React, { useState, useEffect, useContext } from 'react';
import { ElderlyContext } from '../context/context';

const Requests = () => {
  // Context Integration
  const {
    user,
    getCareTakers,
    createRequest,
    uploadFile,
    getRequests,
    updateRequestStatus,
    error: contextError,
    setError
  } = useContext(ElderlyContext);

  // State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    conditions: '',
    number: '',
    historyFile: null,
    caretaker: ''
  });
  const [caretakersList, setCaretakersList] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Helper to normalize role check (Backend uses "caregiver", frontend might use "caretaker")
  const isCaretaker = user?.role?.toLowerCase() === 'caregiver' || user?.role?.toLowerCase() === 'caretaker';
  const isFamily = user?.role?.toLowerCase() === 'family';

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      setLocalError(null);
      if (contextError) setError(null);

      let caretakers = [];
      let requests = [];

      try {
        console.log('Fetching data for user role:', user?.role);

        // Only fetch caretaker list if user is family
        if (isFamily) {
          caretakers = await getCareTakers();
        }
        requests = await getRequests();

        setCaretakersList(Array.isArray(caretakers) ? caretakers : []);
        setRequestsList(Array.isArray(requests) ? requests : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLocalError('Failed to load initial data. Please try again.');
      }
    };

    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      historyFile: file || null,
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    try {
      if (!formData.caretaker) {
        throw new Error("Please select a caretaker");
      }

      let historyFileUrl = '';
      if (formData.historyFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('document', formData.historyFile);
        
        try {
          historyFileUrl = await uploadFile(uploadFormData);
          if (!historyFileUrl) throw new Error("File upload failed - no URL returned");
        } catch (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }
      }

      const requestData = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        number: formData.number,
        address: formData.address,
        conditions: formData.conditions,
        history: historyFileUrl,
        caretaker: formData.caretaker,
        family: user.userName
      };

      await createRequest(requestData);

      // Reset form
      setFormData({
        name: '',
        age: '',
        gender: '',
        address: '',
        conditions: '',
        number: '',
        historyFile: null,
        caretaker: ''
      });
      
      const fileInput = document.getElementById('historyFile');
      if (fileInput) fileInput.value = '';

      alert("Request successfully created and sent!");

      const updatedRequests = await getRequests();
      setRequestsList(Array.isArray(updatedRequests) ? updatedRequests : []);

    } catch (error) {
      console.error("Submission error:", error);
      setLocalError(error.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDropdownStatusChange = async (requestId, event) => {
    const newStatus = event.target.value;
    const currentRequest = requestsList.find(r => r._id === requestId);
    
    if (!newStatus || newStatus === currentRequest?.Status?.toLowerCase()) {
      return;
    }

    setLocalError(null);
    if (contextError) setError(null);

    try {
      await updateRequestStatus(requestId, newStatus);

      // Update UI Optimistically or Refetch
      const updatedRequests = await getRequests();
      setRequestsList(Array.isArray(updatedRequests) ? updatedRequests : []);
      
    } catch (err) {
      console.error("Error updating status:", err);
      setLocalError(err.message || 'Failed to update request status.');
    }
  };

  const renderStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let borderColor = 'border-gray-300';
    let icon = '⚪';

    switch (normalizedStatus) {
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        borderColor = 'border-yellow-300';
        icon = '⏳';
        break;
      case 'accepted':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        borderColor = 'border-green-300';
        icon = '✅';
        break;
      case 'declined':
      case 'denied':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        borderColor = 'border-red-300';
        icon = '❌';
        break;
      default:
        break;
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor} flex-shrink-0`}>
        {icon} <span className="ml-1 capitalize">{normalizedStatus}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            {isFamily ? 'Request Caretaker' : 'Manage Care Requests'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isFamily 
              ? 'Fill out the details below to request care' 
              : 'Review and respond to incoming care requests'}
          </p>
        </div>

        {/* Display Errors */}
        {(localError || contextError) && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{localError || contextError}</span>
          </div>
        )}

        {/* Request Form (Family Only) */}
        {isFamily && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              New Request Details
            </h2>

            <form onSubmit={handleSubmitRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Caretaker Select */}
                <div className="md:col-span-2">
                  <label htmlFor="caretaker" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Caretaker
                  </label>
                  <select
                    id="caretaker"
                    name="caretaker"
                    value={formData.caretaker}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">-- Choose a Caretaker --</option>
                    {caretakersList.length > 0 ? (
                      caretakersList.map(ct => (
                        <option key={ct._id} value={ct.Username}>
                          {ct.Username}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading or no caretakers available...</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Conditions */}
              <div className="mt-6">
                <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  value={formData.conditions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* File Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Medical History (Optional)
                </label>
                <input
                  id="historyFile"
                  name="historyFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-all duration-200 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            {isFamily ? 'Your Sent Requests' : 'Incoming Requests'}
          </h2>

          {user ? (
            requestsList.length > 0 ? (
              <div className="space-y-4">
                {requestsList.slice().reverse().map(req => (
                  <div
                    key={req._id}
                    className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Request Header */}
                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {req.Names} (Age: {req.Age})
                      </h3>

                      {/* --- FIX START: Logic for Update Permissions --- */}
                      {/* If user is Caretaker, show Dropdown. If Family, show Badge */}
                      {isCaretaker ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 uppercase">Action:</span>
                          <select
                            name="statusUpdate"
                            value={req.Status?.toLowerCase() || 'pending'}
                            onChange={(e) => handleDropdownStatusChange(req._id, e)}
                            className="text-sm font-semibold border rounded-lg px-3 py-1 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400"
                            style={{ minWidth: '130px' }}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="accepted">✅ Accept</option>
                            <option value="declined">❌ Decline</option>
                          </select>
                        </div>
                      ) : (
                        renderStatusBadge(req.Status)
                      )}
                      {/* --- FIX END --- */}
                    </div>

                    {/* Request Details */}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Gender:</span> {req.Gender || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Condition:</span> {req.Condition || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span> {req.Address || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Emergency Contact:</span>{' '}
                        {req.Emergency_contact || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {isFamily ? 'Requested Caretaker:' : 'Requested By:'}
                        </span>{' '}
                        {isFamily ? req.Caretaker : req.Family_member}
                      </p>
                    </div>

                    {/* Medical History Link */}
                    {req.Medical_history && (
                      <a
                        href={req.Medical_history}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-3 inline-flex items-center gap-1"
                      >
                         📄 View Medical History Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {isFamily ? 'You have not sent any requests yet.' : 'No requests found.'}
              </p>
            )
          ) : (
            <p className="text-center text-gray-500 py-8">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;