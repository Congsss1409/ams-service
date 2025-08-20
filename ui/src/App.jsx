import React, { useState, useEffect } from 'react';
// We will load Bootstrap CSS dynamically to resolve the build error.
import { Form, Button, Spinner, Alert, Nav, Dropdown } from 'react-bootstrap';

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
            <img src={logoUrl} alt="Logo" style={{ width: '90px' }} />
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
                    <h1>Dashboard</h1>
                    <p>Welcome to the Accreditation Management System.</p>
                </main>
            </div>
        </div>
    );
}
