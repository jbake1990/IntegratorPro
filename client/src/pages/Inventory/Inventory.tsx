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
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon
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

interface TruckInventory {
  itemId: string;
  partNumber: string;
  name: string;
  actualCount: number;
  buildToCount: number;
  manufacturer: string;
}

interface ServiceTruck {
  id: string;
  name: string;
  inventory: TruckInventory[];
}

interface KittedJob {
  id: string;
  customerName: string;
  jobNumber: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  quotes: Quote[];
  totalValue: number;
  createdAt: string;
}

interface Quote {
  id: string;
  name: string;
  parts: JobPart[];
  totalValue: number;
}

interface JobPart {
  itemId: string;
  partNumber: string;
  name: string;
  quantity: number;
  cost: number;
  manufacturer: string;
}

// KittedJob and JobAllocation interfaces will be implemented when job functionality is added

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

const mockTrucks: ServiceTruck[] = [
  {
    id: 'truck-1',
    name: 'Service Truck 1',
    inventory: [
      {
        itemId: '1',
        partNumber: 'SPK-8IN-CEILING',
        name: 'In-Ceiling Speaker 8"',
        actualCount: 5,
        buildToCount: 8,
        manufacturer: 'AudioTech Pro'
      },
      {
        itemId: '2',
        partNumber: 'AMP-MULTI-ZONE-6CH',
        name: 'Multi-Zone Amplifier',
        actualCount: 2,
        buildToCount: 3,
        manufacturer: 'SoundMaster'
      }
    ]
  },
  {
    id: 'truck-2',
    name: 'Service Truck 2',
    inventory: [
      {
        itemId: '1',
        partNumber: 'SPK-8IN-CEILING',
        name: 'In-Ceiling Speaker 8"',
        actualCount: 3,
        buildToCount: 6,
        manufacturer: 'AudioTech Pro'
      },
      {
        itemId: '4',
        partNumber: 'CTRL-UNIVERSAL-IR',
        name: 'Universal IR Controller',
        actualCount: 4,
        buildToCount: 5,
        manufacturer: 'ControlTech'
      }
    ]
  }
];

const mockJobs: KittedJob[] = [
  {
    id: 'job-1',
    customerName: 'ABC Corporation',
    jobNumber: 'JOB-2024-001',
    status: 'Active',
    quotes: [
      {
        id: 'quote-1',
        name: 'Main Building Audio System',
        parts: [
          {
            itemId: '1',
            partNumber: 'SPK-8IN-CEILING',
            name: 'In-Ceiling Speaker 8"',
            quantity: 12,
            cost: 89.99,
            manufacturer: 'AudioTech Pro'
          },
          {
            itemId: '2',
            partNumber: 'AMP-MULTI-ZONE-6CH',
            name: 'Multi-Zone Amplifier',
            quantity: 2,
            cost: 299.99,
            manufacturer: 'SoundMaster'
          }
        ],
        totalValue: 1879.86
      },
      {
        id: 'quote-2',
        name: 'Conference Room Control',
        parts: [
          {
            itemId: '4',
            partNumber: 'CTRL-UNIVERSAL-IR',
            name: 'Universal IR Controller',
            quantity: 3,
            cost: 45.99,
            manufacturer: 'ControlTech'
          }
        ],
        totalValue: 137.97
      }
    ],
    totalValue: 2017.83,
    createdAt: '2024-01-15'
  },
  {
    id: 'job-2',
    customerName: 'XYZ Industries',
    jobNumber: 'JOB-2024-002',
    status: 'Active',
    quotes: [
      {
        id: 'quote-3',
        name: 'Warehouse PA System',
        parts: [
          {
            itemId: '1',
            partNumber: 'SPK-8IN-CEILING',
            name: 'In-Ceiling Speaker 8"',
            quantity: 8,
            cost: 89.99,
            manufacturer: 'AudioTech Pro'
          }
        ],
        totalValue: 719.92
      }
    ],
    totalValue: 719.92,
    createdAt: '2024-01-20'
  }
];

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventoryData] = useState<InventoryItem[]>(mockInventoryData);
  const [trucks, setTrucks] = useState<ServiceTruck[]>(mockTrucks);
  const [jobs, setJobs] = useState<KittedJob[]>(mockJobs);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'move' | 'adjust' | 'addTruck' | 'editTruck' | 'truckSettings' | 'addJob' | 'jobSettings'>('add');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<ServiceTruck | null>(null);
  const [selectedJob, setSelectedJob] = useState<KittedJob | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [truckView, setTruckView] = useState<number>(0);
  const [addItemSearch, setAddItemSearch] = useState('');
  const [filteredAddItems, setFilteredAddItems] = useState<InventoryItem[]>([]);
  const [showAddItemResults, setShowAddItemResults] = useState(false);
  const [selectedAddItem, setSelectedAddItem] = useState<InventoryItem | null>(null);
  const [addItemBuildTo, setAddItemBuildTo] = useState<number>(1);
  
  // Truck settings state
  const [editingTruckName, setEditingTruckName] = useState('');
  const [editingBuildToCounts, setEditingBuildToCounts] = useState<{[key: string]: number}>({});
  
  // Add truck state
  const [newTruckName, setNewTruckName] = useState('');
  
  // Job settings state
  const [editingJobCustomerName, setEditingJobCustomerName] = useState('');
  const [editingJobStatus, setEditingJobStatus] = useState<'Active' | 'Completed' | 'Cancelled'>('Active');
  
  // Add job state
  const [newJobCustomerName, setNewJobCustomerName] = useState('');
  
  // Quote management state
  const [editingQuotes, setEditingQuotes] = useState<Quote[]>([]);
  const [newQuoteName, setNewQuoteName] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showAddQuoteDialog, setShowAddQuoteDialog] = useState(false);
  
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
    setTruckView(0);
  };

  const handleOpenDialog = (type: 'add' | 'edit' | 'move' | 'adjust' | 'addTruck' | 'editTruck' | 'truckSettings' | 'addJob' | 'jobSettings', item?: InventoryItem | null, truck?: ServiceTruck | null) => {
    setDialogType(type);
    setSelectedItem(item || null);
    setSelectedTruck(truck || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setSelectedTruck(null);
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

  const handleTruckClick = (truck: ServiceTruck) => {
    setSelectedTruck(truck);
    setTruckView(0);
  };



  const handleAddItemSearch = (searchTerm: string) => {
    setAddItemSearch(searchTerm);
    if (searchTerm.length < 2) {
      setFilteredAddItems([]);
      setShowAddItemResults(false);
      return;
    }

    const filtered = inventoryData.filter(item => 
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit to 10 results for performance

    setFilteredAddItems(filtered);
    setShowAddItemResults(true);
  };

  const handleSelectAddItem = (item: InventoryItem) => {
    setSelectedAddItem(item);
    setAddItemSearch(`${item.partNumber} - ${item.name}`);
    setShowAddItemResults(false);
  };

  const handleAddItemToTruck = () => {
    if (!selectedAddItem || !selectedTruck) return;
    
    // In a real app, this would update the truck inventory
    console.log('Adding item to truck:', selectedAddItem.partNumber, 'Build to:', addItemBuildTo);
    
    // Reset form
    setSelectedAddItem(null);
    setAddItemSearch('');
    setAddItemBuildTo(1);
  };

  const handleOpenTruckSettings = (truck: ServiceTruck) => {
    setSelectedTruck(truck);
    setEditingTruckName(truck.name);
    const buildToCounts: {[key: string]: number} = {};
    truck.inventory.forEach(item => {
      buildToCounts[item.itemId] = item.buildToCount;
    });
    setEditingBuildToCounts(buildToCounts);
    setOpenDialog(true);
    setDialogType('truckSettings');
  };

  const handleSaveTruckSettings = () => {
    if (!selectedTruck) return;

    // Update truck name
    const updatedTruck = {
      ...selectedTruck,
      name: editingTruckName,
      inventory: selectedTruck.inventory.map(item => ({
        ...item,
        buildToCount: editingBuildToCounts[item.itemId] || item.buildToCount
      }))
    };

    // Update trucks array
    setTrucks(prevTrucks => 
      prevTrucks.map(truck => 
        truck.id === selectedTruck.id ? updatedTruck : truck
      )
    );

    // Update selected truck if it's currently selected
    if (selectedTruck.id === selectedTruck?.id) {
      setSelectedTruck(updatedTruck);
    }

    handleCloseDialog();
  };

  const handleBuildToChange = (itemId: string, newValue: number) => {
    setEditingBuildToCounts(prev => ({
      ...prev,
      [itemId]: newValue
    }));
  };

  const handleAddTruck = () => {
    if (!newTruckName.trim()) return;

    const newTruck: ServiceTruck = {
      id: `truck-${Date.now()}`, // Generate unique ID
      name: newTruckName.trim(),
      inventory: []
    };

    // Add new truck to trucks array
    setTrucks(prevTrucks => [...prevTrucks, newTruck]);

    // Reset form
    setNewTruckName('');
    handleCloseDialog();
  };

  const handleOpenAddTruck = () => {
    setNewTruckName('');
    setOpenDialog(true);
    setDialogType('addTruck');
  };

  const handleAddJob = () => {
    if (!newJobCustomerName.trim()) return;

    const newJob: KittedJob = {
      id: `job-${Date.now()}`,
      customerName: newJobCustomerName.trim(),
      jobNumber: `JOB-${Date.now()}`,
      status: 'Active',
      quotes: [],
      totalValue: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setJobs(prevJobs => [...prevJobs, newJob]);
    setSelectedJob(newJob); // Select the new job
    setEditingJobCustomerName(newJob.customerName);
    setEditingJobStatus(newJob.status);
    setEditingQuotes([]);
    setOpenDialog(true);
    setDialogType('jobSettings');
    setNewJobCustomerName('');
  };

  const handleOpenAddJob = () => {
    setNewJobCustomerName('');
    setOpenDialog(true);
    setDialogType('addJob');
  };

  const handleJobClick = (job: KittedJob) => {
    setSelectedJob(job);
    setEditingJobCustomerName(job.customerName);
    setEditingJobStatus(job.status);
    setOpenDialog(true);
    setDialogType('jobSettings');
  };

  const handleSaveJobSettings = () => {
    if (!selectedJob) return;

    const updatedJob = {
      ...selectedJob,
      customerName: editingJobCustomerName,
      status: editingJobStatus
    };

    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === selectedJob.id ? updatedJob : job
      )
    );

    setSelectedJob(updatedJob);
    handleCloseDialog();
  };

  const handleAddQuote = () => {
    if (!newQuoteName.trim() || !selectedJob) return;

    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      name: newQuoteName.trim(),
      parts: [],
      totalValue: 0
    };

    const updatedJob = {
      ...selectedJob,
      quotes: [...selectedJob.quotes, newQuote]
    };

    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === selectedJob.id ? updatedJob : job
      )
    );

    setSelectedJob(updatedJob);
    setNewQuoteName('');
    setShowAddQuoteDialog(false);
  };

  const handleRemoveQuote = (quoteId: string) => {
    if (!selectedJob) return;

    const updatedJob = {
      ...selectedJob,
      quotes: selectedJob.quotes.filter(quote => quote.id !== quoteId)
    };

    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === selectedJob.id ? updatedJob : job
      )
    );

    setSelectedJob(updatedJob);
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

  const renderTruckList = () => (
    <Grid container spacing={3}>
      {trucks.map((truck) => (
        <Grid item xs={12} md={6} lg={4} key={truck.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { boxShadow: 3 }
            }}
            onClick={() => handleTruckClick(truck)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="div">
                  {truck.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenTruckSettings(truck);
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Items: {truck.inventory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Below Build-to: {truck.inventory.filter(item => item.actualCount < item.buildToCount).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderJobList = () => (
    <Grid container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} md={6} lg={4} key={job.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { boxShadow: 3 }
            }}
            onClick={() => handleJobClick(job)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" component="div">
                    {job.customerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.jobNumber}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJobClick(job);
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quotes: {job.quotes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Value: ${job.totalValue.toFixed(2)}
              </Typography>
              <Chip 
                label={job.status} 
                size="small"
                color={job.status === 'Active' ? 'primary' : job.status === 'Completed' ? 'success' : 'error'}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );


  const renderStockMovement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={truckView} onChange={(event, newValue) => setTruckView(newValue)} sx={{ mb: 3 }}>
          <Tab label="Service Trucks" />
          <Tab label="Kitted Jobs" />
        </Tabs>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={truckView === 0 ? handleOpenAddTruck : handleOpenAddJob}
        >
          {truckView === 0 ? 'Add Truck' : 'Add Job'}
        </Button>
      </Box>

      {truckView === 0 ? renderTruckList() : renderJobList()}
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

  const renderTruckSettingsDialog = () => {
    if (!selectedTruck) return null;

    return (
      <Dialog open={openDialog && dialogType === 'truckSettings'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Truck Settings - {selectedTruck.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Truck Information
              </Typography>
              <TextField
                fullWidth
                label="Truck Name"
                value={editingTruckName}
                margin="normal"
                onChange={(e) => setEditingTruckName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Inventory Summary
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Total Items: {selectedTruck.inventory.length}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Items Below Build-to: {selectedTruck.inventory.filter(item => item.actualCount < item.buildToCount).length}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Items at Build-to: {selectedTruck.inventory.filter(item => item.actualCount === item.buildToCount).length}
                </Typography>
                <Typography variant="body2">
                  Items Above Build-to: {selectedTruck.inventory.filter(item => item.actualCount > item.buildToCount).length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Inventory & Build-to Numbers
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Part Number</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Manufacturer</TableCell>
                      <TableCell align="right">Actual Count</TableCell>
                      <TableCell align="right">Build To</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTruck.inventory.map((item) => (
                      <TableRow key={item.itemId}>
                        <TableCell>{item.partNumber}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.manufacturer}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {item.actualCount}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={editingBuildToCounts[item.itemId] || item.buildToCount}
                            sx={{ width: 80 }}
                            inputProps={{ min: 0 }}
                            onChange={(e) => handleBuildToChange(item.itemId, Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="h6">
                  Add Item to Truck
                </Typography>
                <TextField
                  placeholder="Search part number or name..."
                  size="small"
                  sx={{ minWidth: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={addItemSearch}
                  onChange={(e) => handleAddItemSearch(e.target.value)}
                />
                {showAddItemResults && (
                  <Box sx={{ mt: 1, maxHeight: 200, overflowY: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    {filteredAddItems.length > 0 ? (
                      filteredAddItems.map((item) => (
                        <MenuItem
                          key={item.id}
                          onClick={() => handleSelectAddItem(item)}
                          sx={{ p: 1, cursor: 'pointer' }}
                        >
                          <Typography variant="body2" fontWeight="medium">{item.partNumber} - {item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.manufacturer}</Typography>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled sx={{ p: 1 }}>No items found</MenuItem>
                    )}
                  </Box>
                )}
                <TextField
                  type="number"
                  label="Build To"
                  size="small"
                  sx={{ width: 100 }}
                  inputProps={{ min: 0 }}
                  value={addItemBuildTo}
                  onChange={(e) => setAddItemBuildTo(Number(e.target.value))}
                />
                <Button variant="contained" size="small" onClick={handleAddItemToTruck}>
                  Add Item
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTruckSettings}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddTruckDialog = () => (
    <Dialog open={openDialog && dialogType === 'addTruck'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Service Truck</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Truck Name"
              placeholder="e.g., Service Truck 3"
              value={newTruckName}
              onChange={(e) => setNewTruckName(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button variant="contained" onClick={handleAddTruck}>
          Add Truck
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditTruckDialog = () => {
    if (!selectedTruck) return null;

    return (
      <Dialog open={openDialog && dialogType === 'editTruck'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Service Truck</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Truck Name"
                defaultValue={selectedTruck.name}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddJobDialog = () => (
    <Dialog open={openDialog && dialogType === 'addJob'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Kitted Job</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Customer Name"
          value={newJobCustomerName}
          margin="normal"
          onChange={(e) => setNewJobCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleAddJob} variant="contained">Add Job</Button>
      </DialogActions>
    </Dialog>
  );

  const renderJobSettingsDialog = () => {
    if (!selectedJob) return null;

    return (
      <Dialog open={openDialog && dialogType === 'jobSettings'} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Job Settings - {selectedJob.customerName}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Job Information
              </Typography>
              <TextField
                fullWidth
                label="Customer Name"
                value={editingJobCustomerName}
                margin="normal"
                onChange={(e) => setEditingJobCustomerName(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingJobStatus}
                  onChange={(e) => setEditingJobStatus(e.target.value as 'Active' | 'Completed' | 'Cancelled')}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Job Summary
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Total Quotes: {selectedJob.quotes.length}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Total Value: ${selectedJob.totalValue.toFixed(2)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Created: {selectedJob.createdAt}
                </Typography>
                <Typography variant="body2">
                  Status: {selectedJob.status}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Quotes & Parts
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddQuoteDialog(true)}
                >
                  Add Quote
                </Button>
              </Box>
              {selectedJob.quotes.map((quote) => (
                <Card key={quote.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {quote.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Value: ${quote.totalValue.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Parts: {quote.parts.length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setSelectedQuote(quote);
                            // TODO: Open quote edit dialog
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<ReceiptIcon />}
                          onClick={() => {
                            // TODO: Send to billing
                            console.log('Send quote to billing:', quote.id);
                          }}
                        >
                          Send to Billing
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveQuote(quote.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Part Number</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quote.parts.map((part) => (
                            <TableRow key={part.itemId}>
                              <TableCell>{part.partNumber}</TableCell>
                              <TableCell>{part.name}</TableCell>
                              <TableCell align="right">{part.quantity}</TableCell>
                              <TableCell align="right">${part.cost.toFixed(2)}</TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    title="Add to Warehouse"
                                    onClick={() => {
                                      // TODO: Add part to warehouse
                                      console.log('Add to warehouse:', part.partNumber);
                                    }}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="secondary"
                                    title="Add to Truck"
                                    onClick={() => {
                                      // TODO: Add part to truck
                                      console.log('Add to truck:', part.partNumber);
                                    }}
                                  >
                                    <TruckIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    title="Remove Part"
                                    onClick={() => {
                                      // TODO: Remove part from quote
                                      console.log('Remove part:', part.partNumber);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveJobSettings} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddQuoteDialog = () => (
    <Dialog open={showAddQuoteDialog} onClose={() => setShowAddQuoteDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Quote</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Quote Name"
          value={newQuoteName}
          margin="normal"
          onChange={(e) => setNewQuoteName(e.target.value)}
          placeholder="Enter quote name"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAddQuoteDialog(false)}>Cancel</Button>
        <Button onClick={handleAddQuote} variant="contained">Add Quote</Button>
      </DialogActions>
    </Dialog>
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
      <Dialog open={openDialog && ['add', 'edit', 'move', 'adjust'].includes(dialogType)} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
      {renderTruckSettingsDialog()}
      {renderAddTruckDialog()}
      {renderEditTruckDialog()}
      {renderAddJobDialog()}
      {renderJobSettingsDialog()}
      {renderAddQuoteDialog()}
    </Box>
  );
};

export default Inventory; 