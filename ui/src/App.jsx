import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Nav, Dropdown, Table, Modal, Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap';

// --- Asset URLs ---
const logoUrl = '/LOGO (1).png';
const backgroundImageUrl = '/bg.jpg';

// --- Helper component to load CSS and apply global styles ---
function StyleLoader() {
  useEffect(() => {
    const globalStyle = document.createElement('style');
    globalStyle.innerHTML = `html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow-x: hidden; }`;
    document.head.appendChild(globalStyle);
    const bootstrapLink = document.createElement('link');
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
    bootstrapLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapLink);
    const bootstrapIconsLink = document.createElement('link');
    bootstrapIconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css';
    bootstrapIconsLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapIconsLink);
    const googleFontsLink = document.createElement('link');
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap';
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
      {token ? <DashboardLayout onLogout={handleLogout} token={token} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
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
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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

  const mainContainerStyles = { display: 'flex', height: '100%', width: '100%', fontFamily: "'Poppins', sans-serif" };
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
            <Button type="submit" disabled={isLoading} style={{ backgroundColor: '#5044e4', border: 'none', width: '100%', borderRadius: '2rem', fontWeight: '700', padding: '0.75rem' }}>{isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Sign in'}</Button>
          </Form>
        </div>
      </div>
      <div style={brandingColumnStyles} className="d-none d-lg-flex"><div><h1 style={{ fontSize: '3.5rem', fontWeight: '700' }}>School Management<br />System III</h1><p>Accreditation Management System</p></div></div>
    </div>
  );
}

// --- Dashboard Components ---
function Sidebar({ user, onViewChange, currentView }) {
  const getInitials = (name) => !name ? '' : name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getDisplayName = (user) => !user ? 'Loading...' : [user.name, user.middle_name, user.last_name, user.suffix].filter(Boolean).join(' ');
  const linkStyle = (viewName) => ({ padding: '0.75rem 1.5rem', borderLeft: '3px solid transparent', cursor: 'pointer', backgroundColor: currentView === viewName ? '#284b9a' : 'transparent', borderLeftColor: currentView === viewName ? '#3B71CA' : 'transparent', color: currentView === viewName ? 'white' : '#bdc3c7' });
  return (
    <div className="d-flex flex-column flex-shrink-0" style={{ width: '280px', minHeight: '100vh', backgroundColor: '#1e3a8a', color: 'white' }}>
      <div style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#3B71CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', margin: '0 auto 0.5rem' }}>{getInitials(user?.name)}</div>
        <h5 className="mb-0">{getDisplayName(user)}</h5>
        <small>{user?.email || '...'}</small>
      </div>
      <Nav className="flex-column nav-pills">
        <Nav.Link onClick={() => onViewChange('DASHBOARD')} style={linkStyle('DASHBOARD')} className="d-flex align-items-center"><i className="bi bi-speedometer2 me-3"></i> Dashboard</Nav.Link>
        <Nav.Link onClick={() => onViewChange('PROGRAMS')} style={linkStyle('PROGRAMS')} className="d-flex align-items-center"><i className="bi bi-card-list me-3"></i> Program Management</Nav.Link>
        <Nav.Link onClick={() => onViewChange('DOCUMENTS')} style={linkStyle('DOCUMENTS')} className="d-flex align-items-center"><i className="bi bi-file-earmark-text me-3"></i> Document Repository</Nav.Link>
        <Nav.Link onClick={() => onViewChange('COMPLIANCE')} style={linkStyle('COMPLIANCE')} className="d-flex align-items-center"><i className="bi bi-list-check me-3"></i> Compliance Matrix</Nav.Link>
        <Nav.Link onClick={() => onViewChange('PROFILE')} style={linkStyle('PROFILE')} className="d-flex align-items-center mt-auto mb-2"><i className="bi bi-person-circle me-3"></i> Profile</Nav.Link>
      </Nav>
    </div>
  );
}

function TopNavbar({ onLogout, onToggleSidebar, onViewChange }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => { const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000); return () => clearInterval(timer); }, []);
  return (
    <nav className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6', padding: '0.5rem 1.5rem' }}>
      <div><Button variant="light" onClick={onToggleSidebar}><i className="bi bi-list"></i></Button></div>
      <div className="d-flex align-items-center">
        <span className="me-3 d-none d-sm-inline">{time}</span>
        <a href="#" className="text-dark me-3"><i className="bi bi-bell fs-5"></i></a>
        <Dropdown>
          <Dropdown.Toggle as="a" href="#" className="link-dark text-decoration-none"><i className="bi bi-person-circle fs-4"></i></Dropdown.Toggle>
          <Dropdown.Menu align="end"><Dropdown.Header>Main User</Dropdown.Header><Dropdown.Item onClick={() => onViewChange('PROFILE')}>Profile</Dropdown.Item><Dropdown.Divider /><Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item></Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}

// --- Dashboard Homepage / Gap Analysis ---
function DashboardHomepage({ token }) {
    const [analysisData, setAnalysisData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/gap-analysis/overall-status', {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('Failed to fetch gap analysis data.');
                const data = await response.json();
                setAnalysisData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalysis();
    }, [token]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'At Risk': return 'danger';
            case 'Needs Attention': return 'warning';
            case 'On Track': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <div>
            <h1>Compliance Dashboard</h1>
            <p>Overall compliance status and predictive gap analysis for all programs.</p>
            {isLoading ? (
                <div className="text-center p-5"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row>
                    {analysisData.map(item => (
                        <Col md={6} lg={4} key={item.program_id} className="mb-4">
                            <Card>
                                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                                    {item.program_name}
                                    <Badge bg={getStatusVariant(item.predicted_status)}>{item.predicted_status}</Badge>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center mb-3">
                                        <h3 className="display-4">{item.compliance_percentage}%</h3>
                                        <span>Compliant</span>
                                    </div>
                                    <ProgressBar variant={getStatusVariant(item.predicted_status)} now={item.compliance_percentage} />
                                    <Card.Text className="mt-3 text-center">
                                        {item.compliant_criteria} of {item.total_criteria} criteria met.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}


// --- Program Management Page ---
function ProgramManagementPage({ token, onManageDocuments }) {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentProgram, setCurrentProgram] = useState({ id: null, name: '', accreditation_level: 'Candidate', status: '' });
    const fetchPrograms = async (showLoader = true) => {
        if (showLoader) setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/programs', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('Failed to fetch programs.');
            const data = await response.json();
            setPrograms(data);
        } catch (err) { setError(err.message); } finally { if (showLoader) setIsLoading(false); }
    };
    useEffect(() => { fetchPrograms(); }, [token]);
    const handleShowModal = (program = null) => {
        setCurrentProgram(program || { id: null, name: '', accreditation_level: 'Candidate', status: '' });
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);
    const handleSaveProgram = async () => {
        setIsSaving(true);
        handleCloseModal();
        window.Swal.fire({ title: 'Saving Program...', allowOutsideClick: false, didOpen: () => { window.Swal.showLoading() } });
        const url = currentProgram.id ? `http://localhost:8000/api/programs/${currentProgram.id}` : 'http://localhost:8000/api/programs';
        const method = currentProgram.id ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(currentProgram) });
            if (!response.ok) throw new Error('Failed to save program.');
            await fetchPrograms(false);
            window.Swal.fire('Success!', 'Program saved successfully.', 'success');
        } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
    };
    const handleDeleteProgram = (id) => {
        window.Swal.fire({ title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/programs/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                        if (!response.ok) throw new Error('Failed to delete program.');
                        fetchPrograms();
                        window.Swal.fire('Deleted!', 'The program has been deleted.', 'success');
                    } catch (err) { window.Swal.fire('Error!', err.message, 'error'); }
                }
            });
    };
    return (<>
        <div className="d-flex justify-content-between align-items-center mb-4"><h1>Program Management</h1><Button onClick={() => handleShowModal()} style={{ backgroundColor: '#5044e4', border: 'none' }}><i className="bi bi-plus-circle me-2"></i> Add Program</Button></div>
        {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
            <Table striped bordered hover responsive><thead><tr><th>ID</th><th>Program Name</th><th>Accreditation Level</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{programs.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.accreditation_level}</td><td>{p.status}</td><td><Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(p)}><i className="bi bi-pencil-square"></i> Edit</Button><Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleDeleteProgram(p.id)}><i className="bi bi-trash"></i> Delete</Button><Button variant="outline-info" size="sm" onClick={() => onManageDocuments(p)}><i className="bi bi-folder"></i> Manage Docs</Button></td></tr>)}</tbody>
            </Table>}
        <Modal show={showModal} onHide={handleCloseModal}><Modal.Header closeButton><Modal.Title>{currentProgram.id ? 'Edit Program' : 'Add New Program'}</Modal.Title></Modal.Header><Modal.Body><Form>
            <Form.Group className="mb-3"><Form.Label>Program Name</Form.Label><Form.Control type="text" value={currentProgram.name} onChange={(e) => setCurrentProgram({ ...currentProgram, name: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Accreditation Level</Form.Label><Form.Select value={currentProgram.accreditation_level} onChange={(e) => setCurrentProgram({ ...currentProgram, accreditation_level: e.target.value })}><option value="Candidate">Candidate</option><option value="Level 1">Level 1</option><option value="Level 2">Level 2</option><option value="Level 3">Level 3</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Control type="text" value={currentProgram.status} onChange={(e) => setCurrentProgram({ ...currentProgram, status: e.target.value })} /></Form.Group>
        </Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Close</Button><Button variant="primary" onClick={handleSaveProgram} disabled={isSaving} style={{ backgroundColor: '#5044e4', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button></Modal.Footer></Modal>
    </>);
}

// --- Document Management Page ---
function DocumentManagementPage({ program, token, onBack }) {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSection, setSelectedSection] = useState('1');
    const fetchDocuments = async () => {
        if (!program) return;
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/programs/${program.id}/documents`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('Failed to fetch documents.');
            const data = await response.json();
            setDocuments(data);
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    };
    useEffect(() => { fetchDocuments(); }, [program, token]);
    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
    const handleUpload = async () => {
        if (!selectedFile || !selectedSection) { window.Swal.fire('Oops...', 'Please select a file and a section.', 'warning'); return; }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('section', selectedSection);
        try {
            const response = await fetch(`http://localhost:8000/api/programs/${program.id}/documents`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, body: formData });
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
                        const response = await fetch(`http://localhost:8000/api/documents/${docId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
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
        <h1>Document Repository for: {program.name}</h1><p>Manage accreditation documents for each of the 9 required sections.</p>
        <Card className="mb-4"><Card.Header as="h5">Upload New Document</Card.Header><Card.Body>
            <Form.Group as={Row} className="mb-3"><Form.Label column sm={2}>Accreditation Section</Form.Label><Col sm={10}><Form.Select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>{[...Array(9)].map((_, i) => <option key={i + 1} value={i + 1}>Section {i + 1}</option>)}</Form.Select></Col></Form.Group>
            <Form.Group as={Row} className="mb-3"><Form.Label column sm={2}>Select File</Form.Label><Col sm={10}><Form.Control type="file" onChange={handleFileChange} /></Col></Form.Group>
            <Button onClick={handleUpload} disabled={isUploading || !selectedFile} style={{ backgroundColor: '#5044e4', border: 'none' }}>{isUploading ? <Spinner as="span" size="sm" /> : <><i className="bi bi-upload me-2"></i>Upload Document</>}</Button>
        </Card.Body></Card>
        {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
            <Row>{[...Array(9)].map((_, i) => {
                const sectionNum = i + 1;
                const sectionDocs = groupedDocuments[sectionNum] || [];
                return (<Col md={6} lg={4} key={sectionNum} className="mb-4"><Card>
                    <Card.Header as="h6">Section {sectionNum}</Card.Header>
                    <ListGroup variant="flush">{sectionDocs.length > 0 ? sectionDocs.map(doc => <ListGroup.Item key={doc.id} className="d-flex justify-content-between align-items-center"><span><i className="bi bi-file-earmark-text me-2"></i>{doc.name}</span><Button variant="outline-danger" size="sm" onClick={() => handleDelete(doc.id)}><i className="bi bi-trash"></i></Button></ListGroup.Item>) : <ListGroup.Item className="text-muted">No documents uploaded for this section.</ListGroup.Item>}
                    </ListGroup></Card></Col>);
            })}</Row>}
    </div>);
}

// --- Profile Page ---
function ProfilePage({ user, token, onUserUpdate }) {
    const [formData, setFormData] = useState({ name: '', middle_name: '', last_name: '', suffix: '', personal_email: '' });
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => { if (user) setFormData({ name: user.name || '', middle_name: user.middle_name || '', last_name: user.last_name || '', suffix: user.suffix || '', personal_email: user.personal_email || '' }); }, [user]);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:8000/api/user', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData) });
            const data = await response.json();
            if (!response.ok) { if (data.errors) { const errorMessages = Object.values(data.errors).flat().join(' '); throw new Error(errorMessages); } throw new Error(data.message || 'Failed to update profile.'); }
            window.Swal.fire('Success!', 'Profile updated successfully.', 'success');
            onUserUpdate(data.user);
        } catch (err) { window.Swal.fire('Error!', err.message, 'error'); } finally { setIsSaving(false); }
    };
    return (<div><h1>My Profile</h1><p>Update your personal information.</p><Card><Card.Body><Form onSubmit={handleSaveChanges}>
        <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Middle Name</Form.Label><Form.Control type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} /></Form.Group></Col></Row>
        <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Suffix</Form.Label><Form.Control type="text" name="suffix" value={formData.suffix} onChange={handleChange} /></Form.Group></Col></Row>
        <Form.Group className="mb-3"><Form.Label>Personal Email</Form.Label><Form.Control type="email" name="personal_email" value={formData.personal_email} onChange={handleChange} /></Form.Group><hr /><p>Your login email is: <strong>{user?.email}</strong>. It cannot be changed here.</p>
        <Button type="submit" disabled={isSaving} style={{ backgroundColor: '#5044e4', border: 'none' }}>{isSaving ? <Spinner as="span" size="sm" /> : 'Save Changes'}</Button>
    </Form></Card.Body></Card></div>);
}

// --- Compliance Matrix Page ---
function ComplianceMatrixPage({ token }) {
    const [programs, setPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState('');
    const [matrixData, setMatrixData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/programs', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                if (!response.ok) throw new Error('Failed to fetch programs.');
                const data = await response.json();
                setPrograms(data);
                if (data.length > 0) setSelectedProgramId(data[0].id);
            } catch (err) { setError(err.message); }
        };
        fetchPrograms();
    }, [token]);
    useEffect(() => {
        if (!selectedProgramId) return;
        const fetchMatrix = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch(`http://localhost:8000/api/programs/${selectedProgramId}/compliance-matrix`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                if (!response.ok) throw new Error('Failed to fetch compliance data.');
                const data = await response.json();
                setMatrixData(data);
            } catch (err) { setError(err.message); } finally { setIsLoading(false); }
        };
        fetchMatrix();
    }, [selectedProgramId, token]);
    return (<div><h1>Compliance Matrix</h1><p>Select a program to view its compliance status against accreditation criteria.</p><Form.Group className="mb-4"><Form.Label>Select Program</Form.Label><Form.Select value={selectedProgramId} onChange={e => setSelectedProgramId(e.target.value)}>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</Form.Select></Form.Group>
        {isLoading ? <div className="text-center p-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> :
            <Table striped bordered hover responsive><thead><tr><th>Criterion Code</th><th>Description</th><th>Document Needed</th><th>Status</th></tr></thead>
                <tbody>{matrixData.map(item => <tr key={item.id}><td>{item.criterion_code}</td><td>{item.description}</td><td>{item.document_needed}</td><td><Badge bg={item.status === 'Compliant' ? 'success' : 'danger'}>{item.status}</Badge></td></tr>)}</tbody>
            </Table>}
    </div>);
}

// --- Main Dashboard Layout ---
function DashboardLayout({ onLogout, token }) {
    const [user, setUser] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [currentView, setCurrentView] = useState('DASHBOARD');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('Failed to fetch user data');
            const userData = await response.json();
            setUser(userData);
        } catch (error) { console.error("Error fetching user:", error); onLogout(); }
    };
    useEffect(() => { fetchUser(); }, [token, onLogout]);
    const handleManageDocuments = (program) => { setSelectedProgram(program); setCurrentView('DOCUMENTS'); };
    const handleBackToPrograms = () => { setSelectedProgram(null); setCurrentView('PROGRAMS'); };
    const handleViewChange = (view) => {
        if (view === 'DOCUMENTS' && !selectedProgram) {
            window.Swal.fire('Info', 'Please select a program first from the Program Management page.', 'info');
            setCurrentView('PROGRAMS');
            return;
        }
        setCurrentView(view);
    };
    const handleUserUpdate = (updatedUser) => setUser(updatedUser);
    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
    const renderContent = () => {
        switch (currentView) {
            case 'DASHBOARD': return <DashboardHomepage token={token} />;
            case 'PROGRAMS': return <ProgramManagementPage token={token} onManageDocuments={handleManageDocuments} />;
            case 'DOCUMENTS': return <DocumentManagementPage program={selectedProgram} token={token} onBack={handleBackToPrograms} />;
            case 'COMPLIANCE': return <ComplianceMatrixPage token={token} />;
            case 'PROFILE': return <ProfilePage user={user} token={token} onUserUpdate={handleUserUpdate} />;
            default: return <DashboardHomepage token={token} />;
        }
    };
    return (<div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f7f6' }}>
        {sidebarVisible && <Sidebar user={user} onViewChange={handleViewChange} currentView={currentView} />}
        <div className="d-flex flex-column" style={{ flex: 1 }}>
            <TopNavbar onLogout={onLogout} onToggleSidebar={toggleSidebar} onViewChange={handleViewChange} />
            <main className="p-4 flex-grow-1">{renderContent()}</main>
        </div>
    </div>);
}
