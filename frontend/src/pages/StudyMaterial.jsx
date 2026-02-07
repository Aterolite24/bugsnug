import React from 'react';
import '../styles/dashboard.css'; // Reusing dashboard styles for consistency

const StudyMaterial = () => {
    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Study Material</h2>

            <div className="stats-grid">
                {/* Topic: Algorithms */}
                <div className="stat-card activity">
                    <div className="stat-header">
                        <div className="stat-icon activity">
                            <ion-icon name="book"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">Algorithms</h3>
                        <p className="stat-label">Core Concepts</p>
                        <p className="stat-subtext">Sorting, Searching, Graph Theory, DP</p>
                    </div>
                    <div className="stat-footer">
                        <a href="https://cp-algorithms.com/" target="_blank" rel="noopener noreferrer" className="stat-action">Read Docs</a>
                    </div>
                </div>

                {/* Topic: Data Structures */}
                <div className="stat-card code">
                    <div className="stat-header">
                        <div className="stat-icon code">
                            <ion-icon name="server"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">Data Structures</h3>
                        <p className="stat-label">Organization</p>
                        <p className="stat-subtext">Arrays, Trees, Graphs, Heaps</p>
                    </div>
                    <div className="stat-footer">
                        <a href="https://www.geeksforgeeks.org/data-structures/" target="_blank" rel="noopener noreferrer" className="stat-action">View Guide</a>
                    </div>
                </div>

                {/* Topic: Mathematics */}
                <div className="stat-card profile">
                    <div className="stat-header">
                        <div className="stat-icon profile">
                            <ion-icon name="calculator"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">Mathematics</h3>
                        <p className="stat-label">Number Theory</p>
                        <p className="stat-subtext">Primes, Combinatorics, Geometry</p>
                    </div>
                    <div className="stat-footer">
                        <a href="https://mathworld.wolfram.com/" target="_blank" rel="noopener noreferrer" className="stat-action">Explore</a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudyMaterial;
