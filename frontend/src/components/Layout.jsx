import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-container">
            <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} data-overlay></div>

            <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

            <main className="container">
                <div className="main-content-flex">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    <div className="product-box">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

// Internal Header component to avoid import loop or confusion, purely structural
const Header = ({ onOpenSidebar }) => (
    <Navbar onOpenSidebar={onOpenSidebar} />
);

export default Layout;
