import React from 'react';

const ContactList = ({ contacts, onEdit, onDelete }) => {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No contacts found</h3>
        <p>Start by adding your first contact using the form above.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="contacts-grid">
      {contacts.map((contact) => (
        <div key={contact.id} className="contact-card">
          <div className="contact-name">{contact.name}</div>
          
          <div className="contact-info">
            <strong>Email:</strong> 
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          
          {contact.phone && (
            <div className="contact-info">
              <strong>Phone:</strong> 
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </div>
          )}
          
          {contact.company && (
            <div className="contact-info">
              <strong>Company:</strong> {contact.company}
            </div>
          )}
          
          <div className="contact-info">
            <strong>Added:</strong> {formatDate(contact.created_at)}
          </div>
          
          {contact.updated_at && contact.updated_at !== contact.created_at && (
            <div className="contact-info">
              <strong>Updated:</strong> {formatDate(contact.updated_at)}
            </div>
          )}
          
          <div className="contact-actions">
            <button
              className="btn btn-secondary btn-small"
              onClick={() => onEdit(contact)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-small"
              onClick={() => onDelete(contact.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
