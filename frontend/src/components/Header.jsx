// ====================================
// Header Component
// ====================================
// This is the top banner of our website
// Shows the logo, title, and tagline

import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo section with sun emoji and title */}
                    <div className="logo">
                        <span className="logo-icon">☀️</span>
                        <h1>Solar Potential Calculator</h1>
                    </div>

                    {/* Tagline explaining what this tool does */}
                    <p className="tagline">
                        Estimate your rooftop solar energy potential using real-time NASA data
                    </p>
                </div>
            </div>
        </header>
    );
}

export default Header;
