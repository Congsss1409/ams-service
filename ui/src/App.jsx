import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Nav, Dropdown, Table, Modal, Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap';
import { apiFetch } from './api';

// --- Asset URLs ---
const logoUrl = '/LOGO (1).png';
const backgroundImageUrl = '/bg.jpg';

// --- Helper component to load CSS and apply global styles ---
function StyleLoader() {
  useEffect(() => {
    const globalStyle = document.createElement('style');
    globalStyle.innerHTML = `
      :root {
          --sidebar-blue: #1e3a8a;
          --primary-purple: #5044e4;
          --background-light: #f4f7f6;
          --card-white: #ffffff;
          --text-primary: #212529;
          --text-secondary: #6c757d;
          --sidebar-width: 280px;
      }
      html, body, #root { 
          height: 100%; 
          width: 100%; 
          margin: 0; 
          padding: 0; 
          background-color: var(--background-light);
          font-family: 'Poppins', sans-serif;
      }
      .content-card {
          background-color: var(--card-white);
          border: none;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0,0,0,.05);
          padding: 1.5rem;
      }
      .table thead th {
          font-weight: 600;
          color: var(--text-secondary);
          border: none;
          background-color: #f9fafb;
          font-size: 0.8rem;
          text-transform: uppercase;
      }
      .table tbody td {
          vertical-align: middle;
          border-top: 1px solid #dee2e6;
      }
      .main-wrapper {
        display: flex;
        min-height: 100vh;
      }
      .main-content {
        padding: 1.5rem 2.5rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: calc(100% - var(--sidebar-width));
      }
      .notification-item {
        white-space: normal;
        max-width: 350px;
      }
      .notification-item small {
        font-size: 0.75rem;
      }
      .notification-item .btn-close {
        --bs-btn-close-focus-shadow: none;
      }
    `;
    document.head.appendChild(globalStyle);
    
    const bootstrapLink = document.createElement('link');
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    bootstrapLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapLink);
    const bootstrapIconsLink = document.createElement('link');
    bootstrapIconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    bootstrapIconsLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapIconsLink);
    const googleFontsLink = document.createElement('link');
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    googleFontsLink.rel = 'stylesheet';
    document.head.appendChild(googleFontsLink);
    const sweetAlertScript = document.createElement('script');
    sweetAlertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.body.appendChild(sweetAlertScript);

    return () => {
      document.head.removeChild(globalStyle);
      document.head.removeChild(bootstrapLink);
      document.head.removeChild(bootstrapIconsLink);
      document.head.removeChild(googleFontsLink);
      document.body.removeChild(sweetAlertScript);
    };
  }, []);
  return null;
}

// --- Main App Component ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
        const response = await apiFetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setUser(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        handleLogout();
    }
  };
  
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    fetchUser();
  };

  const handleLogout = () => {
    apiFetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };
  
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token]);

  return (
    <>
      <StyleLoader />
      {token && user ? <DashboardLayout user={user} onLogout={handleLogout} setUser={setUser} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
    </>
  );
}

// --- Login Page ---
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
      const response = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed.');
      if (data.access_token) onLoginSuccess(data.access_token);
      else throw new Error('Login failed: No access token received.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const mainContainerStyles = { display: 'flex', height: '100vh', width: '100%', fontFamily: "'Poppins', sans-serif" };
  const formColumnStyles = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '2rem' };
  const brandingColumnStyles = { flex: '1 1 50%', backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'left' };

  return (
    <div style={mainContainerStyles}>
      <div style={formColumnStyles}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          <div className="text-center mb-4"><img src={logoUrl} alt="Logo" style={{ width: '120px' }} /><h2 className="mt-3 fw-bold">Sign in</h2></div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3"><Form.Label>Username <span className="text-danger">*</span></Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: '0.5rem' }} /></Form.Group>
            <Form.Group className="mb-4"><Form.Label>Password <span className="text-danger">*</span></Form.Label><Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderRadius: '0.5rem' }} /></Form.Group>
            <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'var(--primary-purple)', border: 'none', width: '100%', borderRadius: '2rem', fontWeight: '700', padding: '0.75rem' }}>{isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Sign in'}</Button>
          </Form>
        </div>
      </div>
      <div style={brandingColumnStyles} className="d-none d-lg-flex"><div><h1 style={{ fontSize: '3.5rem', fontWeight: '700' }}>School Management<br />System III</h1><p>Accreditation Management System</p></div></div>
    </div>
  );
}

// --- Dashboard Components ---
function Sidebar({ user, onViewChange, currentView }) {
  const isAdmin = user && user.role && user.role.name.toLowerCase() === 'admin';
  const getInitials = (name) => !name ? '' : name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getDisplayName = (user) => !user ? 'Loading...' : [user.name, user.middle_name, user.last_name, user.suffix].filter(Boolean).join(' ');
  const navLinkStyle = (viewName) => ({
    color: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
    fontWeight: 500,
    backgroundColor: currentView === viewName ? 'var(--primary-purple)' : 'transparent',
    cursor: 'pointer',
  });
  return (
    <aside style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--sidebar-blue)', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', flexShrink: 0 }}>
      <div className="text-center" style={{ padding: '0 0.5rem 1.5rem 0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '2rem', margin: '0 auto 1rem' }}>{getInitials(user?.name)}</div>
        <h5 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{getDisplayName(user)}</h5>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>{user?.email || '...'}</p>
        <Badge pill bg="info" className="mt-2">{user?.role?.name || 'User'}</Badge>
      </div>
      <Nav as="ul" className="flex-column" style={{ listStyle: 'none', paddingLeft: 0, flexGrow: 1 }}>
        <li style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', padding: '1rem 0.5rem 0.5rem', fontWeight: 600, letterSpacing: '0.5px' }}>Main Menu</li>
        <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('DASHBOARD')} style={navLinkStyle('DASHBOARD')}><i className="bi bi-speedometer2 me-3 fs-5"></i> Dashboard</a></Nav.Item>
        <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('PROGRAMS')} style={navLinkStyle('PROGRAMS')}><i className="bi bi-card-list me-3 fs-5"></i> Program Management</a></Nav.Item>
        <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('DOCUMENTS')} style={navLinkStyle('DOCUMENTS')}><i className="bi bi-file-earmark-text me-3 fs-5"></i> Document Repository</a></Nav.Item>
        <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('COMPLIANCE')} style={navLinkStyle('COMPLIANCE')}><i className="bi bi-list-check me-3 fs-5"></i> Compliance Matrix</a></Nav.Item>
        {isAdmin && (
            <>
                <li style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', padding: '1rem 0.5rem 0.5rem', fontWeight: 600, letterSpacing: '0.5px' }}>Administration</li>
                <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('FACILITIES')} style={navLinkStyle('FACILITIES')}><i className="bi bi-building me-3 fs-5"></i> Facilities Monitoring</a></Nav.Item>
                <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('ACTION_PLANS')} style={navLinkStyle('ACTION_PLANS')}><i className="bi bi-clipboard-check me-3 fs-5"></i> Action Plans</a></Nav.Item>
                <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('AUDIT_SCHEDULE')} style={navLinkStyle('AUDIT_SCHEDULE')}><i className="bi bi-calendar-check me-3 fs-5"></i> Audit Scheduler</a></Nav.Item>
                <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('ACCREDITOR_VISIT')} style={navLinkStyle('ACCREDITOR_VISIT')}><i className="bi bi-person-check me-3 fs-5"></i> Accreditor Visits</a></Nav.Item>
                <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('USERS')} style={navLinkStyle('USERS')}><i className="bi bi-people me-3 fs-5"></i> User Management</a></Nav.Item>
            </>
        )}
        <li style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', padding: '1rem 0.5rem 0.5rem', fontWeight: 600, letterSpacing: '0.5px' }}>Account</li>
        <Nav.Item as="li" className="mb-1"><a onClick={() => onViewChange('PROFILE')} style={navLinkStyle('PROFILE')}><i className="bi bi-person-circle me-3 fs-5"></i> Profile</a></Nav.Item>
      </Nav>
    </aside>
  );
}

function TopNavbar({ onLogout, onToggleSidebar, currentView, user, onViewChange, notifications, onMarkAsRead, onMarkAllRead, onClearAll, onDeleteNotification }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    useEffect(() => { 
      const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })), 1000); 
      return () => clearInterval(timer); 
    }, []);
    const pageTitle = currentView.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    return (
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="link" onClick={onToggleSidebar} style={{ background: 'none', border: 'none', fontSize: '1.5rem', marginRight: '1.5rem', color: 'var(--text-secondary)' }}><i className="bi bi-list"></i></Button>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0"><li className="breadcrumb-item"><a href="#" onClick={(e) => { e.preventDefault(); onViewChange('DASHBOARD'); }} style={{ textDecoration: 'none', color: 'var(--primary-purple)' }}>AMS Portal</a></li><li className="breadcrumb-item active" aria-current="page">{pageTitle}</li></ol></nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)' }}>
          <span>{time}</span>
          <Dropdown autoClose="outside">
            <Dropdown.Toggle as="a" href="#" className="text-secondary position-relative" style={{textDecoration: 'none'}}>
              <i className="bi bi-bell-fill fs-5"></i>
              {notifications.length > 0 && <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{fontSize: '0.6em'}}>{notifications.length}</Badge>}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="p-2 shadow-lg" style={{width: '380px', maxHeight: '400px', overflowY: 'auto'}}>
              <div className="d-flex justify-content-between align-items-center px-2 pb-2">
                <h6 className="mb-0">Notifications</h6>
                <div>
                  <Button variant="link" size="sm" className="text-decoration-none" onClick={onMarkAllRead}>Mark all read</Button>
                  <Button variant="link" size="sm" className="text-decoration-none text-danger" onClick={onClearAll}>Clear all</Button>
                </div>
              </div>
              <Dropdown.Divider className="my-0" />
              {notifications.length > 0 ? (
                  notifications.map(notification => (
                      <Dropdown.Item key={notification.id} className="notification-item d-flex align-items-start p-2">
                          <div className="flex-grow-1" onClick={() => onMarkAsRead(notification.id)}>
                            <div className="fw-bold">{notification.type === 'broadcast' ? 'Announcement' : (notification.message.split("'")[1] || 'New Update')}</div>
                            <div className="text-muted small">{notification.message}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(notification.created_at).toLocaleString()}</div>
                          </div>
                          <Button variant="close" className="ms-2" onClick={(e) => { e.stopPropagation(); onDeleteNotification(notification.id); }} />
                      </Dropdown.Item>
                  ))
              ) : (
                  <div className="text-center p-3">
                      <i className="bi bi-bell fs-2 text-muted"></i>
                      <p className="mt-2 mb-0">No new notifications</p>
                  </div>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
              <Dropdown.Toggle as="a" href="#" className="text-secondary" style={{textDecoration: 'none'}}><i className="bi bi-person-circle fs-4"></i></Dropdown.Toggle>
              <Dropdown.Menu align="end">
                  <Dropdown.Header>Signed in as<br/><strong>{user?.email}</strong></Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => onViewChange('PROFILE')}><i className="bi bi-person-fill me-2"></i> Profile</Dropdown.Item>
                  <Dropdown.Item onClick={onLogout}><i className="bi bi-box-arrow-right me-2"></i> Sign out</Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
    );
  }
  
  // --- All Page Components ---
  function DashboardHomepage() {
      const [analysisData, setAnalysisData] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState('');
  
      useEffect(() => {
          const fetchAnalysis = async () => {
              setIsLoading(true);
              try {
                  const response = await apiFetch('/api/gap-analysis/overall-status');
                  if (!response.ok) throw new Error('Failed to fetch gap analysis data.');
                  const data = await response.json();
                  setAnalysisData(data);
              } catch (err) { setError(err.message); } finally { setIsLoading(false); }
          };
          fetchAnalysis();
      }, []);
  
      const getStatusVariant = (status) => ({ 'At Risk': 'danger', 'Needs Attention': 'warning', 'On Track': 'success' }[status] || 'secondary');
  
      return (
          <div className="content-card">
              <h1 className="mb-4">Compliance Dashboard</h1>
              {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
                  <Row>
                      {analysisData.map(item => (
                          <Col md={6} lg={4} key={item.program_id} className="mb-4">
                              <Card className="h-100">
                                  <Card.Header as="h5" className="d-flex justify-content-between align-items-center">{item.program_name}<Badge bg={getStatusVariant(item.predicted_status)}>{item.predicted_status}</Badge></Card.Header>
                                  <Card.Body>
                                      <div className="text-center mb-3"><h3 className="display-4">{item.compliance_percentage}%</h3><span>Compliant</span></div>
                                      <ProgressBar variant={getStatusVariant(item.predicted_status)} now={item.compliance_percentage} />
                                      <Card.Text className="mt-3 text-center">{item.compliant_criteria} of {item.total_criteria} criteria met.</Card.Text>
                                  </Card.Body>
                              </Card>
                          </Col>
                      ))}
                  </Row>
              }
          </div>
      );
  }
  
  function ProgramManagementPage({ onManageDocuments, onManageActionPlans, isAdmin }) {
      const [programs, setPrograms] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [currentProgram, setCurrentProgram] = useState({ id: null, name: '', accreditation_level: 'Candidate', status: '' });
      const fetchPrograms = async (showLoader = true) => {
          if (showLoader) setIsLoading(true);
          try {
              const response = await apiFetch('/api/programs');
              if (!response.ok) throw new Error('Failed to fetch programs.');
              const data = await response.json();
              setPrograms(data);
          } catch (err) { setError(err.message); } finally { if (showLoader) setIsLoading(false); }
      };
      useEffect(() => { fetchPrograms(); }, []);
      const handleShowModal = (program = null) => {
          setCurrentProgram(program || { id: null, name: '', accreditation_level: 'Candidate', status: '' });
          setShowModal(true);
      };
      const handleCloseModal = () => setShowModal(false);
      const handleSaveProgram = async () => {
          setIsSaving(true);
          const url = currentProgram.id ? `/api/programs/${currentProgram.id}` : '/api/programs';
          const method = currentProgram.id ? 'PUT' : 'POST';
          try {
              const response = await apiFetch(url, { method, body: JSON.stringify(currentProgram) });
              if (!response.ok) throw new Error('Failed to save program.');
              await fetchPrograms(false);
              handleCloseModal();
              window.Swal.fire('Success!', 'Program saved successfully.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
      const handleDeleteProgram = (id) => {
          window.Swal.fire({ title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/programs/${id}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete program.');
                          fetchPrograms();
                          window.Swal.fire('Deleted!', 'The program has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };
      return (<div className="content-card">
          <div className="d-flex justify-content-between align-items-center mb-4"><h1>Program Management</h1>{isAdmin && <Button onClick={() => handleShowModal()} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-plus-circle me-2"></i> Add Program</Button>}</div>
          {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
              <Table striped bordered hover responsive><thead><tr><th>ID</th><th>Program Name</th><th>Accreditation Level</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>{programs.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.accreditation_level}</td><td>{p.status}</td><td>
                      {isAdmin && <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(p)}><i className="bi bi-pencil-square"></i> Edit</Button>}
                      {isAdmin && <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleDeleteProgram(p.id)}><i className="bi bi-trash"></i> Delete</Button>}
                      <Button variant="outline-info" size="sm" className="me-2" onClick={() => onManageDocuments(p)}><i className="bi bi-folder"></i> Docs</Button>
                      {isAdmin && <Button variant="outline-success" size="sm" onClick={() => onManageActionPlans(p)}><i className="bi bi-clipboard-check"></i> Plans</Button>}
                  </td></tr>)}</tbody>
              </Table>}
          <Modal show={showModal} onHide={handleCloseModal}><Modal.Header closeButton><Modal.Title>{currentProgram.id ? 'Edit Program' : 'Add New Program'}</Modal.Title></Modal.Header><Modal.Body><Form>
              <Form.Group className="mb-3"><Form.Label>Program Name</Form.Label><Form.Control type="text" defaultValue={currentProgram.name} onChange={(e) => setCurrentProgram({ ...currentProgram, name: e.target.value })} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Accreditation Level</Form.Label><Form.Select defaultValue={currentProgram.accreditation_level} onChange={(e) => setCurrentProgram({ ...currentProgram, accreditation_level: e.target.value })}><option value="Candidate">Candidate</option><option value="Level 1">Level 1</option><option value="Level 2">Level 2</option><option value="Level 3">Level 3</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Control type="text" defaultValue={currentProgram.status} onChange={(e) => setCurrentProgram({ ...currentProgram, status: e.target.value })} /></Form.Group>
          </Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Close</Button><Button variant="primary" onClick={handleSaveProgram} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button></Modal.Footer></Modal>
      </div>);
  }
  
  function DocumentManagementPage({ program, onBack, isAdmin }) {
      const [documents, setDocuments] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isUploading, setIsUploading] = useState(false);
      const [error, setError] = useState('');
      const [selectedFile, setSelectedFile] = useState(null);
      const [selectedSection, setSelectedSection] = useState('1');
      const getDocumentUrl = (path) => `${import.meta.env.VITE_API_URL || ''}/storage/${path}`;
      const fetchDocuments = async () => {
          if (!program) return;
          setIsLoading(true);
          try {
              const response = await apiFetch(`/api/programs/${program.id}/documents`);
              if (!response.ok) throw new Error('Failed to fetch documents.');
              const data = await response.json();
              setDocuments(data);
          } catch (err) { setError(err.message); } finally { setIsLoading(false); }
      };
      useEffect(() => { fetchDocuments(); }, [program]);
      const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
      const handleUpload = async () => {
          if (!selectedFile || !selectedSection) { window.Swal.fire('Oops...', 'Please select a file and a section.', 'warning'); return; }
          setIsUploading(true);
          const formData = new FormData();
          formData.append('document', selectedFile);
          formData.append('section', selectedSection);
          try {
              const response = await apiFetch(`/api/programs/${program.id}/documents`, { 
                  method: 'POST', 
                  body: formData 
              });
              if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Upload failed'); }
              setSelectedFile(null);
              document.querySelector('input[type="file"]').value = '';
              fetchDocuments();
              window.Swal.fire('Uploaded!', 'The document has been uploaded.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsUploading(false); }
      };
      const handleDelete = (docId) => {
          window.Swal.fire({ title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/documents/${docId}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete document.');
                          fetchDocuments();
                          window.Swal.fire('Deleted!', 'The document has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };
      const groupedDocuments = documents.reduce((acc, doc) => { (acc[doc.section] = acc[doc.section] || []).push(doc); return acc; }, {});
      return (<div>
          <Button variant="light" onClick={onBack} className="mb-4"><i className="bi bi-arrow-left"></i> Back to Programs</Button>
          <div className="content-card">
              <h1>Document Repository for: {program.name}</h1><p>Manage accreditation documents for each of the 9 required sections.</p>
              <Card className="mb-4"><Card.Header as="h5">Upload New Document</Card.Header><Card.Body>
                  <Form.Group as={Row} className="mb-3"><Form.Label column sm={2}>Accreditation Section</Form.Label><Col sm={10}><Form.Select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>{[...Array(9)].map((_, i) => <option key={i + 1} value={i + 1}>Section {i + 1}</option>)}</Form.Select></Col></Form.Group>
                  <Form.Group as={Row} className="mb-3"><Form.Label column sm={2}>Select File</Form.Label><Col sm={10}><Form.Control type="file" onChange={handleFileChange} /></Col></Form.Group>
                  <Button onClick={handleUpload} disabled={isUploading || !selectedFile} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isUploading ? <Spinner as="span" size="sm" /> : <><i className="bi bi-upload me-2"></i>Upload Document</>}</Button>
              </Card.Body></Card>
              {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
                  <Row>{[...Array(9)].map((_, i) => {
                      const sectionNum = i + 1;
                      const sectionDocs = groupedDocuments[sectionNum] || [];
                      return (<Col md={6} lg={4} key={sectionNum} className="mb-4"><Card>
                          <Card.Header as="h6">Section {sectionNum}</Card.Header>
                          <ListGroup variant="flush">{sectionDocs.length > 0 ? sectionDocs.map(doc => 
                              <ListGroup.Item key={doc.id} className="d-flex justify-content-between align-items-center">
                                  <a href={getDocumentUrl(doc.path)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                      <i className="bi bi-file-earmark-text me-2"></i>{doc.name}
                                  </a>
                                  {isAdmin && <Button variant="outline-danger" size="sm" onClick={() => handleDelete(doc.id)}><i className="bi bi-trash"></i></Button>}
                              </ListGroup.Item>
                          ) : <ListGroup.Item className="text-muted">No documents uploaded.</ListGroup.Item>}
                          </ListGroup></Card></Col>);
                  })}</Row>}
          </div>
      </div>);
  }
  
  function ProfilePage({ user, onUserUpdate }) {
      const [formData, setFormData] = useState({ name: '', middle_name: '', last_name: '', suffix: '', personal_email: '' });
      const [isSaving, setIsSaving] = useState(false);
      useEffect(() => { if (user) setFormData({ name: user.name || '', middle_name: user.middle_name || '', last_name: user.last_name || '', suffix: user.suffix || '', personal_email: user.personal_email || '' }); }, [user]);
      const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
      const handleSaveChanges = async (e) => {
          e.preventDefault();
          setIsSaving(true);
          try {
              const response = await apiFetch('/api/user', { method: 'PUT', body: JSON.stringify(formData) });
              const data = await response.json();
              if (!response.ok) { if (data.errors) { const errorMessages = Object.values(data.errors).flat().join(' '); throw new Error(errorMessages); } throw new Error(data.message || 'Failed to update profile.'); }
              window.Swal.fire('Success!', 'Profile updated successfully.', 'success');
              onUserUpdate(data.user);
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
      return (<div className="content-card"><h1>My Profile</h1><p>Update your personal information.</p><Card><Card.Body><Form onSubmit={handleSaveChanges}>
          <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Middle Name</Form.Label><Form.Control type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} /></Form.Group></Col></Row>
          <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Suffix</Form.Label><Form.Control type="text" name="suffix" value={formData.suffix} onChange={handleChange} /></Form.Group></Col></Row>
          <Form.Group className="mb-3"><Form.Label>Personal Email</Form.Label><Form.Control type="email" name="personal_email" value={formData.personal_email} onChange={handleChange} /></Form.Group><hr /><p>Your login email is: <strong>{user?.email}</strong>. It cannot be changed here.</p>
          <Button type="submit" disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button>
      </Form></Card.Body></Card></div>);
  }
  
  function ComplianceMatrixPage() {
      const [programs, setPrograms] = useState([]);
      const [selectedProgramId, setSelectedProgramId] = useState('');
      const [matrixData, setMatrixData] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState('');
      useEffect(() => {
          const fetchPrograms = async () => {
              try {
                  const response = await apiFetch('/api/programs');
                  if (!response.ok) throw new Error('Failed to fetch programs.');
                  const data = await response.json();
                  setPrograms(data);
                  if (data.length > 0) setSelectedProgramId(data[0].id);
              } catch (err) { setError(err.message); }
          };
          fetchPrograms();
      }, []);
      useEffect(() => {
          if (!selectedProgramId) return;
          const fetchMatrix = async () => {
              setIsLoading(true);
              setError('');
              try {
                  const response = await apiFetch(`/api/programs/${selectedProgramId}/compliance-matrix`);
                  if (!response.ok) throw new Error('Failed to fetch compliance data.');
                  const data = await response.json();
                  setMatrixData(data);
              } catch (err) { setError(err.message); } finally { setIsLoading(false); }
          };
          fetchMatrix();
      }, [selectedProgramId]);
      return (<div className="content-card"><h1>Compliance Matrix</h1><p>Select a program to view its compliance status against accreditation criteria.</p><Form.Group className="mb-4"><Form.Label>Select Program</Form.Label><Form.Select value={selectedProgramId} onChange={e => setSelectedProgramId(e.target.value)}>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</Form.Select></Form.Group>
          {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
              <Table striped bordered hover responsive><thead><tr><th>Criterion Code</th><th>Description</th><th>Document Needed</th><th>Status</th></tr></thead>
                  <tbody>{matrixData.map(item => <tr key={item.id}><td>{item.criterion_code}</td><td>{item.description}</td><td>{item.document_needed}</td><td><Badge bg={item.status === 'Compliant' ? 'success' : 'danger'}>{item.status}</Badge></td></tr>)}</tbody>
              </Table>}
      </div>);
  }
  
  function UserManagementPage({ currentUser, onManageQualifications }) {
      const [users, setUsers] = useState([]);
      const [roles, setRoles] = useState([]); // State for roles
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [currentUserData, setCurrentUserData] = useState(null);
      const [broadcastMessage, setBroadcastMessage] = useState('');
      const [isBroadcasting, setIsBroadcasting] = useState(false);

      const fetchUsersAndRoles = async () => {
          setIsLoading(true);
          try {
              const [usersRes, rolesRes] = await Promise.all([
                  apiFetch('/api/users'),
                  apiFetch('/api/roles') // Fetch roles
              ]);
              if (!usersRes.ok) throw new Error('Failed to fetch users.');
              if (!rolesRes.ok) throw new Error('Failed to fetch roles.');
              
              setUsers(await usersRes.json());
              setRoles(await rolesRes.json());
          } catch (err) { setError(err.message); } finally { setIsLoading(false); }
      };
  
      useEffect(() => { fetchUsersAndRoles(); }, []);
  
      const handleShowModal = (user = null) => {
          if (user) {
              setCurrentUserData(user);
          } else {
              const defaultUserRole = roles.find(r => r.name.toLowerCase() === 'user');
              setCurrentUserData({ name: '', email: '', password: '', password_confirmation: '', role_id: defaultUserRole?.id || '' });
          }
          setShowModal(true);
      };
  
      const handleCloseModal = () => setShowModal(false);
  
      const handleSaveUser = async () => {
          setIsSaving(true);
          const url = currentUserData.id ? `/api/users/${currentUserData.id}` : '/api/users';
          const method = currentUserData.id ? 'PUT' : 'POST';
          
          try {
              const response = await apiFetch(url, { method, body: JSON.stringify(currentUserData) });
              const data = await response.json();
              if (!response.ok) {
                  if(data.errors) { const errorMessages = Object.values(data.errors).flat().join(' '); throw new Error(errorMessages); }
                  throw new Error(data.message || 'Failed to save user.');
              }
              fetchUsersAndRoles();
              handleCloseModal();
              window.Swal.fire('Success!', 'User saved successfully.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
  
      const handleDeleteUser = (userId) => {
          if (currentUser && userId === currentUser.id) {
              window.Swal.fire('Action Forbidden', 'You cannot delete your own account.', 'error');
              return;
          }
          window.Swal.fire({ title: 'Are you sure?', text: "This action cannot be undone!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/users/${userId}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete user.');
                          fetchUsersAndRoles();
                          window.Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };

      const handleSendBroadcast = async () => {
          if (!broadcastMessage) {
              window.Swal.fire('Oops...', 'Broadcast message cannot be empty.', 'warning');
              return;
          }
          setIsBroadcasting(true);
          try {
              const response = await apiFetch('/api/notifications/broadcast', {
                  method: 'POST',
                  body: JSON.stringify({ message: broadcastMessage }),
              });
              if (!response.ok) throw new Error('Failed to send broadcast.');
              setBroadcastMessage('');
              window.Swal.fire('Success!', 'Broadcast sent to all users.', 'success');
          } catch (err) {
              window.Swal.fire('Error!', err.message, 'error');
          } finally {
              setIsBroadcasting(false);
          }
      };
  
      return (
        <div>
            <Card className="mb-4 content-card">
              <Card.Header as="h5">Send Broadcast Notification</Card.Header>
              <Card.Body>
                  <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control 
                          as="textarea" 
                          rows={3} 
                          value={broadcastMessage} 
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          placeholder="Enter a message to send to all users..."
                      />
                  </Form.Group>
                  <Button 
                      onClick={handleSendBroadcast} 
                      disabled={isBroadcasting}
                      style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}
                  >
                      {isBroadcasting ? <Spinner as="span" size="sm" /> : <><i className="bi bi-send me-2"></i>Send to All Users</>}
                  </Button>
              </Card.Body>
          </Card>

          <div className="content-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-4"><h1>User Management</h1><Button onClick={() => handleShowModal()} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-person-plus-fill me-2"></i> Add User</Button></div>
              {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
                  <Table striped bordered hover responsive><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                      <tbody>{users.map(user => <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td><Badge pill bg={user.role?.name === 'admin' ? 'primary' : 'secondary'}>{user.role?.name || 'N/A'}</Badge></td><td>
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(user)}><i className="bi bi-pencil-square"></i> Edit</Button>
                          <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleDeleteUser(user.id)}><i className="bi bi-trash"></i> Delete</Button>
                          <Button variant="outline-info" size="sm" onClick={() => onManageQualifications(user)}><i className="bi bi-award"></i> Qualifications</Button>
                      </td></tr>)}</tbody>
                  </Table>}
              {currentUserData && <Modal show={showModal} onHide={handleCloseModal}><Modal.Header closeButton><Modal.Title>{currentUserData.id ? 'Edit User' : 'Add New User'}</Modal.Title></Modal.Header><Modal.Body><Form>
                  <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" defaultValue={currentUserData.name} onChange={(e) => setCurrentUserData({ ...currentUserData, name: e.target.value })} required /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Email Address</Form.Label><Form.Control type="email" defaultValue={currentUserData.email} onChange={(e) => setCurrentUserData({ ...currentUserData, email: e.target.value })} required /></Form.Group>
                  
                  <Form.Group className="mb-3"><Form.Label>Role</Form.Label>
                      <Form.Select value={currentUserData.role_id || ''} onChange={(e) => setCurrentUserData({ ...currentUserData, role_id: e.target.value })} required>
                          <option value="" disabled>Select a role</option>
                          {roles.map(role => (
                              <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                      </Form.Select>
                  </Form.Group>
                  
                  <hr /><p className="text-muted">{currentUserData.id ? 'Leave password fields blank to keep current password.' : ''}</p>
                  <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder={currentUserData.id ? 'New Password' : ''} onChange={(e) => setCurrentUserData({ ...currentUserData, password: e.target.value })} required={!currentUserData.id} /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Confirm Password</Form.Label><Form.Control type="password" placeholder={currentUserData.id ? 'Confirm New Password' : ''} onChange={(e) => setCurrentUserData({ ...currentUserData, password_confirmation: e.target.value })} required={!currentUserData.id} /></Form.Group>
              </Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Close</Button><Button variant="primary" onClick={handleSaveUser} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button></Modal.Footer></Modal>}
          </div>
      </div>
      );
  }
  
  function AuditSchedulePage() {
      const [audits, setAudits] = useState([]);
      const [programs, setPrograms] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [currentAudit, setCurrentAudit] = useState(null);
  
      const fetchAudits = async () => {
          setIsLoading(true);
          try {
              const response = await apiFetch('/api/audit-schedules');
              if (!response.ok) throw new Error('Failed to fetch audits.');
              const data = await response.json();
              setAudits(data);
          } catch (err) { setError(err.message); } finally { setIsLoading(false); }
      };
      
      const fetchPrograms = async () => {
          try {
              const response = await apiFetch('/api/programs');
              if (!response.ok) throw new Error('Failed to fetch programs.');
              const data = await response.json();
              setPrograms(data);
          } catch (err) { console.error(err.message); }
      };
  
      useEffect(() => {
          fetchAudits();
          fetchPrograms();
      }, []);
  
      const handleShowModal = (audit = null) => {
          setCurrentAudit(audit || { program_id: programs[0]?.id || '', audit_date: '', status: 'Scheduled', notes: '' });
          setShowModal(true);
      };
  
      const handleCloseModal = () => setShowModal(false);
  
      const handleSaveAudit = async () => {
          setIsSaving(true);
          const url = currentAudit.id ? `/api/audit-schedules/${currentAudit.id}` : '/api/audit-schedules';
          const method = currentAudit.id ? 'PUT' : 'POST';
          
          try {
              const response = await apiFetch(url, { method, body: JSON.stringify(currentAudit) });
              const data = await response.json();
              if (!response.ok) {
                  if(data.errors) { const errorMessages = Object.values(data.errors).flat().join(' '); throw new Error(errorMessages); }
                  throw new Error(data.message || 'Failed to save audit.');
              }
              fetchAudits();
              handleCloseModal();
              window.Swal.fire('Success!', 'Audit schedule saved successfully.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
  
      const handleDeleteAudit = (auditId) => {
          window.Swal.fire({ title: 'Are you sure?', text: "This action cannot be undone!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/audit-schedules/${auditId}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete audit.');
                          fetchAudits();
                          window.Swal.fire('Deleted!', 'The audit schedule has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };
      
      const getStatusBadge = (status) => {
          switch(status) {
              case 'Completed': return 'success';
              case 'In Progress': return 'primary';
              case 'Scheduled': return 'secondary';
              default: return 'light';
          }
      };
  
      return (<div className="content-card">
          <div className="d-flex justify-content-between align-items-center mb-4"><h1>Internal Audit Scheduler</h1><Button onClick={() => handleShowModal()} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-calendar-plus me-2"></i> Schedule Audit</Button></div>
          {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
              <Table striped bordered hover responsive><thead><tr><th>Program</th><th>Audit Date</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
                  <tbody>{audits.map(audit => <tr key={audit.id}><td>{audit.program?.name || 'N/A'}</td><td>{audit.audit_date}</td><td><Badge bg={getStatusBadge(audit.status)}>{audit.status}</Badge></td><td>{audit.notes}</td><td><Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(audit)}><i className="bi bi-pencil-square"></i> Edit</Button><Button variant="outline-danger" size="sm" onClick={() => handleDeleteAudit(audit.id)}><i className="bi bi-trash"></i> Delete</Button></td></tr>)}</tbody>
              </Table>}
          {currentAudit && <Modal show={showModal} onHide={handleCloseModal}><Modal.Header closeButton><Modal.Title>{currentAudit.id ? 'Edit Audit Schedule' : 'Schedule New Audit'}</Modal.Title></Modal.Header><Modal.Body><Form>
              <Form.Group className="mb-3"><Form.Label>Program</Form.Label><Form.Select defaultValue={currentAudit.program_id} onChange={(e) => setCurrentAudit({ ...currentAudit, program_id: e.target.value })} required>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Audit Date</Form.Label><Form.Control type="date" defaultValue={currentAudit.audit_date} onChange={(e) => setCurrentAudit({ ...currentAudit, audit_date: e.target.value })} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Select defaultValue={currentAudit.status} onChange={(e) => setCurrentAudit({ ...currentAudit, status: e.target.value })} required><option value="Scheduled">Scheduled</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Notes</Form.Label><Form.Control as="textarea" rows={3} defaultValue={currentAudit.notes || ''} onChange={(e) => setCurrentAudit({ ...currentAudit, notes: e.target.value })} /></Form.Group>
          </Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Close</Button><Button variant="primary" onClick={handleSaveAudit} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button></Modal.Footer></Modal>}
      </div>);
  }
  
  function AccreditorVisitPage() {
      const [visits, setVisits] = useState([]);
      const [programs, setPrograms] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [currentVisit, setCurrentVisit] = useState(null);
  
      const fetchVisits = async () => {
          setIsLoading(true);
          try {
              const response = await apiFetch('/api/visits');
              if (!response.ok) throw new Error('Failed to fetch accreditor visits.');
              const data = await response.json();
              setVisits(data);
          } catch (err) { setError(err.message); } finally { setIsLoading(false); }
      };
  
      const fetchPrograms = async () => {
          try {
              const response = await apiFetch('/api/programs');
              if (!response.ok) throw new Error('Failed to fetch programs for visits.');
              const data = await response.json();
              setPrograms(data);
          } catch (err) { console.error(err.message); }
      };
  
      useEffect(() => {
          fetchVisits();
          fetchPrograms();
      }, []);
  
      const handleShowModal = (visit = null) => {
          setCurrentVisit(visit || { program_id: programs[0]?.id || '', accreditor_name: '', visit_date: '', status: 'Planned', notes: '' });
          setShowModal(true);
      };
  
      const handleCloseModal = () => setShowModal(false);
  
      const handleSaveVisit = async () => {
          setIsSaving(true);
          const url = currentVisit.id ? `/api/visits/${currentVisit.id}` : '/api/visits';
          const method = currentVisit.id ? 'PUT' : 'POST';
  
          try {
              const response = await apiFetch(url, { method, body: JSON.stringify(currentVisit) });
              const data = await response.json();
              if (!response.ok) {
                  if(data.errors) { const errorMessages = Object.values(data.errors).flat().join(' '); throw new Error(errorMessages); }
                  throw new Error(data.message || 'Failed to save visit.');
              }
              fetchVisits();
              handleCloseModal();
              window.Swal.fire('Success!', 'Accreditor visit saved successfully.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
  
      const handleDeleteVisit = (visitId) => {
          window.Swal.fire({ title: 'Are you sure?', text: "This action is final!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/visits/${visitId}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete visit.');
                          fetchVisits();
                          window.Swal.fire('Deleted!', 'The accreditor visit has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };
  
      const getStatusBadge = (status) => {
          switch(status) {
              case 'Completed': return 'success';
              case 'Confirmed': return 'primary';
              case 'Planned': return 'secondary';
              default: return 'light';
          }
      };
  
      return (<div className="content-card">
          <div className="d-flex justify-content-between align-items-center mb-4"><h1>Accreditor Visits</h1><Button onClick={() => handleShowModal()} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-calendar-plus me-2"></i> Log Visit</Button></div>
          {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
              <Table striped bordered hover responsive><thead><tr><th>Program</th><th>Accreditor Name</th><th>Visit Date</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
                  <tbody>{visits.map(visit => <tr key={visit.id}><td>{visit.program?.name || 'N/A'}</td><td>{visit.accreditor_name}</td><td>{visit.visit_date}</td><td><Badge bg={getStatusBadge(visit.status)}>{visit.status}</Badge></td><td>{visit.notes}</td><td><Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(visit)}><i className="bi bi-pencil-square"></i> Edit</Button><Button variant="outline-danger" size="sm" onClick={() => handleDeleteVisit(visit.id)}><i className="bi bi-trash"></i> Delete</Button></td></tr>)}</tbody>
              </Table>}
          {currentVisit && <Modal show={showModal} onHide={handleCloseModal}><Modal.Header closeButton><Modal.Title>{currentVisit.id ? 'Edit Accreditor Visit' : 'Log New Accreditor Visit'}</Modal.Title></Modal.Header><Modal.Body><Form>
              <Form.Group className="mb-3"><Form.Label>Program</Form.Label><Form.Select defaultValue={currentVisit.program_id} onChange={(e) => setCurrentVisit({ ...currentVisit, program_id: e.target.value })} required>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Accreditor Name</Form.Label><Form.Control type="text" defaultValue={currentVisit.accreditor_name} onChange={(e) => setCurrentVisit({ ...currentVisit, accreditor_name: e.target.value })} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Visit Date</Form.Label><Form.Control type="date" defaultValue={currentVisit.visit_date} onChange={(e) => setCurrentVisit({ ...currentVisit, visit_date: e.target.value })} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Select defaultValue={currentVisit.status} onChange={(e) => setCurrentVisit({ ...currentVisit, status: e.target.value })} required><option value="Planned">Planned</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Notes</Form.Label><Form.Control as="textarea" rows={3} defaultValue={currentVisit.notes || ''} onChange={(e) => setCurrentVisit({ ...currentVisit, notes: e.target.value })} /></Form.Group>
          </Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Close</Button><Button variant="primary" onClick={handleSaveVisit} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button></Modal.Footer></Modal>}
      </div>);
  }
  
  function FacultyQualificationPage({ user, onBack }) {
      const [qualifications, setQualifications] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [showModal, setShowModal] = useState(false);
      const [newQual, setNewQual] = useState({ type: 'Degree', name: '', institution: '', year_obtained: new Date().getFullYear() });
  
      const fetchQualifications = async () => {
          if (!user) return;
          setIsLoading(true);
          try {
              const response = await apiFetch(`/api/users/${user.id}/qualifications`);
              if (!response.ok) throw new Error('Failed to fetch qualifications.');
              setQualifications(await response.json());
          } catch (err) { console.error(err.message); } finally { setIsLoading(false); }
      };
  
      useEffect(() => {
          fetchQualifications();
      }, [user]);
  
      const handleSave = async () => {
          setIsSaving(true);
          try {
              const response = await apiFetch(`/api/users/${user.id}/qualifications`, {
                  method: 'POST',
                  body: JSON.stringify(newQual)
              });
              if (!response.ok) throw new Error('Failed to save qualification.');
              fetchQualifications();
              setShowModal(false);
              setNewQual({ type: 'Degree', name: '', institution: '', year_obtained: new Date().getFullYear() });
              window.Swal.fire('Success!', 'Qualification added.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
  
      const handleDelete = (qualId) => {
          window.Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/qualifications/${qualId}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete qualification.');
                          fetchQualifications();
                          window.Swal.fire('Deleted!', 'Qualification has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };
  
      return (
          <div>
              <Button variant="light" onClick={onBack} className="mb-4"><i className="bi bi-arrow-left"></i> Back to Users</Button>
              <div className="content-card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h1>Qualifications for {user?.name}</h1>
                      <Button onClick={() => setShowModal(true)} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-plus-circle me-2"></i> Add Qualification</Button>
                  </div>
                  {isLoading ? <div className="text-center p-5"><Spinner /></div> : (
                      <Table striped bordered hover responsive>
                          <thead><tr><th>Type</th><th>Name</th><th>Institution</th><th>Year</th><th>Action</th></tr></thead>
                          <tbody>
                              {qualifications.map(q => (
                                  <tr key={q.id}>
                                      <td><Badge bg={q.type === 'Degree' ? 'primary' : (q.type === 'Certification' ? 'success' : 'info')}>{q.type}</Badge></td>
                                      <td>{q.name}</td>
                                      <td>{q.institution}</td>
                                      <td>{q.year_obtained}</td>
                                      <td><Button variant="outline-danger" size="sm" onClick={() => handleDelete(q.id)}><i className="bi bi-trash"></i></Button></td>
                                  </tr>
                              ))}
                          </tbody>
                      </Table>
                  )}
              </div>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton><Modal.Title>Add New Qualification</Modal.Title></Modal.Header>
                  <Modal.Body>
                      <Form.Group className="mb-3"><Form.Label>Type</Form.Label><Form.Select value={newQual.type} onChange={e => setNewQual({...newQual, type: e.target.value})}><option>Degree</option><option>Certification</option><option>Training</option></Form.Select></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Name / Title</Form.Label><Form.Control type="text" value={newQual.name} onChange={e => setNewQual({...newQual, name: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Institution / Issuing Body</Form.Label><Form.Control type="text" value={newQual.institution} onChange={e => setNewQual({...newQual, institution: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Year Obtained</Form.Label><Form.Control type="number" value={newQual.year_obtained} onChange={e => setNewQual({...newQual, year_obtained: e.target.value})} /></Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                      <Button variant="primary" onClick={handleSave} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save'}</Button>
                  </Modal.Footer>
              </Modal>
          </div>
      );
  }
  
  function FacilityManagementPage() {
      const [facilities, setFacilities] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [showModal, setShowModal] = useState(false);
      const [currentFacility, setCurrentFacility] = useState(null);
  
      const fetchFacilities = async () => {
          setIsLoading(true);
          try {
              const response = await apiFetch('/api/facilities');
              if (!response.ok) throw new Error('Failed to fetch facilities.');
              setFacilities(await response.json());
          } catch (err) { console.error(err.message); } finally { setIsLoading(false); }
      };
  
      useEffect(() => { fetchFacilities(); }, []);
  
      const handleShowModal = (facility = null) => {
          setCurrentFacility(facility || { name: '', location: '', type: 'Classroom', capacity: 0, condition_status: 'Good', notes: '' });
          setShowModal(true);
      };
  
      const handleSave = async () => {
          setIsSaving(true);
          const url = currentFacility.id ? `/api/facilities/${currentFacility.id}` : '/api/facilities';
          const method = currentFacility.id ? 'PUT' : 'POST';
          try {
              const response = await apiFetch(url, {
                  method,
                  body: JSON.stringify(currentFacility)
              });
              if (!response.ok) throw new Error('Failed to save facility.');
              fetchFacilities();
              setShowModal(false);
              window.Swal.fire('Success!', 'Facility saved.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
  
      const handleDelete = (id) => {
          window.Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          const response = await apiFetch(`/api/facilities/${id}`, { method: 'DELETE' });
                          if (!response.ok) throw new Error('Failed to delete facility.');
                          fetchFacilities();
                          window.Swal.fire('Deleted!', 'Facility has been deleted.', 'success');
                      } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                  }
              });
      };
  
      return (
          <div className="content-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1>Facilities Monitoring</h1>
                  <Button onClick={() => handleShowModal()} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-plus-circle me-2"></i> Add Facility</Button>
              </div>
              {isLoading ? <div className="text-center p-5"><Spinner /></div> : (
                  <Table striped bordered hover responsive>
                      <thead><tr><th>Name</th><th>Location</th><th>Type</th><th>Capacity</th><th>Condition</th><th>Actions</th></tr></thead>
                      <tbody>
                          {facilities.map(f => (
                              <tr key={f.id}>
                                  <td>{f.name}</td>
                                  <td>{f.location}</td>
                                  <td>{f.type}</td>
                                  <td>{f.capacity}</td>
                                  <td><Badge bg={f.condition_status === 'Excellent' ? 'success' : 'warning'}>{f.condition_status}</Badge></td>
                                  <td>
                                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(f)}><i className="bi bi-pencil-square"></i></Button>
                                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(f.id)}><i className="bi bi-trash"></i></Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </Table>
              )}
              {currentFacility && <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton><Modal.Title>{currentFacility.id ? 'Edit Facility' : 'Add New Facility'}</Modal.Title></Modal.Header>
                  <Modal.Body>
                      <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={currentFacility.name} onChange={e => setCurrentFacility({...currentFacility, name: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Location</Form.Label><Form.Control type="text" value={currentFacility.location} onChange={e => setCurrentFacility({...currentFacility, location: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Type</Form.Label><Form.Select value={currentFacility.type} onChange={e => setCurrentFacility({...currentFacility, type: e.target.value})}><option>Classroom</option><option>Laboratory</option><option>Office</option><option>Library</option><option>Other</option></Form.Select></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Capacity</Form.Label><Form.Control type="number" value={currentFacility.capacity} onChange={e => setCurrentFacility({...currentFacility, capacity: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Condition</Form.Label><Form.Select value={currentFacility.condition_status} onChange={e => setCurrentFacility({...currentFacility, condition_status: e.target.value})}><option>Excellent</option><option>Good</option><option>Needs Repair</option></Form.Select></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Notes</Form.Label><Form.Control as="textarea" rows={3} value={currentFacility.notes} onChange={e => setCurrentFacility({...currentFacility, notes: e.target.value})} /></Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                      <Button variant="primary" onClick={handleSave} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save'}</Button>
                  </Modal.Footer>
              </Modal>}
          </div>
      );
  }
  
  function ActionPlanPage({ program, onBack }) {
      const [actionPlans, setActionPlans] = useState([]);
      const [users, setUsers] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const [showModal, setShowModal] = useState(false);
      const [currentPlan, setCurrentPlan] = useState(null);
  
      const fetchActionPlans = async () => {
          if (!program) return;
          setIsLoading(true);
          try {
              const response = await apiFetch(`/api/programs/${program.id}/action-plans`);
              if (!response.ok) throw new Error('Failed to fetch action plans.');
              setActionPlans(await response.json());
          } catch (err) { console.error(err.message); } finally { setIsLoading(false); }
      };
      
      const fetchUsers = async () => {
          try {
              const response = await apiFetch(`/api/users`);
              if (!response.ok) throw new Error('Failed to fetch users.');
              setUsers(await response.json());
          } catch (err) { console.error(err.message); }
      };
  
      useEffect(() => {
          fetchActionPlans();
          fetchUsers();
      }, [program]);
  
      const handleShowModal = (plan = null) => {
          setCurrentPlan(plan || { title: '', description: '', status: 'Not Started', due_date: '', assigned_to_user_id: null });
          setShowModal(true);
      };
  
      const handleSave = async () => {
          setIsSaving(true);
          const url = currentPlan.id ? `/api/action-plans/${currentPlan.id}` : `/api/programs/${program.id}/action-plans`;
          const method = currentPlan.id ? 'PUT' : 'POST';
          try {
              const response = await apiFetch(url, {
                  method,
                  body: JSON.stringify(currentPlan)
              });
              if (!response.ok) throw new Error('Failed to save action plan.');
              fetchActionPlans();
              setShowModal(false);
              window.Swal.fire('Success!', 'Action plan saved.', 'success');
          } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
      };
      
      const getStatusBadge = (status) => {
          if (status === 'Completed') return 'success';
          if (status === 'In Progress') return 'primary';
          return 'secondary';
      };
  
      return (
          <div>
              <Button variant="light" onClick={onBack} className="mb-4"><i className="bi bi-arrow-left"></i> Back to Programs</Button>
              <div className="content-card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h1>Action Plans for {program?.name}</h1>
                      <Button onClick={() => handleShowModal()} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}><i className="bi bi-plus-circle me-2"></i> New Action Plan</Button>
                  </div>
                  {isLoading ? <div className="text-center p-5"><Spinner /></div> : (
                      <Row>
                          {actionPlans.map(plan => (
                              <Col md={6} lg={4} key={plan.id} className="mb-4">
                                  <Card>
                                      <Card.Header>
                                          <div className="d-flex justify-content-between">
                                              <span>Due: {plan.due_date || 'N/A'}</span>
                                              <Badge bg={getStatusBadge(plan.status)}>{plan.status}</Badge>
                                          </div>
                                      </Card.Header>
                                      <Card.Body>
                                          <Card.Title>{plan.title}</Card.Title>
                                          <Card.Text>{plan.description}</Card.Text>
                                          <hr />
                                          <small className="text-muted">Assigned to: {plan.assigned_user?.name || 'Unassigned'}</small>
                                      </Card.Body>
                                      <Card.Footer>
                                          <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(plan)}>Edit</Button>
                                      </Card.Footer>
                                  </Card>
                              </Col>
                          ))}
                      </Row>
                  )}
              </div>
              {currentPlan && <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton><Modal.Title>{currentPlan.id ? 'Edit Action Plan' : 'New Action Plan'}</Modal.Title></Modal.Header>
                  <Modal.Body>
                      <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control type="text" value={currentPlan.title} onChange={e => setCurrentPlan({...currentPlan, title: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={currentPlan.description} onChange={e => setCurrentPlan({...currentPlan, description: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Select value={currentPlan.status} onChange={e => setCurrentPlan({...currentPlan, status: e.target.value})}><option>Not Started</option><option>In Progress</option><option>Completed</option></Form.Select></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Due Date</Form.Label><Form.Control type="date" value={currentPlan.due_date} onChange={e => setCurrentPlan({...currentPlan, due_date: e.target.value})} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Assign To</Form.Label><Form.Select value={currentPlan.assigned_to_user_id || ''} onChange={e => setCurrentPlan({...currentPlan, assigned_to_user_id: e.target.value})}><option value="">Unassigned</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Form.Select></Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                      <Button variant="primary" onClick={handleSave} disabled={isSaving} style={{ backgroundColor: 'var(--primary-purple)', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save'}</Button>
                  </Modal.Footer>
              </Modal>}
          </div>
      );
  }

// --- Main Dashboard Layout ---
function DashboardLayout({ user, onLogout, setUser }) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [currentView, setCurrentView] = useState('DASHBOARD');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    
    const isAdmin = user && user.role && user.role.name.toLowerCase() === 'admin';
    const adminOnlyViews = ['USERS', 'FACILITIES', 'ACTION_PLANS', 'AUDIT_SCHEDULE', 'ACCREDITOR_VISIT', 'QUALIFICATIONS'];

    const fetchUnreadNotifications = async () => {
        try {
            const response = await apiFetch('/api/notifications/unread');
            if (!response.ok) throw new Error('Failed to fetch notifications');
            const data = await response.json();
            setNotifications(data);
        } catch (error) { console.error('Error fetching notifications:', error); }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
            fetchUnreadNotifications();
        } catch (error) { console.error('Error marking notification as read:', error); }
    };
    
    const handleMarkAllRead = async () => {
        try {
            await apiFetch(`/api/notifications/mark-all-read`, { method: 'PUT' });
            fetchUnreadNotifications();
        } catch (error) { console.error('Error marking all notifications as read:', error); }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' });
            fetchUnreadNotifications();
        } catch (error) { console.error('Error deleting notification:', error); }
    };
    
    const handleClearAll = async () => {
        window.Swal.fire({ title: 'Are you sure?', text: "This will delete all of your notifications permanently.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, clear them!' })
              .then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          await apiFetch(`/api/notifications/clear-all`, { method: 'DELETE' });
                          fetchUnreadNotifications();
                          window.Swal.fire('Cleared!', 'All notifications have been deleted.', 'success');
                      } catch (error) { window.Swal.fire('Error!', 'Could not clear notifications.', 'error'); }
                  }
              });
    };

    useEffect(() => { 
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUnreadNotifications();
            const intervalId = setInterval(fetchUnreadNotifications, 30000); // Refresh every 30 seconds
            return () => clearInterval(intervalId);
        }
    }, []);
    
    const handleManageDocuments = (program) => { setSelectedProgram(program); setCurrentView('DOCUMENTS'); };
    const handleManageActionPlans = (program) => { setSelectedProgram(program); setCurrentView('ACTION_PLANS'); };
    const handleBackToPrograms = () => { setSelectedProgram(null); setCurrentView('PROGRAMS'); };
    const handleManageQualifications = (userForQual) => { setSelectedUser(userForQual); setCurrentView('QUALIFICATIONS'); };
    const handleBackToUsers = () => { setSelectedUser(null); setCurrentView('USERS'); };

    const handleViewChange = (view) => {
        if (adminOnlyViews.includes(view) && !isAdmin) {
            window.Swal.fire('Access Denied', 'You do not have permission to view this page.', 'error');
            return;
        }
        if ((view === 'DOCUMENTS' || view === 'ACTION_PLANS') && !selectedProgram) {
            window.Swal.fire('Info', 'Please select a program first from the Program Management page.', 'info');
            setCurrentView('PROGRAMS');
            return;
        }
        setCurrentView(view);
    };

    const handleUserUpdate = (updatedUser) => setUser(updatedUser);
    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

    const renderContent = () => {
        if (adminOnlyViews.includes(currentView) && !isAdmin) {
            return <DashboardHomepage />;
        }
        switch (currentView) {
            case 'DASHBOARD': return <DashboardHomepage />;
            case 'PROGRAMS': return <ProgramManagementPage onManageDocuments={handleManageDocuments} onManageActionPlans={handleManageActionPlans} isAdmin={isAdmin} />;
            case 'DOCUMENTS': return <DocumentManagementPage program={selectedProgram} onBack={handleBackToPrograms} isAdmin={isAdmin} />;
            case 'FACILITIES': return <FacilityManagementPage />;
            case 'ACTION_PLANS': return <ActionPlanPage program={selectedProgram} onBack={handleBackToPrograms} />;
            case 'COMPLIANCE': return <ComplianceMatrixPage />;
            case 'AUDIT_SCHEDULE': return <AuditSchedulePage />;
            case 'ACCREDITOR_VISIT': return <AccreditorVisitPage />;
            case 'USERS': return <UserManagementPage currentUser={user} onManageQualifications={handleManageQualifications} />;
            case 'QUALIFICATIONS': return <FacultyQualificationPage user={selectedUser} onBack={handleBackToUsers} />;
            case 'PROFILE': return <ProfilePage user={user} onUserUpdate={handleUserUpdate} />;
            default: return <DashboardHomepage />;
        }
    };
    return (
        <div className="main-wrapper">
            {sidebarVisible && <Sidebar user={user} onViewChange={handleViewChange} currentView={currentView} />}
            <main className="main-content">
                <TopNavbar 
                    onLogout={onLogout} 
                    onToggleSidebar={toggleSidebar} 
                    currentView={currentView} 
                    user={user} 
                    onViewChange={handleViewChange}
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllRead={handleMarkAllRead}
                    onClearAll={handleClearAll}
                    onDeleteNotification={handleDeleteNotification}
                />
                <div className="container-fluid px-0">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

