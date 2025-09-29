import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobDashboard from './components/JobDashboard';
import JobDetails from './components/JobDetails';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
           
            <div style={{ minHeight: '80vh' }}>
                <Routes>
                    <Route path="/" element={<JobDashboard />} />
                    <Route path="/job/:id" element={<JobDetails />} />
                    <Route path="/login" element={<Login />} />
                    
                    // Protected Routes
                    <Route path="/admin" element={ <PrivateRoute>
                                <AdminPanel />
                            </PrivateRoute> } />
                   
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
