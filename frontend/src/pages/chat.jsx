import React from 'react';

const Contacts = () => {
  // Sample data for contacts
  const familyContacts = [
    { id: 1, name: 'Mom', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Dad', phone: '+1 (555) 987-6543' },
    { id: 3, name: 'Sister', phone: '+1 (555) 246-8101' },
    { id: 4, name: 'Brother', phone: '+1 (555) 135-7924' },
  ];

  const professionalContacts = [
    { id: 5, name: 'Dr. Sarah Johnson', phone: '+1 (555) 111-2222', specialty: 'Cardiologist' },
    { id: 6, name: 'Dr. Michael Chen', phone: '+1 (555) 333-4444', specialty: 'Primary Care' },
    { id: 7, name: 'Nurse Emma Davis', phone: '+1 (555) 555-6666', specialty: 'Oncology' },
    { id: 8, name: 'Pharmacist James Wilson', phone: '+1 (555) 777-8888', specialty: 'General' },
  ];

  // Function to render a contact item with a call button
  const ContactItem = ({ name, phone, specialty = null }) => (
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{name}</h3>
        {specialty && <p className="text-sm text-gray-500 truncate">{specialty}</p>}
        <p className="text-sm text-gray-600 truncate">{phone}</p>
      </div>
      <a
        href={`tel:${phone}`}
        className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
      >
        Call
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Caretaker Contacts
          </h1>
          <p className="text-gray-600 mt-2">Quick access to family and healthcare professionals</p>
        </div>

        {/* Contact Sections */}
        <div className="space-y-8">
          {/* Family Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Family</h2>
            <div className="space-y-3">
              {familyContacts.map(contact => (
                <ContactItem
                  key={`family-${contact.id}`}
                  name={contact.name}
                  phone={contact.phone}
                />
              ))}
            </div>
          </div>

          {/* Professional Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">Doctors & Professionals</h2>
            <div className="space-y-3">
              {professionalContacts.map(contact => (
                <ContactItem
                  key={`prof-${contact.id}`}
                  name={contact.name}
                  phone={contact.phone}
                  specialty={contact.specialty}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts; // Renamed component to Contacts