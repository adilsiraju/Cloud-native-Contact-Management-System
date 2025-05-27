import unittest
import json
from app import app

class ContactAPITestCase(unittest.TestCase):
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
        
    def test_get_contacts_empty(self):
        """Test getting contacts when none exist"""
        response = self.client.get('/api/contacts')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        
    def test_create_contact(self):
        """Test creating a new contact"""
        contact_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+1-234-567-8900',
            'company': 'Test Company'
        }
        response = self.client.post('/api/contacts',
                                  data=json.dumps(contact_data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['name'], contact_data['name'])
        self.assertEqual(data['email'], contact_data['email'])
        self.assertIn('id', data)
        self.assertIn('created_at', data)
        
    def test_create_contact_invalid_data(self):
        """Test creating contact with invalid data"""
        contact_data = {
            'name': '',  # Empty name should fail
            'email': 'invalid-email'  # Invalid email should fail
        }
        response = self.client.post('/api/contacts',
                                  data=json.dumps(contact_data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 400)
        
    def test_create_contact_missing_required_fields(self):
        """Test creating contact with missing required fields"""
        contact_data = {
            'phone': '+1-234-567-8900'  # Missing name and email
        }
        response = self.client.post('/api/contacts',
                                  data=json.dumps(contact_data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
