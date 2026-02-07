import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>

            <div className="stats-grid">

                {/* Profile Stats */}
                <div className="stat-card profile">
                    <div className="stat-header">
                        <div className="stat-icon profile">
                            <ion-icon name="person"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">{user?.username}</h3>
                        <p className="stat-label">Welcome Back</p>
                        <p className="stat-subtext">{user?.email}</p>
                    </div>
                    <div className="stat-footer">
                        <span className="stat-action">Edit Profile</span>
                    </div>
                </div>

                {/* Solving Stats */}
                <div className="stat-card code">
                    <div className="stat-header">
                        <div className="stat-icon code">
                            <ion-icon name="code-slash"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">{user?.codeforces_handle || 'N/A'}</h3>
                        <p className="stat-label">Codeforces Handle</p>
                        <p className="stat-subtext">Rating: Unrated</p>
                    </div>
                    <div className="stat-footer">
                        <Link to="/problems" className="stat-action">Solve Problems</Link>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="stat-card activity">
                    <div className="stat-header">
                        <div className="stat-icon activity">
                            <ion-icon name="pulse"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">0</h3>
                        <p className="stat-label">Day Streak</p>
                        <p className="stat-subtext">Keep it up!</p>
                    </div>
                    <div className="stat-footer">
                        <span className="stat-action">View History</span>
                    </div>
                </div>

                {/* Contest Stats */}
                <div className="stat-card contest">
                    <div className="stat-header">
                        <div className="stat-icon contest">
                            <ion-icon name="trophy"></ion-icon>
                        </div>
                    </div>
                    <div className="stat-body">
                        <h3 className="stat-value">0</h3>
                        <p className="stat-label">Contests Joined</p>
                        <p className="stat-subtext">Next: Weekly #45</p>
                    </div>
                    <div className="stat-footer">
                        <Link to="/contests" className="stat-action">View Calendar</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
