import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import menuIconImage from './menu.png'; // Three bar icon

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        logout(); // Call the logout function from the context
        setIsOpen(false); // Close the dropdown menu
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div className="menu-container">
            <button className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                <img src={menuIconImage} alt="Menu" />
            </button>
            <div className={`dropdown ${isOpen ? 'show' : ''}`}>
                {isAuthenticated && (
                    <>
                        <Link to="/create-event" className="dropdown-item" onClick={() => setIsOpen(false)}>Create Event</Link>
                        <Link to="/view-events" className="dropdown-item" onClick={() => setIsOpen(false)}>View Events</Link>
                    </>
                )}
                {isAuthenticated ? (
                    <Link to="/login" className="dropdown-item" onClick={() => { setIsOpen(false); handleLogout(); }}>Logout</Link>
                ) : (
                    <>
                        <Link to="/login" className="dropdown-item" onClick={() => setIsOpen(false)}>Login</Link>
                        <Link to="/register" className="dropdown-item" onClick={() => setIsOpen(false)}>Register</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default DropdownMenu;
