import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo">
                    <span className="logo-icon">☀️</span>
                    <h1>Solar Potential Calculator</h1>
                </div>
                <p className="tagline">Estimate your solar energy savings instanty</p>
            </div>
        </header>
    );
};

export default Header;
