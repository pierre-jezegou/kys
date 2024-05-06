from chalice.test import Client
from app import app


def test_create_session():
    """Test the create session route."""
    with Client(app) as client:
        response = client.http.post('/session', json={'name': 'John Doe', 'university': 'UPC'})
        assert response.status_code == 200
        assert 'session_id' in response.json_body

def test_get_all_records():
    """Test the get all records route."""
    with Client(app) as client:
        response = client.http.get('/session')
        assert response.status_code == 200
        assert isinstance(response.json_body, list) # Be more specific

def test_get_record():
    """Test the get record route."""
    with Client(app) as client:
        session_id = '12345' # WILL NOT WORK: VALID SESSION_ID IS REQUIRED
        response = client.http.get(f'/session/{session_id}')
        assert response.status_code == 200
        assert 'session_id' in response.json_body
        assert response.json_body['session_id'] == session_id

def test_create_presigned_url():
    """Test the create presigned URL route."""
    with Client(app) as client:
        file_name = 'example.jpg' # TODO IMPORT IMAGE IN TEST FOLDER
        response = client.http.post(f'/presigned-url/{file_name}')
        assert response.status_code == 200
        assert 'presigned_url' in response.json_body

def test_check():
    """Test the check route."""
    with Client(app) as client:
        session_id = '12345' # WILL NOT WORK: VALID SESSION_ID IS REQUIRED
        response = client.http.get(f'/check/{session_id}')
        assert response.status_code == 200
        assert 'session_id' in response.json_body
        assert response.json_body['session_id'] == session_id
