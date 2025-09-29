import React, { useState, useEffect } from 'react';
// Removed: import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// CRITICAL FIX: Since external CSS imports fail in this environment, 
// we inject the Bootstrap CDN link directly into the component's head using a <style> tag.
const bootstrapCDN = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';

// NOTE: This inline style block is used to apply modern, custom aesthetics 
// and professional colors to the Bootstrap components, matching the requested image design.
const customStyles = `
    /* Inject Bootstrap CSS via CDN */
    @import url('${bootstrapCDN}');

    /* Custom Styling for JobLinker Dashboard */
    body {
        background-color: #f8f9fa; 
    }

    .dashboard-header {
        font-weight: 800;
        color: #333333;
    }

    /* Job Card Styling for Modern Look */
    .job-card {
        border: none;
        border-radius: 12px;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .job-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12); 
    }

    /* Professional Blue for Titles */
    .job-card-title {
        color: #173f5f; /* Deep Navy Blue */
        font-weight: 700;
        font-size: 1.25rem;
    }

    /* Flex setup for inner card content */
    .job-card-body {
        display: flex;
        flex-direction: column;
        height: 100%; /* Important for internal flex layout */
    }

    /* Text styling */
    .text-detail {
        color: #5a5a5a;
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
    }
`;

function JobDashboard() {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        job_role: '',
        location: '',
        type: ''
    });

    const fetchJobs = async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            // Implement exponential backoff for the fetch request
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
                    // Log connection error but don't stop retry loop
                    console.error(`Attempt ${attempts + 1} failed:`, e.message);
                }
                
                attempts++;
                if (attempts < maxRetries) {
                    const delay = initialDelay * Math.pow(2, attempts);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            if (!response || !response.ok) {
                // throw new Error('Network response was not ok after multiple retries.');
                // Instead of throwing, log the error and ensure 'jobs' is an empty array to prevent crashing
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
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <Container className="my-5">
            {/* Inject Custom CSS Styles and Bootstrap CDN */}
            <style>{customStyles}</style>
            
            <h1 className="text-center mb-5 dashboard-header">Job Dashboard</h1>
            
            {/* Filter Form */}
            <Form className="mb-4 shadow p-3 bg-white rounded-lg">
                <Row>
                    <Col md={4}>
                        <Form.Group className='mb-2'>
                            <Form.Control
                                type="text"
                                placeholder="Search by Job Role Like Software Devloper"
                                name="job_role"
                                value={filters.job_role}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className='mb-2'>
                            <Form.Control
                                type="text"
                                placeholder="Filter by Location Like Pune"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className='mb-2'>
                            <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                                <option value="">Select Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            
            {/* Job Listings Grid */}
            {/* HEIGHT FIX: d-flex on Row, Col, Link, and h-100 on Card */}
            <Row className="g-4 d-flex">
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <Col md={6} lg={4} key={job.job_id} className="mb-4 d-flex">
                            {/* w-100 d-flex ensures the Link component expands to fill the Col's height */}
                            <Link to={`/job/${job.job_id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="w-100 d-flex">
                                {/* h-100 and job-card custom style ensure equal height and appearance */}
                                <Card className="h-100 job-card w-100">
                                    <Card.Body className="job-card-body">
                                        <Card.Title className="job-card-title">{job.job_role}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
                                        {/* flex-grow-1 ensures this content area takes up all available vertical space */}
                                        <Card.Text className="flex-grow-1 mt-2">
                                            <div className="text-detail"><strong>Location:</strong> {job.location}</div>
                                            <div className="text-detail"><strong>Qualification:</strong> {job.qualification}</div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <p className="text-center w-100">No jobs found matching your criteria.</p>
                )}
            </Row>
        </Container>
    );
}

export default JobDashboard;
