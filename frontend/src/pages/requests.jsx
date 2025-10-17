import React, { useState } from 'react';

const Requests = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientAddress: '',
    medicalConditions: '',
    emergencyContact: '',
    medicalHistoryFile: null,
  });

  // State for request status (simulated)
  const [requestStatus, setRequestStatus] = useState(null); // 'pending', 'accepted', 'denied', or null (no request sent)
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle submission state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Validate file type/size here if needed
      setFormData((prevData) => ({
        ...prevData,
        medicalHistoryFile: file,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      // Reset form (optional, you might want to clear only specific fields)
      // setFormData({
      //   patientName: '',
      //   patientAge: '',
      //   patientGender: '',
      //   patientAddress: '',
      //   medicalConditions: '',
      //   emergencyContact: '',
      //   medicalHistoryFile: null,
      // });

      // Set status to pending
      setRequestStatus('pending');
      setIsSubmitting(false);
    }, 1500); // Simulate 1.5 second delay
  };

  // Handle status update (for simulation)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Request Caretaker
          </h1>
          <p className="text-gray-600 mt-2">Fill out the details below to request care</p>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Age
                </label>
                <input
                  type="number"
                  id="patientAge"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  required
                  min="1"
                  max="150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 75"
                />
              </div>

              <div>
                <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Gender
                </label>
                <select
                  id="patientGender"
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact (Phone)
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="patientAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Patient Address
              </label>
              <textarea
                id="patientAddress"
                name="patientAddress"
                value={formData.patientAddress}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123 Main St, Anytown, ST 12345"
              ></textarea>
            </div>

            <div className="mt-6">
              <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">
                Medical Conditions & Medications
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Diabetes, Hypertension, Takes Metformin 500mg daily..."
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Medical History Document
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="medicalHistoryFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="medicalHistoryFile"
                        name="medicalHistoryFile"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify allowed file types
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                  {formData.medicalHistoryFile && (
                    <p className="text-xs text-green-600 mt-1 truncate">
                      Selected: {formData.medicalHistoryFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting} // Disable button while submitting
                className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Request Status Section */}
        {requestStatus && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Your caretaker request</p>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  requestStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : requestStatus === 'accepted'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {requestStatus === 'pending' ? '⏳ Pending' : requestStatus === 'accepted' ? '✅ Accepted' : '❌ Denied'}
                </div>
              </div>
              {/* Optional: Simulate status change buttons for demonstration */}
              {/* <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                  disabled={requestStatus !== 'pending'}
                >
                  Accept (Simulate)
                </button>
                <button
                  onClick={() => handleStatusUpdate('denied')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
                  disabled={requestStatus !== 'pending'}
                >
                  Deny (Simulate)
                </button>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;