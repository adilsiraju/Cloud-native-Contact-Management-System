from flask import Flask, request, jsonify
from flask_cors import CORS
from cloudant.client import Cloudant
import os
import logging
import uuid
from datetime import datetime
from functools import wraps

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# IBM Cloudant configuration
CLOUDANT_URL = os.environ.get('CLOUDANT_URL')
CLOUDANT_API_KEY = os.environ.get('CLOUDANT_API_KEY')
DATABASE_NAME = os.environ.get('CLOUDANT_DATABASE', 'contacts_db')

# Initialize Cloudant client
client = None
database = None

def init_cloudant():
    """Initialize Cloudant database connection"""
    global client, database
    try:
        if CLOUDANT_URL and CLOUDANT_API_KEY:
            client = Cloudant.iam(
                account_name=CLOUDANT_URL.split('@')[1].split('.')[0],
                api_key=CLOUDANT_API_KEY,
                connect=True
            )
            
            # Create database if it doesn't exist
            if DATABASE_NAME not in client.all_dbs():
                database = client.create_database(DATABASE_NAME)
                logger.info(f"Created database: {DATABASE_NAME}")
            else:
                database = client[DATABASE_NAME]
                logger.info(f"Connected to existing database: {DATABASE_NAME}")
        else:
            logger.warning("Cloudant credentials not provided, using in-memory storage")
            
    except Exception as e:
        logger.error(f"Failed to initialize Cloudant: {str(e)}")
        database = None

def handle_errors(f):
    """Decorator for handling API errors"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
    return decorated_function

def validate_contact_data(data):
    """Validate contact data"""
    required_fields = ['name', 'email']
    for field in required_fields:
        if field not in data or not data[field].strip():
            return False, f"Missing required field: {field}"
    
    # Basic email validation
    if '@' not in data['email']:
        return False, "Invalid email format"
    
    return True, None

# In-memory storage for fallback (when Cloudant is not available)
contacts_memory = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for Kubernetes probes"""
    status = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database_connected': database is not None
    }
    return jsonify(status), 200

@app.route('/api/contacts', methods=['GET'])
@handle_errors
def get_contacts():
    """Get all contacts"""
    if database:
        try:
            contacts = []
            for doc in database:
                if not doc['_id'].startswith('_'):
                    contact = {
                        'id': doc['_id'],
                        'name': doc.get('name', ''),
                        'email': doc.get('email', ''),
                        'phone': doc.get('phone', ''),
                        'company': doc.get('company', ''),
                        'created_at': doc.get('created_at', ''),
                        'updated_at': doc.get('updated_at', '')
                    }
                    contacts.append(contact)
            return jsonify(contacts), 200
        except Exception as e:
            logger.error(f"Error fetching contacts from Cloudant: {str(e)}")
            return jsonify({'error': 'Database error'}), 500
    else:
        # Fallback to in-memory storage
        contacts = list(contacts_memory.values())
        return jsonify(contacts), 200

@app.route('/api/contacts/<contact_id>', methods=['GET'])
@handle_errors
def get_contact(contact_id):
    """Get a specific contact by ID"""
    if database:
        try:
            doc = database[contact_id]
            contact = {
                'id': doc['_id'],
                'name': doc.get('name', ''),
                'email': doc.get('email', ''),
                'phone': doc.get('phone', ''),
                'company': doc.get('company', ''),
                'created_at': doc.get('created_at', ''),
                'updated_at': doc.get('updated_at', '')
            }
            return jsonify(contact), 200
        except Exception as e:
            logger.error(f"Error fetching contact {contact_id}: {str(e)}")
            return jsonify({'error': 'Contact not found'}), 404
    else:
        # Fallback to in-memory storage
        if contact_id in contacts_memory:
            return jsonify(contacts_memory[contact_id]), 200
        else:
            return jsonify({'error': 'Contact not found'}), 404

@app.route('/api/contacts', methods=['POST'])
@handle_errors
def create_contact():
    """Create a new contact"""
    data = request.get_json()
    
    # Validate input data
    is_valid, error_message = validate_contact_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    contact_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    
    contact = {
        'id': contact_id,
        'name': data['name'].strip(),
        'email': data['email'].strip(),
        'phone': data.get('phone', '').strip(),
        'company': data.get('company', '').strip(),
        'created_at': timestamp,
        'updated_at': timestamp
    }
    
    if database:
        try:
            doc = contact.copy()
            doc['_id'] = contact_id
            database.create_document(doc)
            logger.info(f"Created contact: {contact_id}")
            return jsonify(contact), 201
        except Exception as e:
            logger.error(f"Error creating contact: {str(e)}")
            return jsonify({'error': 'Database error'}), 500
    else:
        # Fallback to in-memory storage
        contacts_memory[contact_id] = contact
        logger.info(f"Created contact in memory: {contact_id}")
        return jsonify(contact), 201

@app.route('/api/contacts/<contact_id>', methods=['PUT'])
@handle_errors
def update_contact(contact_id):
    """Update an existing contact"""
    data = request.get_json()
    
    # Validate input data
    is_valid, error_message = validate_contact_data(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    if database:
        try:
            doc = database[contact_id]
            doc['name'] = data['name'].strip()
            doc['email'] = data['email'].strip()
            doc['phone'] = data.get('phone', '').strip()
            doc['company'] = data.get('company', '').strip()
            doc['updated_at'] = datetime.utcnow().isoformat()
            doc.save()
            
            contact = {
                'id': doc['_id'],
                'name': doc['name'],
                'email': doc['email'],
                'phone': doc['phone'],
                'company': doc['company'],
                'created_at': doc['created_at'],
                'updated_at': doc['updated_at']
            }
            logger.info(f"Updated contact: {contact_id}")
            return jsonify(contact), 200
        except Exception as e:
            logger.error(f"Error updating contact {contact_id}: {str(e)}")
            return jsonify({'error': 'Contact not found'}), 404
    else:
        # Fallback to in-memory storage
        if contact_id in contacts_memory:
            contact = contacts_memory[contact_id]
            contact.update({
                'name': data['name'].strip(),
                'email': data['email'].strip(),
                'phone': data.get('phone', '').strip(),
                'company': data.get('company', '').strip(),
                'updated_at': datetime.utcnow().isoformat()
            })
            logger.info(f"Updated contact in memory: {contact_id}")
            return jsonify(contact), 200
        else:
            return jsonify({'error': 'Contact not found'}), 404

@app.route('/api/contacts/<contact_id>', methods=['DELETE'])
@handle_errors
def delete_contact(contact_id):
    """Delete a contact"""
    if database:
        try:
            doc = database[contact_id]
            doc.delete()
            logger.info(f"Deleted contact: {contact_id}")
            return '', 204
        except Exception as e:
            logger.error(f"Error deleting contact {contact_id}: {str(e)}")
            return jsonify({'error': 'Contact not found'}), 404
    else:
        # Fallback to in-memory storage
        if contact_id in contacts_memory:
            del contacts_memory[contact_id]
            logger.info(f"Deleted contact from memory: {contact_id}")
            return '', 204
        else:
            return jsonify({'error': 'Contact not found'}), 404

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize Cloudant connection
    init_cloudant()
    
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    app.run(host='0.0.0.0', port=port, debug=False)
