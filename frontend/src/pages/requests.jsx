/* eslint-disable no-unused-vars */
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

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      setLocalError(null);
      if (contextError) setError(null);

      let caretakers = [];
      let requests = [];

      try {
        console.log('Fetching data for user role:', user?.role);

        if (user?.role === 'family') {
          caretakers = await getCareTakers();
        }
        requests = await getRequests();

        setCaretakersList(Array.isArray(caretakers) ? caretakers : []);
        setRequestsList(Array.isArray(requests) ? requests : []);
        console.log('Fetched Requests:', requests);
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
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        historyFile: file,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        historyFile: null,
      }));
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!formData.caretaker) {
      setLocalError("Please select a caretaker.");
      return;
    }
    setIsSubmitting(true);
    setLocalError(null);

    let historyFileUrl = null;

    try {
      if (formData.historyFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('document', formData.historyFile);
        historyFileUrl = await uploadFile(uploadFormData);
        if (!historyFileUrl) {
          throw new Error("File upload succeeded but no URL was returned.");
        }
      }

      const requestData = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        number: formData.number,
        address: formData.address,
        conditions: formData.conditions,
        history: historyFileUrl || '',
        caretaker: formData.caretaker,
        family: user.userName,
      };

      await createRequest(requestData);

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

      try {
        document.getElementById('historyFile').value = null;
      } catch (err) {
        console.log('Could not reset file input');
      }

      alert("Request sent successfully!");
      const updatedRequests = await getRequests();
      setRequestsList(Array.isArray(updatedRequests) ? updatedRequests : []);
    } catch (err) {
      console.error("Error creating request:", err);
      setLocalError(err.message || 'Failed to send request. Please check details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDropdownStatusChange = async (requestId, event) => {
    const newStatus = event.target.value;
    console.log(`Dropdown change: Request ID=${requestId}, New Status=${newStatus}`);

    const currentRequest = requestsList.find(r => r._id === requestId);
    if (!newStatus || newStatus === 'unknown' || newStatus === currentRequest?.Status?.toLowerCase()) {
      console.log("Status not changed or invalid, skipping update.");
      return;
    }

    setLocalError(null);
    if (contextError) setError(null);

    try {
      console.log(`Calling updateRequestStatus for ID=${requestId} with status=${newStatus}`);
      await updateRequestStatus(requestId, newStatus);

      console.log("Refetching requests after status update...");
      const updatedRequests = await getRequests();
      setRequestsList(Array.isArray(updatedRequests) ? updatedRequests : []);
      console.log("Requests list updated.");
    } catch (err) {
      console.error("Error updating status:", err);
      setLocalError(err.message || 'Failed to update request status.');
    }
  };

  const renderStatusBadge = (status) => {
    status = status?.toLowerCase() || 'pending';
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let borderColor = 'border-gray-300';
    let icon = '⚪';

    switch (status) {
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
        {icon} <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            {user?.role === 'family' ? 'Request Caretaker' : 'Manage Care Requests'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'family' 
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
        {user?.role === 'family' && (
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
                    placeholder="e.g., John Doe"
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
                    min="1"
                    max="150"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 75"
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
                    Emergency Contact (Phone)
                  </label>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., +1 (555) 123-4567"
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
                      <option disabled>Loading or no caretakers...</option>
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
                  placeholder="e.g., 123 Main St, Apartment 4B, City, State, ZIP"
                />
              </div>

              {/* Conditions */}
              <div className="mt-6">
                <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions & Medications
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  value={formData.conditions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Diabetes, High blood pressure, Taking insulin twice daily"
                />
              </div>

              {/* File Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Medical History (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="historyFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="historyFile"
                          name="historyFile"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                    {formData.historyFile && (
                      <p className="text-xs text-green-600 mt-1 truncate">
                        Selected: {formData.historyFile.name}
                      </p>
                    )}
                  </div>
                </div>
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
                  {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            {user?.role === 'family' ? 'Your Sent Requests' : 'Incoming Requests'}
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

                      {/* Conditional Status Display/Update */}
                      {user?.role === 'caretaker' && req.Status?.toLowerCase() === 'pending' ? (
                        <select
                          name="statusUpdate"
                          value={req.Status?.toLowerCase() || 'pending'}
                          onChange={(e) => handleDropdownStatusChange(req._id, e)}
                          className="text-xs font-semibold border rounded-full px-3 py-1 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                          style={{ minWidth: '110px' }}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="accepted">✅ Accepted</option>
                          <option value="declined">❌ Declined</option>
                        </select>
                      ) : (
                        renderStatusBadge(req.Status)
                      )}
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
                          {user?.role === 'family' ? 'Requested Caretaker:' : 'Requested By:'}
                        </span>{' '}
                        {user?.role === 'family' ? req.Caretaker : req.Family_member}
                      </p>
                    </div>

                    {/* Medical History Link */}
                    {req.Medical_history && (
                      <a
                        href={req.Medical_history}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-3 inline-block"
                      >
                        📄 View Medical History Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No requests found.</p>
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