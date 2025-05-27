import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../components/ContactForm';

// Mock the contactService
jest.mock('../services/contactService', () => ({
  contactService: {
    createContact: jest.fn(),
    updateContact: jest.fn(),
  },
}));

describe('ContactForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields', () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add contact/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /add contact/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('shows validation error for invalid email', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /add contact/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const companyInput = screen.getByLabelText(/company/i);
    const submitButton = screen.getByRole('button', { name: /add contact/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1-234-567-8900' } });
    fireEvent.change(companyInput, { target: { value: 'Example Corp' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-234-567-8900',
        company: 'Example Corp',
      });
    });
  });

  test('shows cancel button when editing', () => {
    const initialData = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      company: 'Example Corp',
    };

    render(
      <ContactForm 
        onSubmit={mockOnSubmit} 
        initialData={initialData}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByRole('button', { name: /update contact/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', () => {
    const initialData = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    render(
      <ContactForm 
        onSubmit={mockOnSubmit} 
        initialData={initialData}
        onCancel={mockOnCancel}
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
