import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contests from './pages/Contests';
import Problems from './pages/Problems';
import Friends from './pages/Friends';
import StudyMaterial from './pages/StudyMaterial';
import Layout from './components/Layout';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="contests" element={
          <PrivateRoute>
            <Contests />
          </PrivateRoute>
        } />
        <Route path="problems" element={
          <PrivateRoute>
            <Problems />
          </PrivateRoute>
        } />
        <Route path="friends" element={
          <PrivateRoute>
            <Friends />
          </PrivateRoute>
        } />
        <Route path="study-material" element={
          <PrivateRoute>
            <StudyMaterial />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
