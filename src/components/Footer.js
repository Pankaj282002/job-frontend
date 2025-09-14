import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
            <Container>
                <Row>
                    <Col>
                        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-white mx-2 social-icon-link whatsapp">
                            <FaWhatsapp size={24} />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-white mx-2 social-icon-link instagram">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-white mx-2 social-icon-link linkedin">
                            <FaLinkedin size={24} />
                        </a>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <p>&copy; {new Date().getFullYear()} JobLink. All rights reserved.</p>
                        <p className="mb-0">A platform dedicated to helping you achieve your career goals.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;