import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PointOfSale as POSIcon,
  People as CustomersIcon,
  Inventory as InventoryIcon,
  Analytics as SalesAnalysisIcon,
  Receipt as BillingIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Point of Sale', icon: <POSIcon />, path: '/pos' },
  { text: 'Customers', icon: <CustomersIcon />, path: '/customers' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Sales Analysis', icon: <SalesAnalysisIcon />, path: '/sales-analysis' },
  { text: 'Billing', icon: <BillingIcon />, path: '/billing' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: '#374151' }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.2,
          }}
        >
          <span style={{ color: '#FFFFFF' }}>Integrator</span>{' '}
          <span style={{ color: '#2563EB' }}>Pro</span>
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#374151',
                color: '#FFFFFF',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#FFFFFF' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#FFFFFF' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar 
          position="static" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: { sm: 'none' }
          }}
        >
        <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Integrator Pro
          </Typography>
        </Toolbar>
      </AppBar>
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            ml: { xs: 0, sm: `${drawerWidth}px` },
            width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }
          }}
        >
        <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 