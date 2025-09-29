import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// CRITICAL: Bootstrap CSS imported via CDN URL in the <style> block below 
const bootstrapCDN = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';

// --- CUSTOM STYLING (FOR BRANDING AND UX/UI) ---
const customStyles = `
    /* Inject Bootstrap CSS via CDN */
    @import url('${bootstrapCDN}');

    /* 1. Global & Typography Enhancements */
    body {
        background-color: #f0f2f5; /* Very soft light gray background */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* Primary Branding Colors */
    .color-primary { color: #173f5f; } /* Deep Navy Blue */
    .bg-primary-dark { background-color: #173f5f; }
    .btn-primary-custom {
        background-color: #4a6fa5; /* Mid-tone accent blue */
        border-color: #4a6fa5;
        color: white;
    }
    .btn-primary-custom:hover {
        background-color: #173f5f;
        border-color: #173f5f;
    }

    /* 2. Hero Section */
    .hero-section {
        background: linear-gradient(135deg, #173f5f, #4a6fa5);
        color: white;
        padding: 4rem 0;
        margin-bottom: 2rem;
        border-radius: 0 0 15px 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .hero-title { font-size: 3rem; font-weight: 800; }
    .hero-tagline { font-size: 1.5rem; font-weight: 300; }

    /* 3. Job Card Styling (Equal Height & Visual Pop) */
    .job-card {
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        background-color: #ffffff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); 
        transition: transform 0.2s, box-shadow 0.2s;
        padding: 0; /* Remove default padding for better control */
    }
    
    .job-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
    }

    /* Job Card Body Flex for equal height content */
    .job-card-body {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1.5rem;
    }

    /* Job Title Enhancement (18pt-24pt) */
    .job-card-title-custom {
        color: #173f5f;
        font-weight: 800;
        font-size: 1.25rem; /* ~20px */
        margin-bottom: 0.5rem;
        line-height: 1.2;
    }

    /* Secondary Text & Icons */
    .card-subtitle {
        color: #5a5a5a; /* Gray secondary text */
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    /* Qualification List Styling */
    .qualification-list {
        padding-left: 20px;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #444;
    }
    .qualification-list li {
        margin-bottom: 3px;
    }

    /* Sidebar Filter Card */
    .filter-card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        padding: 1rem;
        margin-bottom: 1.5rem;
    }

    /* Small screens (Mobile) adjustments */
    @media (max-width: 767.98px) {
        .hero-section { padding: 2rem 0; }
        .hero-title { font-size: 2rem; }
        .hero-tagline { font-size: 1.1rem; }
    }
`;

// Helper function to convert a run-on string (qualification) into bullet points
const formatQualification = (qualification) => {
    if (!qualification) return null;
    
    // Simple logic to split based on common separators (periods, semicolons, or commas) 
    // and clean up extra spaces/typos like "Devloper"
    let points = qualification.replace(/devloper/ig, 'Developer').split(/[\.;,]\s*/).filter(p => p.trim() !== '');
    
    // If the split didn't yield clear points, just treat the whole thing as one point
    if (points.length < 2) {
        return <li>{points[0] || qualification.replace(/devloper/ig, 'Developer')}</li>;
    }
    
    // Limit to top 3 points for card view clarity
    return points.slice(0, 3).map((point, index) => (
        <li key={index}>{point.trim()}</li>
    ));
};

function JobDashboard() {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        job_role: '',
        location: '',
        type: ''
    });

    const fetchJobs = async () => {
        // ... (fetch logic with exponential backoff remains the same)
        try {
            const queryParams = new URLSearchParams(filters).toString();
            let response = null;
            let attempts = 0;
            const maxRetries = 3;
            const initialDelay = 1000;

            while (attempts < maxRetries) {
                try {
                    response = await fetch(`https://job-backend-49bv.onrender.com/api/jobs?${queryParams}`);
                    if (response.ok) {
                        break;
                    }
                } catch (e) {
                    console.error(`Attempt ${attempts + 1} failed:`, e.message);
                }
                
                attempts++;
                if (attempts < maxRetries) {
                    const delay = initialDelay * Math.pow(2, attempts);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            if (!response || !response.ok) {
                console.error('Failed to fetch jobs after multiple retries.');
                setJobs([]);
                return;
            }

            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        // Fix typo: If user types "Devloper", treat it as "Developer" for API
        const cleanedValue = value.replace(/devloper/ig, 'developer'); 

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: cleanedValue
        }));
    };

    return (
        <>
            {/* Inject Custom CSS Styles and Bootstrap CDN */}
            <style>{customStyles}</style>

            {/* Navbar (Branding and Navigation) */}
            <Navbar className="bg-white shadow-sm" expand="md" sticky="top">
                <Container>
                    <Navbar.Brand className="color-primary fw-bold" style={{ fontSize: '1.5rem' }}>
                        <span className="me-2" role="img" aria-label="Logo">🔗</span>
                        JobLinker
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="#" className="color-primary fw-medium">Dashboard</Nav.Link>
                            <Nav.Link href="#">About</Nav.Link>
                            <Nav.Link href="#">Contact</Nav.Link>
                            <Nav.Link href="#">Profile</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <div className="hero-section text-center">
                <Container>
                    <h1 className="hero-title mb-2">Find Your Next Opportunity</h1>
                    <p className="hero-tagline">Connecting talent with top companies, seamlessly.</p>
                </Container>
            </div>

            <Container>
                {/* Main Content Row: Sidebar (Filters) and Job List */}
                <Row>
                    {/* Sidebar: Filters (Moved to the left for better space utilization) */}
                    <Col md={12} lg={3} className="mb-4">
                        <Card className="filter-card">
                            <Card.Body>
                                <h5 className="fw-bold color-primary mb-4">Filter Jobs</h5>
                                <Form>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-medium">Job Role</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Software Developer"
                                            name="job_role"
                                            value={filters.job_role}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-medium">Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Pune"
                                            name="location"
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className="fw-medium">Type</Form.Label>
                                        <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                                            <option value="">All Types</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Main Content: Job Cards */}
                    <Col md={12} lg={9}>
                        <h3 className="fw-bold mb-4">Latest Opportunities ({jobs.length})</h3>
                        
                        {/* Job Listings Grid (FIXED HEIGHT) */}
                        <Row className="g-4 d-flex">
                            {jobs.length > 0 ? (
                                jobs.map(job => (
                                    // Col: d-flex ensures the column height is equal
                                    <Col md={6} lg={4} key={job.job_id} className="mb-4 d-flex">
                                        {/* Link: w-100 d-flex ensures it fills the column height */}
                                        <Link to={`/job/${job.job_id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="w-100 d-flex">
                                            {/* Card: h-100 ensures the card fills the available height */}
                                            <Card className="h-100 job-card w-100">
                                                <Card.Body className="job-card-body">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <span style={{ fontSize: '1.5rem', marginRight: '8px' }} role="img" aria-label="briefcase">💼</span>
                                                        <Card.Title className="job-card-title-custom mb-0">
                                                            {job.job_role.replace(/devloper/ig, 'Developer')}
                                                        </Card.Title>
                                                    </div>
                                                    
                                                    <Card.Subtitle>
                                                        {job.company_name}
                                                    </Card.Subtitle>
                                                    
                                                    {/* Location & Type Details */}
                                                    <div className="mb-2">
                                                        <p className="card-subtitle mb-1">
                                                            <span className="me-2" role="img" aria-label="map pin">📍</span>
                                                            <strong>{job.location}</strong>
                                                        </p>
                                                        <p className="card-subtitle mb-1">
                                                            <span className="me-2" role="img" aria-label="type">🕒</span>
                                                            {job.type || 'Full-time'}
                                                        </p>
                                                    </div>

                                                    {/* Qualification (Bulleted List for Readability) - flex-grow-1 pushes button down */}
                                                    <div className="flex-grow-1 mb-3">
                                                        <h6 className="fw-bold mb-2 text-primary-dark">Top Skills:</h6>
                                                        <ul className="qualification-list">
                                                            {formatQualification(job.qualification)}
                                                        </ul>
                                                    </div>

                                                    {/* View Details Button - pushed to bottom with mt-auto */}
                                                    <div className="mt-auto">
                                                        <a href={`/job/${job.job_id}`} className="btn btn-sm btn-primary-custom w-100">
                                                            View & Apply
                                                        </a>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))
                            ) : (
                                <p className="text-center w-100 text-muted mt-5">No jobs found matching your criteria. Try adjusting your filters.</p>
                            )}
                        </Row>
                    </Col>
                </Row>

                {/* Footer Enhancement */}
                <Row className="mt-5 pt-4 border-top">
                    <Col className="text-center">
                        <p className="text-muted mb-3">&copy; {new Date().getFullYear()} JobLinker. All rights reserved.</p>
                        <div className="d-flex justify-content-center">
                            {/* Social Icons (using Unicode for simple icons) */}
                            <a href="https://www.linkedin.com/in/patilpankaj2712/" target="_blank" rel="noopener noreferrer" className="mx-3 text-secondary" style={{ fontSize: '1.5rem' }}>
                                🔗 
                            </a>
                            <a href="https://github.com/Pankaj282002" target="_blank" rel="noopener noreferrer" className="mx-3 text-secondary" style={{ fontSize: '1.5rem' }}>
                                🐙
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default JobDashboard;
