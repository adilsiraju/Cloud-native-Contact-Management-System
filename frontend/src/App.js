import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import SearchBar from './components/SearchBar';
import { contactService } from './services/contactService';

function App() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Filter contacts when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactService.getContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError('Failed to load contacts. Please try again.');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (contactData) => {
    try {
      setError('');
      const newContact = await contactService.createContact(contactData);
      setContacts(prev => [...prev, newContact]);
      setSuccess('Contact created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create contact. Please try again.');
      console.error('Error creating contact:', err);
    }
  };

  const handleUpdateContact = async (contactId, contactData) => {
    try {
      setError('');
      const updatedContact = await contactService.updateContact(contactId, contactData);
      setContacts(prev => prev.map(contact =>
        contact.id === contactId ? updatedContact : contact
      ));
      setEditingContact(null);
      setSuccess('Contact updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update contact. Please try again.');
      console.error('Error updating contact:', err);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      setError('');
      await contactService.deleteContact(contactId);
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setSuccess('Contact deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete contact. Please try again.');
      console.error('Error deleting contact:', err);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Contact Management System</h1>
        <p>Cloud-Native Application on IBM Cloud</p>
      </header>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="contacts-section">
        <h2 className="section-title">
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        <ContactForm
          onSubmit={editingContact ? 
            (data) => handleUpdateContact(editingContact.id, data) : 
            handleCreateContact
          }
          initialData={editingContact}
          onCancel={editingContact ? handleCancelEdit : null}
        />
      </div>

      <div className="contacts-section">
        <h2 className="section-title">Contacts ({filteredContacts.length})</h2>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search contacts by name, email, or company..."
        />

        {loading ? (
          <div className="loading">Loading contacts...</div>
        ) : (
          <ContactList
            contacts={filteredContacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        )}
      </div>
    </div>
  );
}

export default App;
