import React, { useState, useEffect, useContext } from 'react';
import { ElderlyContext } from '../context/context'; // Adjust path if needed

const Contacts = () => {
  // --- Context Integration ---
  const { user, getContacts, addContact, error: contextError } = useContext(ElderlyContext);

  // --- State ---
  const [contacts, setContacts] = useState([]);
  // Removed isLoading state
  const [localError, setLocalError] = useState(null);
  const [newContact, setNewContact] = useState({ title: '', number: '' });

  // --- Fetch Contacts on Mount ---
  useEffect(() => {
    const fetchContacts = async () => {
      // Removed setIsLoading(true);
      setLocalError(null); // Clear previous errors
      try {
        const fetchedContacts = await getContacts();
        setContacts(fetchedContacts || []); // Ensure contacts is always an array
      } catch (err) {
        // Error is already set in context, but we can display it locally too
        setLocalError('Failed to load contacts.');
        console.error(err);
      }
      // Removed setIsLoading(false);
    };

    if (user) { // Only fetch if user is loaded
        fetchContacts();
    }
    // Removed setIsLoading(false); if no user
    // Dependency array includes user to refetch if the user changes (e.g., login/logout)
    // and getContacts function reference (though it should be stable)
  }, [user, getContacts]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.title || !newContact.number) {
      setLocalError('Please enter both a title and a number.');
      return;
    }
    // Removed setIsLoading(true);
    setLocalError(null);
    try {
      await addContact(newContact);
      setNewContact({ title: '', number: '' }); // Clear form
      // Refetch contacts to show the newly added one
      const updatedContacts = await getContacts();
      setContacts(updatedContacts || []);
    } catch (err) {
      setLocalError('Failed to add contact.');
      console.error(err);
    }
    // Removed setIsLoading(false);
  };

  // --- Contact Item Component (Internal) ---
  const ContactItem = ({ title, number }) => ( // Use title and number from backend
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4 flex-shrink-0">
        {title ? title.charAt(0).toUpperCase() : '?'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{title || 'No Title'}</h3>
        <p className="text-sm text-gray-600 truncate">{number || 'No Number'}</p>
      </div>
      <a
        href={`tel:${number}`}
        className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex-shrink-0"
      >
        Call
      </a>
    </div>
  );

  // --- Render Logic ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            {/* Title depends on role */}
            {user?.role === 'family' ? 'Manage Contacts' : 'Important Contacts'}
          </h1>
          <p className="text-gray-600 mt-2">
             {user?.role === 'family' ? 'Add and view important contacts' : 'Quick access to family and professionals'}
          </p>
        </div>

        {/* Removed Loading State Display */}

        {/* Error Display */}
        {(localError || contextError) && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{localError || contextError}</span>
          </div>
        )}

        {/* Conditional Content Based on Role */}
        {user ? ( // Render content if user exists
          <div className="space-y-8">
            {/* Add Contact Form (Family Only) */}
            {user.role === 'family' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Add New Contact</h2>
                <form onSubmit={handleAddContact} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <label htmlFor="title" className="block mb-1 font-medium text-gray-700 text-sm">Contact Name/Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newContact.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Doctor Smith, Mom"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="number" className="block mb-1 font-medium text-gray-700 text-sm">Phone Number</label>
                    <input
                      type="tel"
                      id="number"
                      name="number"
                      value={newContact.number}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                  >
                    Add Contact
                  </button>
                </form>
              </div>
            )}

            {/* Contacts List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                {user.role === 'family' ? 'Saved Contacts' : 'Contacts List'}
              </h2>
              <div className="space-y-3">
                {contacts && contacts.length > 0 ? (
                  contacts.map((contact, index) => (
                    <ContactItem
                      key={contact._id || `contact-${index}`}
                      title={contact.title}
                      number={contact.number}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No contacts found.</p>
                )}
              </div>
            </div>
          </div>
        ) : ( // Show login message if no user
             <p className="text-center text-red-600">Please log in to view contacts.</p>
        )}
      </div>
    </div>
  );
};

export default Contacts;