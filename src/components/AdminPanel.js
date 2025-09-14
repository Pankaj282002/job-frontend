import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        company_name: '',
        job_role: '',
        location: '',
        qualification: '',
        experience_level: '',
        job_description: '',
        required_skills: '',
        batch: '',
        apply_link: ''
    });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [jobs, setJobs] = useState([]); // State to hold jobs from the backend
    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobs');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to post job');
            }

            const result = await response.json();
            setStatus({ message: result.msg, type: 'success' });
            setFormData({
                company_name: '',
                job_role: '',
                location: '',
                qualification: '',
                experience_level: '',
                job_description: '',
                required_skills: '',
                batch: '',
                apply_link: ''
            });
            fetchJobs(); // Refresh the job list after posting
        } catch (error) {
            setStatus({ message: error.message || 'An error occurred.', type: 'danger' });
        }
    };

    // New functions for editing and deleting
    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                const token = localStorage.getItem('token');
                 if (!token) {
                alert('You must be logged in to delete a job.');
                return;
            }
                const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (response.ok) {
                    alert('Job deleted successfully!');
                    fetchJobs(); // Refresh the list
                } else {
                    const errorData = await response.json();
                    alert(errorData.msg || 'Failed to delete job.');
                }
            } catch (error) {
                console.error("Error deleting job:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };

    const handleEdit = (jobId) => {
        // We will implement this in the next step
       navigate(`/edit/${jobId}`);
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Admin Panel - Post New Job</h1>
            {/* Post Job Form (Your existing code) */}
            {/* ... */}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Job Role</Form.Label>
                    <Form.Control type="text" name="job_role" value={formData.job_role} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Control type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Experience Level</Form.Label>
                    <Form.Control type="text" name="experience_level" value={formData.experience_level} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name="job_description" value={formData.job_description} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Required Skills</Form.Label>
                    <Form.Control as="textarea" rows={2} name="required_skills" value={formData.required_skills} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Batch</Form.Label>
                    <Form.Control type="text" name="batch" value={formData.batch} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Apply Link</Form.Label>
                    <Form.Control type="url" name="apply_link" value={formData.apply_link} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">Post Job</Button>
            </Form>
            <hr className="my-5" />

            {/* List of Existing Jobs */}
            <h2 className="text-center mb-4">Existing Job Listings</h2>
            <Row>
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <Col md={6} lg={4} key={job.job_id} className="mb-4">
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{job.job_role}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Location:</strong> {job.location}
                                        <br />
                                        <strong>Qualification:</strong> {job.qualification}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Button variant="danger" onClick={() => handleDelete(job.job_id)}>Delete</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center w-100">No jobs found. Add some new listings!</p>
                )}
            </Row>
        </Container>
    );
};

export default AdminPanel;