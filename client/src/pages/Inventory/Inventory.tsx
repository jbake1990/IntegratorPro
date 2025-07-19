import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as TruckIcon,
  Warehouse as WarehouseIcon,
  Person as CustomerIcon,
  Assignment as JobIcon
} from '@mui/icons-material';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouseStock: number;
  truckStock: number;
  allocatedStock: number;
  totalStock: number;
  minStock: number;
  maxStock: number;
  cost: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
}

const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    sku: 'SPK-001',
    name: 'In-Ceiling Speaker 8"',
    category: 'Audio Equipment',
    warehouseStock: 45,
    truckStock: 12,
    allocatedStock: 8,
    totalStock: 65,
    minStock: 10,
    maxStock: 100,
    cost: 89.99,
    price: 149.99,
    status: 'In Stock'
  },
  {
    id: '2',
    sku: 'AMP-001',
    name: 'Multi-Zone Amplifier',
    category: 'Audio Equipment',
    warehouseStock: 8,
    truckStock: 3,
    allocatedStock: 2,
    totalStock: 13,
    minStock: 5,
    maxStock: 25,
    cost: 299.99,
    price: 499.99,
    status: 'Low Stock'
  },
  {
    id: '3',
    sku: 'CBL-001',
    name: 'HDMI Cable 50ft',
    category: 'Cables',
    warehouseStock: 0,
    truckStock: 0,
    allocatedStock: 5,
    totalStock: 5,
    minStock: 20,
    maxStock: 100,
    cost: 19.99,
    price: 39.99,
    status: 'Out of Stock'
  }
];

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventoryData] = useState<InventoryItem[]>(mockInventoryData);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'move' | 'adjust'>('add');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'add' | 'edit' | 'move' | 'adjust', item?: InventoryItem | null) => {
    setDialogType(type);
    setSelectedItem(item || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'Overstocked':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderInventoryTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Warehouse</TableCell>
            <TableCell align="right">Trucks</TableCell>
            <TableCell align="right">Allocated</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell align="right">{item.warehouseStock}</TableCell>
              <TableCell align="right">{item.truckStock}</TableCell>
              <TableCell align="right">{item.allocatedStock}</TableCell>
              <TableCell align="right">{item.totalStock}</TableCell>
              <TableCell align="right">${item.cost.toFixed(2)}</TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Chip 
                  label={item.status} 
                  color={getStatusColor(item.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderStockMovement = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Stock Movement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <WarehouseIcon sx={{ mr: 1 }} />
                Warehouse to Truck
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Move inventory from warehouse to trucks for field work
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CustomerIcon sx={{ mr: 1 }} />
                Allocate to Customer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reserve inventory for specific customers or jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <JobIcon sx={{ mr: 1 }} />
                Job Allocation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Allocate inventory to specific installation jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TruckIcon sx={{ mr: 1 }} />
                Truck to Warehouse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Return unused inventory from trucks to warehouse
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPurchasing = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Purchasing & Receiving
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Purchase Orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and manage purchase orders for inventory
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Receiving
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive and process incoming inventory shipments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderReports = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Inventory Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Low Stock Items</Typography>
              <Typography variant="h4" color="warning.main">7</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Out of Stock</Typography>
              <Typography variant="h4" color="error.main">3</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Value</Typography>
              <Typography variant="h4" color="success.main">$45,678</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Add New Item
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Inventory" />
        <Tab label="Stock Movement" />
        <Tab label="Purchasing & Receiving" />
        <Tab label="Reports" />
      </Tabs>

      {activeTab === 0 && renderInventoryTable()}
      {activeTab === 1 && renderStockMovement()}
      {activeTab === 2 && renderPurchasing()}
      {activeTab === 3 && renderReports()}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleOpenDialog('edit', selectedItem);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Item
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDialog('move', selectedItem);
          handleMenuClose();
        }}>
          <TruckIcon sx={{ mr: 1 }} />
          Move Stock
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDialog('adjust', selectedItem);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Adjust Count
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Item
        </MenuItem>
      </Menu>

      {/* Dialog for Add/Edit/Move/Adjust */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Inventory Item'}
          {dialogType === 'edit' && 'Edit Inventory Item'}
          {dialogType === 'move' && 'Move Stock'}
          {dialogType === 'adjust' && 'Adjust Stock Count'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This is a demo interface. In a real application, this would connect to your database.
          </Alert>
          <Typography>
            {dialogType === 'add' && 'Add new SKU and inventory item'}
            {dialogType === 'edit' && 'Edit item details and pricing'}
            {dialogType === 'move' && 'Move stock between warehouse, trucks, and allocations'}
            {dialogType === 'adjust' && 'Manually adjust stock counts'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {dialogType === 'add' && 'Add Item'}
            {dialogType === 'edit' && 'Save Changes'}
            {dialogType === 'move' && 'Move Stock'}
            {dialogType === 'adjust' && 'Adjust Count'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory; 