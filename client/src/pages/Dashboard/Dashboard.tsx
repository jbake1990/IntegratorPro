import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('Dashboard rendered');
    console.log('User:', user);
    console.log('Is authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Welcome, {user.firstName} {user.lastName} ({user.username})
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Inventory</Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Invoices</Typography>
              <Typography variant="h4">23</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Low Stock Items</Typography>
              <Typography variant="h4">7</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Monthly Revenue</Typography>
              <Typography variant="h4">$45,678</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 