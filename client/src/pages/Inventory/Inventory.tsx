import React, { useState, useMemo } from 'react';
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
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as TruckIcon,
  Warehouse as WarehouseIcon,
  Person as CustomerIcon,
  Assignment as JobIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface InventoryItem {
  id: string;
  sku: string;
  partNumber: string;
  name: string;
  description: string;
  manufacturer: string;
  tags: string[];
  category: string;
  vendor: string;
  warehouseStock: number;
  truckStock: number;
  allocatedStock: number;
  totalStock: number;
  minStock: number;
  maxStock: number;
  cost: number;
  sellingPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
}

const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    sku: 'SPK-001',
    partNumber: 'SPK-8IN-CEILING',
    name: 'In-Ceiling Speaker 8"',
    description: 'High-quality 8-inch in-ceiling speaker with 2-way design, perfect for home theater and commercial audio installations',
    manufacturer: 'AudioTech Pro',
    tags: ['speaker', 'ceiling', 'audio', 'home theater'],
    category: 'Audio Equipment',
    vendor: 'AudioTech Pro',
    warehouseStock: 45,
    truckStock: 12,
    allocatedStock: 8,
    totalStock: 65,
    minStock: 10,
    maxStock: 100,
    cost: 89.99,
    sellingPrice: 149.99,
    status: 'In Stock'
  },
  {
    id: '2',
    sku: 'AMP-001',
    partNumber: 'AMP-MULTI-ZONE-6CH',
    name: 'Multi-Zone Amplifier',
    description: '6-channel multi-zone amplifier with 100W per channel, ideal for distributed audio systems',
    manufacturer: 'SoundMaster',
    tags: ['amplifier', 'multi-zone', 'commercial', 'distributed audio'],
    category: 'Audio Equipment',
    vendor: 'SoundMaster Electronics',
    warehouseStock: 8,
    truckStock: 3,
    allocatedStock: 2,
    totalStock: 13,
    minStock: 5,
    maxStock: 25,
    cost: 299.99,
    sellingPrice: 499.99,
    status: 'Low Stock'
  },
  {
    id: '3',
    sku: 'CBL-001',
    partNumber: 'CBL-HDMI-50FT',
    name: 'HDMI Cable 50ft',
    description: 'Premium 50-foot HDMI cable with gold-plated connectors, supports 4K resolution',
    manufacturer: 'CablePro',
    tags: ['cable', 'hdmi', '4k', 'video'],
    category: 'Cables',
    vendor: 'CablePro Solutions',
    warehouseStock: 0,
    truckStock: 0,
    allocatedStock: 5,
    totalStock: 5,
    minStock: 20,
    maxStock: 100,
    cost: 19.99,
    sellingPrice: 39.99,
    status: 'Out of Stock'
  },
  {
    id: '4',
    sku: 'CTRL-001',
    partNumber: 'CTRL-UNIVERSAL-IR',
    name: 'Universal IR Controller',
    description: 'Programmable universal infrared remote control with learning capability',
    manufacturer: 'ControlTech',
    tags: ['remote', 'ir', 'universal', 'control'],
    category: 'Control Systems',
    vendor: 'ControlTech Industries',
    warehouseStock: 25,
    truckStock: 8,
    allocatedStock: 3,
    totalStock: 36,
    minStock: 15,
    maxStock: 50,
    cost: 45.99,
    sellingPrice: 79.99,
    status: 'In Stock'
  }
];

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventoryData] = useState<InventoryItem[]>(mockInventoryData);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'move' | 'adjust'>('add');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('');
  const [vendorFilter, setVendorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setManufacturerFilter('');
    setVendorFilter('');
    setStatusFilter('');
    setTagFilter([]);
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

  // Get unique values for filter dropdowns
  const categories = useMemo(() => Array.from(new Set(inventoryData.map(item => item.category))), [inventoryData]);
  const manufacturers = useMemo(() => Array.from(new Set(inventoryData.map(item => item.manufacturer))), [inventoryData]);
  const vendors = useMemo(() => Array.from(new Set(inventoryData.map(item => item.vendor))), [inventoryData]);
  const allTags = useMemo(() => {
    const tags = inventoryData.flatMap(item => item.tags);
    return Array.from(new Set(tags));
  }, [inventoryData]);

  // Filter inventory data
  const filteredInventory = useMemo(() => {
    return inventoryData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
      const matchesManufacturer = manufacturerFilter === '' || item.manufacturer === manufacturerFilter;
      const matchesVendor = vendorFilter === '' || item.vendor === vendorFilter;
      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      const matchesTags = tagFilter.length === 0 || 
        tagFilter.some(tag => item.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesManufacturer && matchesVendor && matchesStatus && matchesTags;
    });
  }, [inventoryData, searchTerm, categoryFilter, manufacturerFilter, vendorFilter, statusFilter, tagFilter]);

  const renderSearchAndFilters = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search part number, name, description, manufacturer, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            {(searchTerm || categoryFilter || manufacturerFilter || vendorFilter || statusFilter || tagFilter.length > 0) && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {showFilters && (
        <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Manufacturer</InputLabel>
                <Select
                  value={manufacturerFilter}
                  onChange={(e) => setManufacturerFilter(e.target.value)}
                  label="Manufacturer"
                >
                  <MenuItem value="">All Manufacturers</MenuItem>
                  {manufacturers.map(manufacturer => (
                    <MenuItem key={manufacturer} value={manufacturer}>{manufacturer}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  label="Vendor"
                >
                  <MenuItem value="">All Vendors</MenuItem>
                  {vendors.map(vendor => (
                    <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="In Stock">In Stock</MenuItem>
                  <MenuItem value="Low Stock">Low Stock</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                  <MenuItem value="Overstocked">Overstocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={tagFilter}
                  onChange={(e) => setTagFilter(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                  input={<OutlinedInput label="Tags" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {allTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      <Checkbox checked={tagFilter.indexOf(tag) > -1} />
                      <ListItemText primary={tag} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );

  const renderInventoryTable = () => (
    <Box>
      {renderSearchAndFilters()}
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredInventory.length} of {inventoryData.length} items
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120 }}>Part Number</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Name</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Manufacturer</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Tags</TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>Warehouse</TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>Trucks</TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>Allocated</TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>Total</TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>Cost</TableCell>
              <TableCell align="right" sx={{ minWidth: 100 }}>Selling Price</TableCell>
              <TableCell align="center" sx={{ minWidth: 60 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ minWidth: 120 }}>{item.partNumber}</TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {item.description.substring(0, 50)}...
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <Typography noWrap>{item.manufacturer}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                    {item.tags.length > 2 && (
                      <Chip label={`+${item.tags.length - 2}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 80 }}>{item.warehouseStock}</TableCell>
                <TableCell align="right" sx={{ minWidth: 80 }}>{item.truckStock}</TableCell>
                <TableCell align="right" sx={{ minWidth: 80 }}>{item.allocatedStock}</TableCell>
                <TableCell align="right" sx={{ minWidth: 80 }}>{item.totalStock}</TableCell>
                <TableCell align="right" sx={{ minWidth: 80 }}>${item.cost.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ minWidth: 100 }}>${item.sellingPrice.toFixed(2)}</TableCell>
                <TableCell align="center" sx={{ minWidth: 60 }}>
                  <IconButton onClick={handleMenuOpen} size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
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