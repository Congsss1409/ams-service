import React, { useState, useEffect } from 'react';
// We will load Bootstrap CSS dynamically to resolve the build error.
import { Container, Row, Col, Form, Button, Spinner, Alert, Nav, Dropdown, Table, Modal } from 'react-bootstrap';

// --- Asset URLs ---
// IMPORTANT: Place your LOGO (1).png and bg.jpg files in the `public` folder of your React project.
const logoUrl = '/LOGO (1).png';
const backgroundImageUrl = '/bg.jpg'; // Using the bg.jpg file from the public folder

// --- Helper component to load CSS and apply global styles ---
function StyleLoader() {
  useEffect(() => {
    // Inject global styles to force full-screen layout
    const globalStyle = document.createElement('style');
    globalStyle.innerHTML = `
      html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden; /* Prevents horizontal scrollbar */
      }
    `;
    document.head.appendChild(globalStyle);

    // Load Bootstrap CSS
    const bootstrapLink = document.createElement('link');
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
    bootstrapLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapLink);

    // Load Bootstrap Icons CSS
    const bootstrapIconsLink = document.createElement('link');
    bootstrapIconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css';
    bootstrapIconsLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapIconsLink);

    // Load Google Fonts
    const googleFontsLink = document.createElement('link');
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap';
    googleFontsLink.rel = 'stylesheet';
    document.head.appendChild(googleFontsLink);


    return () => {
      document.head.removeChild(globalStyle);
      document.head.removeChild(bootstrapLink);
      document.head.removeChild(bootstrapIconsLink);
      document.head.removeChild(googleFontsLink);
    };
  }, []);

  return null;
}


// --- Main App Component ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return (
    <>
      <StyleLoader />
      {token ? (
        <DashboardLayout onLogout={handleLogout} token={token} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

// --- Login Page Component ---
function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      if (data.access_token) {
        onLoginSuccess(data.access_token);
      } else {
        throw new Error('Login failed: No access token received.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Styles for the new layout
  const mainContainerStyles = {
    display: 'flex',
    height: '100%',
    width: '100%',
    fontFamily: "'Poppins', sans-serif"
  };

  const formColumnStyles = {
    flex: '1 1 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '2rem'
  };

  const brandingColumnStyles = {
    flex: '1 1 50%',
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left'
  };

  return (
    <div style={mainContainerStyles}>
      {/* Form Column */}
      <div style={formColumnStyles}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          <div className="text-center mb-4">
            <img src={logoUrl} alt="Logo" style={{ width: '120px' }} />
            <h2 className="mt-3 fw-bold">Sign in</h2>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: '0.5rem' }} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password <span className="text-danger">*</span></Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderRadius: '0.5rem' }} />
            </Form.Group>
            <Button type="submit" disabled={isLoading} style={{ backgroundColor: '#5044e4', border: 'none', width: '100%', borderRadius: '2rem', fontWeight: '700', padding: '0.75rem' }}>
              {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Sign in'}
            </Button>
          </Form>
        </div>
      </div>
      {/* Branding Column */}
      <div style={brandingColumnStyles} className="d-none d-lg-flex">
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', color: 'white' }}>School Management<br />System III</h1>
          <p style={{ color: 'white' }}>Accreditation Management System</p>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard Components ---

function Sidebar({ user }) {
    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase().slice(0, 2);
    };

    return (
        <div className="d-flex flex-column flex-shrink-0" style={{ width: '280px', minHeight: '100vh', backgroundColor: '#1e3a8a', color: 'white' }}>
            <div style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#3B71CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', margin: '0 auto 0.5rem' }}>
                    {getInitials(user?.name)}
                </div>
                <h5 className="mb-0">{user?.name || 'Loading...'}</h5>
                <small>{user?.email || '...'}</small>
            </div>

            <Nav defaultActiveKey="/dashboard" className="flex-column nav-pills">
                <Nav.Link href="#" className="text-white d-flex align-items-center" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#284b9a', borderLeft: '3px solid #3B71CA' }}>
                    <i className="bi bi-speedometer2 me-3"></i> Dashboard
                </Nav.Link>
                <Nav.Link href="#" className="d-flex align-items-center" style={{ color: '#bdc3c7', padding: '0.75rem 1.5rem', borderLeft: '3px solid transparent' }}>
                    <i className="bi bi-file-earmark-text me-3"></i> Document Repository
                </Nav.Link>
                 <Nav.Link href="#" className="d-flex align-items-center" style={{ color: '#bdc3c7', padding: '0.75rem 1.5rem', borderLeft: '3px solid transparent' }}>
                    <i className="bi bi-list-check me-3"></i> Compliance Matrix
                </Nav.Link>
            </Nav>
        </div>
    );
}

function TopNavbar({ onLogout, onToggleSidebar }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6', padding: '0.5rem 1.5rem' }}>
            <div>
                <Button variant="light" onClick={onToggleSidebar}><i className="bi bi-list"></i></Button>
            </div>
            <div className="d-flex align-items-center">
                <span className="me-3 d-none d-sm-inline">{time}</span>
                <a href="#" className="text-dark me-3"><i className="bi bi-bell fs-5"></i></a>
                <Dropdown>
                    <Dropdown.Toggle as="a" href="#" className="link-dark text-decoration-none">
                        <i className="bi bi-person-circle fs-4"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Header>Main User</Dropdown.Header>
                        <Dropdown.Item href="#">Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </nav>
    );
}

// --- NEW Program Management Component ---
function ProgramManagementPage({ token, onLogout }) {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentProgram, setCurrentProgram] = useState({ id: null, name: '', accreditation_level: '', status: '' });

    const fetchPrograms = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/programs', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to fetch programs.');
            const data = await response.json();
            setPrograms(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [token]);

    const handleShowModal = (program = null) => {
        if (program) {
            setCurrentProgram(program);
        } else {
            setCurrentProgram({ id: null, name: '', accreditation_level: '', status: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSaveProgram = async () => {
        const url = currentProgram.id 
            ? `http://localhost:8000/api/programs/${currentProgram.id}`
            : 'http://localhost:8000/api/programs';
        
        const method = currentProgram.id ? 'PUT' : 'POST';

        // **FIX:** Create a payload with only the fields the backend expects.
        const payload = {
            name: currentProgram.name,
            accreditation_level: currentProgram.accreditation_level,
            status: currentProgram.status,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload) // <-- Use the cleaned payload
            });
            if (!response.ok) throw new Error('Failed to save program.');
            fetchPrograms(); // Refresh the list
            handleCloseModal();
        } catch (err) {
            // You can add more specific error handling here
            alert(err.message);
        }
    };

    const handleDeleteProgram = async (id) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/programs/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (!response.ok) throw new Error('Failed to delete program.');
                fetchPrograms(); // Refresh the list
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Program Management</h1>
                <Button onClick={() => handleShowModal()} style={{ backgroundColor: '#5044e4', border: 'none' }}>
                    <i className="bi bi-plus-circle me-2"></i> Add Program
                </Button>
            </div>

            {isLoading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {!isLoading && !error && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Program Name</th>
                            <th>Accreditation Level</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(program => (
                            <tr key={program.id}>
                                <td>{program.id}</td>
                                <td>{program.name}</td>
                                <td>{program.accreditation_level}</td>
                                <td>{program.status}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(program)}>
                                        <i className="bi bi-pencil-square"></i> Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                                        <i className="bi bi-trash"></i> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentProgram.id ? 'Edit Program' : 'Add New Program'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Program Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentProgram.name}
                                onChange={(e) => setCurrentProgram({...currentProgram, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Accreditation Level</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentProgram.accreditation_level}
                                onChange={(e) => setCurrentProgram({...currentProgram, accreditation_level: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentProgram.status}
                                onChange={(e) => setCurrentProgram({...currentProgram, status: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveProgram} style={{ backgroundColor: '#5044e4', border: 'none' }}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


function DashboardLayout({ onLogout, token }) {
    const [user, setUser] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch user data');
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                // If token is invalid, log out
                onLogout();
            }
        };
        fetchUser();
    }, [token, onLogout]);

    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f7f6' }}>
            {sidebarVisible && <Sidebar user={user} />}
            <div className="d-flex flex-column" style={{ flex: 1 }}>
                <TopNavbar onLogout={onLogout} onToggleSidebar={toggleSidebar} />
                <main className="p-4 flex-grow-1">
                    {/* Replace the placeholder with the new Program Management component */}
                    <ProgramManagementPage token={token} onLogout={onLogout} />
                </main>
            </div>
        </div>
    );
}
