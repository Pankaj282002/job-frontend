import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`https://job-backend-49bv.onrender.com/api/jobs/${id}`);
                if (!response.ok) {
                    throw new Error('Job not found');
                }
                const data = await response.json();
                setJob(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title as="h2" className="text-center mb-4">{job.job_role}</Card.Title>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Card.Text>
                                <strong>Company:</strong> {job.company_name}
                            </Card.Text>
                            <Card.Text>
                                <strong>Location:</strong> {job.location}
                            </Card.Text>
                            <Card.Text>
                                <strong>Qualification:</strong> {job.qualification}
                            </Card.Text>
                            <Card.Text>
                                <strong>Experience:</strong> {job.experience_level || 'Not specified'}
                            </Card.Text>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Card.Text>
                                <strong>Required Skills:</strong>
                            </Card.Text>
                            <Card.Text>
                                {job.required_skills || 'Not specified'}
                            </Card.Text>
                            <Card.Text>
                                <strong>Batch:</strong> {job.batch || 'Not specified'}
                            </Card.Text>
                            <Card.Text>
                                <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Apply Here
                                </a>
                            </Card.Text>
                        </div>
                    </div>
                    <Card.Text className="mt-4">
                        <strong>Job Description:</strong>
                        <br />
                        {job.job_description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default JobDetails;
