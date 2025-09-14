import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
            const response = await fetch(`https://job-backend-49bv.onrender.com/api/jobs?${queryParams}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
        <Container className="my-5 animate__fadeIn">
            <h1 className="text-center mb-4">Job Dashboard</h1>
            <Form className="mb-4">
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
            <Row>
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <Col md={6} lg={4} key={job.job_id} className="mb-4">
                            <Link to={`/job/${job.job_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{job.job_role}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
                                        <Card.Text>
                                            <strong>Location:</strong> {job.location}
                                            <br />
                                            <strong>Qualification:</strong> {job.qualification}
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
