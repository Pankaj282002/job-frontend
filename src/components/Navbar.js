import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    JobLink
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="https://chat.whatsapp.com/EfdlfYQypNHDAJkqVw4UXR" target="_blank" className="social-icon-link whatsapp">
                            <FaWhatsapp size={24} />
                        </Nav.Link>
                        <Nav.Link href="https://www.instagram.com/job_linkers0/" target="_blank" className="social-icon-link instagram">
                            <FaInstagram size={24} />
                        </Nav.Link>
                        <Nav.Link href="https://www.linkedin.com/in/" target="_blank" className="social-icon-link linkedin">
                            <FaLinkedin size={24} />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;