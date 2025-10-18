import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CategoryListing from './components/CategoryListing';
import CategoryCreate from './components/CategoryCreate';
import MenuItemsListing from './components/MenuItemsListing';
import CreateItem from './components/CreateItem';
import StaffListing from './components/StaffListing';
import CreateStaff from './components/CreateStaff';
import ToastComponent, { useToast } from './components/Toast';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { showToast, hideToast, toasts } = useToast();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm showToast={showToast} />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories/listing" 
            element={
              <ProtectedRoute>
                <CategoryListing showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories/create" 
            element={
              <ProtectedRoute>
                <CategoryCreate showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/items/listing" 
            element={
              <ProtectedRoute>
                <MenuItemsListing showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/items/create" 
            element={
              <ProtectedRoute>
                <CreateItem showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/listing" 
            element={
              <ProtectedRoute>
                <StaffListing showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/create" 
            element={
              <ProtectedRoute>
                <CreateStaff showToast={showToast} />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <ToastComponent toasts={toasts} hideToast={hideToast} />
      </div>
    </Router>
  );
}

export default App;
