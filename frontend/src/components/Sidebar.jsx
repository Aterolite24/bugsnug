import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <nav className={`sidebar ${isOpen ? 'active' : ''}`} data-mobile-menu>
            <div className="sidebar-category">
                <div className="sidebar-top">
                    <h2 className="sidebar-title">Menu</h2>
                    <button className="sidebar-close-btn" onClick={onClose} data-mobile-menu-close-btn>
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>

                <ul className="sidebar-menu-category-list">
                    <li className="sidebar-accordion-menu" data-accordion>
                        <div className="menu-title-flex">
                            <ion-icon name="home-outline"></ion-icon>
                            <Link to="/" className="menu-title">Dashboard</Link>
                        </div>
                    </li>

                    <li className="sidebar-accordion-menu" data-accordion>
                        <div className="menu-title-flex">
                            <ion-icon name="trophy-outline"></ion-icon>
                            <Link to="/contests" className="menu-title">Contests</Link>
                        </div>
                    </li>

                    <li className="sidebar-accordion-menu" data-accordion>
                        <div className="menu-title-flex">
                            <ion-icon name="code-slash-outline"></ion-icon>
                            <Link to="/problems" className="menu-title">Problems</Link>
                        </div>
                    </li>

                    <li className="sidebar-accordion-menu" data-accordion>
                        <div className="menu-title-flex">
                            <ion-icon name="people-outline"></ion-icon>
                            <Link to="/friends" className="menu-title">Friends</Link>
                        </div>
                    </li>

                    <li className="sidebar-accordion-menu" data-accordion>
                        <div className="menu-title-flex">
                            <ion-icon name="book-outline"></ion-icon>
                            <Link to="/study-material" className="menu-title">Study</Link>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="product-showcase">
                <h3 className="showcase-heading">My Stats</h3>
                <div className="showcase">
                    <div className="showcase-content">
                        <Link to="#" className="showcase-title">Problems Solved</Link>
                        <div className="showcase-rating">
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                        </div>
                        <div className="price-box">
                            <p className="price">125</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
