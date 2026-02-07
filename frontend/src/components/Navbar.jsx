import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header>
            <div className="header-main">
                <div className="container">
                    <Link to="/" className="header-logo">
                        <img src="/logo.png" alt="Bugsnug's logo" width="120" height="36" />
                    </Link>

                    <div className="header-search-container">
                        <input type="search" name="search" className="search-field" placeholder="Enter your product name..." />
                        <button className="search-btn">
                            <ion-icon name="search-outline"></ion-icon>
                        </button>
                    </div>

                    <div className="header-user-actions">
                        {user ? (
                            <>
                                <button className="action-btn">
                                    <ion-icon name="person-outline"></ion-icon>
                                </button>
                                <button onClick={logout} className="action-btn">
                                    <ion-icon name="log-out-outline"></ion-icon>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="action-btn">
                                <ion-icon name="person-outline"></ion-icon>
                            </Link>
                        )}
                        <button className="action-btn">
                            <ion-icon name="heart-outline"></ion-icon>
                            <span className="count">0</span>
                        </button>
                        <button className="action-btn">
                            <ion-icon name="bag-handle-outline"></ion-icon>
                            <span className="count">0</span>
                        </button>
                    </div>
                </div>
            </div>

            <nav className="desktop-navigation-menu">
                <div className="container">
                    <ul className="desktop-menu-category-list">
                        <li className="menu-category">
                            <Link to="/" className="menu-title">Home</Link>
                        </li>
                        <li className="menu-category">
                            <Link to="/contests" className="menu-title">Contests</Link>
                        </li>
                        <li className="menu-category">
                            <Link to="/problems" className="menu-title">Problems</Link>
                        </li>
                        <li className="menu-category">
                            <Link to="/friends" className="menu-title">Friends</Link>
                        </li>
                        <li className="menu-category">
                            <Link to="/study-material" className="menu-title">Study</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="mobile-bottom-navigation">
                <button className="action-btn" onClick={onOpenSidebar} data-mobile-menu-open-btn>
                    <ion-icon name="menu-outline"></ion-icon>
                </button>
                <Link to="/" className="action-btn">
                    <ion-icon name="home-outline"></ion-icon>
                </Link>
                <Link to="/contests" className="action-btn">
                    <ion-icon name="trophy-outline"></ion-icon>
                </Link>
                <Link to="/problems" className="action-btn">
                    <ion-icon name="code-slash-outline"></ion-icon>
                </Link>
                <Link to="/study-material" className="action-btn">
                    <ion-icon name="book-outline"></ion-icon>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
