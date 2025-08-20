import React from 'react';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-3">
            <div className="container-fluid">
                <a
                    className="navbar-brand fw-bold"
                    href="/"
                    style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.8rem" }}
                >
                    EventBright
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/properties">Browse Shows</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/aboutUs">About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/contactUs">Admin</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
