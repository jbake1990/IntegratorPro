import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Alert, Typography } from '@mui/material';

// Layout Components
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Inventory from './pages/Inventory/Inventory';
import Invoices from './pages/Invoices/Invoices';
import PurchaseOrders from './pages/PurchaseOrders/PurchaseOrders';
import Receiving from './pages/Receiving/Receiving';
import Customers from './pages/Customers/Customers';
import Vendors from './pages/Vendors/Vendors';
import Vehicles from './pages/Vehicles/Vehicles';
import Warehouses from './pages/Warehouses/Warehouses';
import Users from './pages/Users/Users';
import PointOfSale from './pages/PointOfSale/PointOfSale';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Hooks
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    console.log('App component mounted');
    console.log('Is authenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Loading:', loading);
  }, [isAuthenticated, user, loading]);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Show error if there's an issue
  if (!isAuthenticated && localStorage.getItem('token')) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Authentication state mismatch. Please try logging in again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="receiving" element={<Receiving />} />
          <Route path="customers" element={<Customers />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="users" element={<Users />} />
          <Route path="pos" element={<PointOfSale />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  );
}

export default App; 