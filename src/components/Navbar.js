import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const logoPath = '/logo192.png';
const AppNavbar = () => {
    return (
        <Navbar className="bg-white shadow-sm" expand="md" sticky="top">
                       <Container>
                           <Navbar.Brand className="color-primary fw-bold" style={{ fontSize: '1.5rem' }}>
                               {/* REPLACED EMOJI WITH PNG LOGO */}
                               <img 
                                   src={logoPath} // Path: /logo192.png
                                   alt="JobVista Logo" 
                                   height="30" 
                                   className="d-inline-block align-top me-2 rounded" 
                                   onError={(e) => {
                                       e.target.onerror = null; // Prevents infinite loop
                                       // Fallback placeholder image
                                       e.target.src = 'https://placehold.co/30x30/173f5f/ffffff?text=JV'; 
                                   }}
                               />
                               JobVista
                           </Navbar.Brand>
                           <Navbar.Toggle aria-controls="basic-navbar-nav" />
                           <Navbar.Collapse id="basic-navbar-nav">
                               <Nav className="ms-auto">
                                   <Nav.Link href="https://job-frontend-ce4s.vercel.app/" className="color-primary fw-medium">Dashboard</Nav.Link>
                                   <Nav.Link href="#">About</Nav.Link>
                                   <Nav.Link href="#">Contact</Nav.Link>
                                   <Nav.Link href="#">Profile</Nav.Link>
                               </Nav>
                           </Navbar.Collapse>
                       </Container>
                   </Navbar>
    );
};

export default AppNavbar;