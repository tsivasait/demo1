import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BlogPost from './pages/BlogPost';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/admin/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <main className="min-h-screen pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/admin/*" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;