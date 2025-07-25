import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  ListItemText,
  Divider
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
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
  billedToInvoice?: string;
}

interface POItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  items: POItem[];
  totalAmount: number;
  notes: string;
}

interface ReceivedOrder {
  id: string;
  poNumber: string;
  vendor: string;
  receiveDate: string;
  receivedBy: string;
  totalAmount: number;
  status: 'partial' | 'complete';
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData);
  const [trucks, setTrucks] = useState<ServiceTruck[]>(mockTrucks);
  const [jobs, setJobs] = useState<KittedJob[]>(mockJobs);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'move' | 'adjust' | 'addTruck' | 'editTruck' | 'truckSettings' | 'addJob' | 'jobSettings' | 'createPO' | 'editPO' | 'receivePO'>('add');
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
  const [newQuoteName, setNewQuoteName] = useState('');
  const [showAddQuoteDialog, setShowAddQuoteDialog] = useState(false);

  // Purchase Order state
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      poNumber: 'PO-001',
      vendor: 'ABC Suppliers',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-25',
      status: 'sent',
      items: [
        {
          id: '1',
          partNumber: 'ABC-123',
          description: 'Hydraulic Pump',
          quantity: 5,
          unitCost: 150.00,
          totalCost: 750.00
        },
        {
          id: '2',
          partNumber: 'XYZ-456',
          description: 'Control Valve',
          quantity: 10,
          unitCost: 75.50,
          totalCost: 755.00
        }
      ],
      totalAmount: 1505.00,
      notes: 'Priority order for urgent repairs'
    },
    {
      id: '2',
      poNumber: 'PO-002',
      vendor: 'Tech Parts Inc',
      orderDate: '2024-01-20',
      expectedDelivery: '2024-02-05',
      status: 'draft',
      items: [
        {
          id: '3',
          partNumber: 'DEF-789',
          description: 'Electrical Components',
          quantity: 20,
          unitCost: 25.00,
          totalCost: 500.00
        }
      ],
      totalAmount: 500.00,
      notes: 'Standard maintenance parts'
    },
    {
      id: '3',
      poNumber: 'PO-003',
      vendor: 'Industrial Supply Co',
      orderDate: '2024-01-22',
      expectedDelivery: '2024-02-10',
      status: 'sent',
      items: [
        {
          id: '4',
          partNumber: 'ISC-999',
          description: 'Motor Assembly',
          quantity: 2,
          unitCost: 450.00,
          totalCost: 900.00
        }
      ],
      totalAmount: 900.00,
      notes: 'Replacement for damaged motor'
    }
  ]);

  const [recentOrders] = useState<ReceivedOrder[]>([
    {
      id: '1',
      poNumber: 'PO-005',
      vendor: 'ABC Suppliers',
      receiveDate: '2024-01-20',
      receivedBy: 'John Smith',
      totalAmount: 2200.00,
      status: 'complete'
    },
    {
      id: '2',
      poNumber: 'PO-004',
      vendor: 'Tech Parts Inc',
      receiveDate: '2024-01-18',
      receivedBy: 'Jane Doe',
      totalAmount: 850.00,
      status: 'partial'
    },
    {
      id: '3',
      poNumber: 'PO-006',
      vendor: 'Industrial Supply Co',
      receiveDate: '2024-01-15',
      receivedBy: 'Mike Johnson',
      totalAmount: 1200.00,
      status: 'complete'
    }
  ]);

  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [isEditingPO, setIsEditingPO] = useState(false);

  // PO Item search state
  const [poItemSearch, setPOItemSearch] = useState('');
  const [filteredPOItems, setFilteredPOItems] = useState<InventoryItem[]>([]);
  const [showPOItemResults, setShowPOItemResults] = useState(false);
  const [selectedPOItem, setSelectedPOItem] = useState<InventoryItem | null>(null);
  const [showCreateNewItem, setShowCreateNewItem] = useState(false);
  const [newItemData, setNewItemData] = useState({
    partNumber: '',
    name: '',
    description: '',
    manufacturer: '',
    vendor: '',
    cost: 0
  });

  // Receiving state
  const [receivingQuantities, setReceivingQuantities] = useState<{[itemId: string]: number}>({});

  // PO Search and Details Modal state
  const [poSearchTerm, setPOSearchTerm] = useState('');
  const [showPODetails, setShowPODetails] = useState(false);
  const [selectedPOForDetails, setSelectedPOForDetails] = useState<PurchaseOrder | null>(null);
  const [filteredSearchPOs, setFilteredSearchPOs] = useState<PurchaseOrder[]>([]);
  const [showPOSearchResults, setShowPOSearchResults] = useState(false);

  // Inventory Actions state
  const [editFormData, setEditFormData] = useState<Partial<InventoryItem>>({});
  const [moveStockData, setMoveStockData] = useState({
    fromLocation: '',
    toLocation: '',
    quantity: 0
  });
  const [adjustCountData, setAdjustCountData] = useState({
    newCount: 0,
    reason: '',
    adminPassword: ''
  });
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<'adjust' | 'delete' | null>(null);
  

  
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: InventoryItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
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

  const handlePartQuantityChange = (quoteId: string, partId: string, newQuantity: number) => {
    if (!selectedJob || newQuantity < 0) return;

    // Find the part to get the old quantity
    const quote = selectedJob.quotes.find(q => q.id === quoteId);
    const part = quote?.parts.find(p => p.itemId === partId);
    const oldQuantity = part?.quantity || 0;
    const quantityDifference = newQuantity - oldQuantity;

    // Calculate total allocated stock for this part across all jobs
    const totalAllocatedForPart = jobs.reduce((total, job) => {
      const jobAllocated = job.quotes.reduce((jobTotal, quote) => {
        const partInQuote = quote.parts.find(p => p.partNumber === part?.partNumber);
        return jobTotal + (partInQuote?.quantity || 0);
      }, 0);
      return total + jobAllocated;
    }, 0);

    // Update inventory data to reflect the total allocated stock
    const updatedInventoryData = inventoryData.map(inv => {
      if (inv.partNumber === part?.partNumber) {
        return {
          ...inv,
          allocatedStock: totalAllocatedForPart,
          warehouseStock: inv.warehouseStock - quantityDifference
        };
      }
      return inv;
    });

    // Update the job with new quantities
    const updatedJob = {
      ...selectedJob,
      quotes: selectedJob.quotes.map(quote => {
        if (quote.id === quoteId) {
          return {
            ...quote,
            parts: quote.parts.map(part => {
              if (part.itemId === partId) {
                return {
                  ...part,
                  quantity: newQuantity
                };
              }
              return part;
            })
          };
        }
        return quote;
      })
    };

    // Recalculate total value for the quote
    updatedJob.quotes = updatedJob.quotes.map(quote => {
      if (quote.id === quoteId) {
        const totalValue = quote.parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);
        return { ...quote, totalValue };
      }
      return quote;
    });

    // Recalculate total job value
    updatedJob.totalValue = updatedJob.quotes.reduce((sum, quote) => sum + quote.totalValue, 0);

    // Update jobs state
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === selectedJob.id ? updatedJob : job
      )
    );

    // Update inventory data state
    setInventoryData(updatedInventoryData);

    setSelectedJob(updatedJob);
  };

  const handleRemovePart = (quoteId: string, partId: string) => {
    if (!selectedJob) return;

    // Find the part to get the quantity being removed
    const quote = selectedJob.quotes.find(q => q.id === quoteId);
    const part = quote?.parts.find(p => p.itemId === partId);
    const quantityToRemove = part?.quantity || 0;

    // Calculate total allocated stock for this part across all jobs (excluding the part being removed)
    const totalAllocatedForPart = jobs.reduce((total, job) => {
      const jobAllocated = job.quotes.reduce((jobTotal, quote) => {
        const partInQuote = quote.parts.find(p => p.partNumber === part?.partNumber);
        return jobTotal + (partInQuote?.quantity || 0);
      }, 0);
      return total + jobAllocated;
    }, 0) - quantityToRemove; // Subtract the quantity being removed

    // Update inventory data to reflect the total allocated stock
    const updatedInventoryData = inventoryData.map(inv => {
      if (inv.partNumber === part?.partNumber) {
        return {
          ...inv,
          allocatedStock: totalAllocatedForPart,
          warehouseStock: inv.warehouseStock + quantityToRemove
        };
      }
      return inv;
    });

    // Update the job by removing the part
    const updatedJob = {
      ...selectedJob,
      quotes: selectedJob.quotes.map(quote => {
        if (quote.id === quoteId) {
          return {
            ...quote,
            parts: quote.parts.filter(part => part.itemId !== partId)
          };
        }
        return quote;
      })
    };

    // Recalculate total value for the quote
    updatedJob.quotes = updatedJob.quotes.map(quote => {
      if (quote.id === quoteId) {
        const totalValue = quote.parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);
        return { ...quote, totalValue };
      }
      return quote;
    });

    // Recalculate total job value
    updatedJob.totalValue = updatedJob.quotes.reduce((sum, quote) => sum + quote.totalValue, 0);

    // Update jobs state
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === selectedJob.id ? updatedJob : job
      )
    );

    // Update inventory data state
    setInventoryData(updatedInventoryData);

    setSelectedJob(updatedJob);
  };



  const getWarehouseStockForPart = (partNumber: string) => {
    const inventoryItem = inventoryData.find(item => item.partNumber === partNumber);
    return inventoryItem ? inventoryItem.warehouseStock : 0;
  };

  const calculateAndUpdateAllocatedStock = useCallback(() => {
    const updatedInventoryData = inventoryData.map(inv => {
      // Calculate total allocated stock for this part across all jobs
      const totalAllocated = jobs.reduce((total, job) => {
        const jobAllocated = job.quotes.reduce((jobTotal, quote) => {
          const partInQuote = quote.parts.find(p => p.partNumber === inv.partNumber);
          return jobTotal + (partInQuote?.quantity || 0);
        }, 0);
        return total + jobAllocated;
      }, 0);

      return {
        ...inv,
        allocatedStock: totalAllocated
      };
    });

    setInventoryData(updatedInventoryData);
  }, [jobs, inventoryData]);

  // Initialize allocated stock when component mounts
  useEffect(() => {
    calculateAndUpdateAllocatedStock();
  }, [calculateAndUpdateAllocatedStock]);

  const handleSendToBilling = (quote: Quote) => {
    if (!selectedJob) return;

    // Create invoice from quote data
    const invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      customerName: selectedJob.customerName,
      jobNumber: selectedJob.jobNumber,
      amount: quote.totalValue,
      status: 'Draft' as const,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      createdAt: new Date().toISOString().split('T')[0],
      items: quote.parts.map(part => ({
        id: part.itemId,
        partNumber: part.partNumber,
        name: part.name,
        quantity: part.quantity,
        unitPrice: part.cost,
        totalPrice: part.cost * part.quantity,
        type: 'part' as const
      })),
      notes: `Generated from kitted job quote: ${quote.name}`,
      quoteName: quote.name,
      quoteId: quote.id
    };

    // Save to localStorage for billing system to pick up
    try {
      const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const updatedInvoices = [...existingInvoices, invoice];
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

      // Dispatch custom event to notify billing page
      window.dispatchEvent(new CustomEvent('newInvoice', { detail: invoice }));

      // Mark the job as completed/billed by updating its status
      const updatedJob = {
        ...selectedJob,
        status: 'Completed' as const,
        quotes: selectedJob.quotes.map(q => 
          q.id === quote.id ? { ...q, billedToInvoice: invoice.invoiceNumber } : q
        )
      };

      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === selectedJob.id ? updatedJob : job
        )
      );

      setSelectedJob(updatedJob);

      alert(`Quote "${quote.name}" successfully sent to billing!\n\nInvoice ${invoice.invoiceNumber} created in draft status.\nTotal: $${quote.totalValue.toFixed(2)}\nItems: ${quote.parts.length}\n\nJob ${selectedJob.jobNumber} marked as completed.\nYou can view and edit the invoice in the Billing section.`);
      
      console.log('Invoice created and sent to billing:', invoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice. Please try again.');
    }
  };

  const handleEditQuote = (quote: Quote) => {
    // TODO: Open quote edit dialog for adding parts
    console.log('Edit quote:', quote.id);
  };

  // Purchase Order handlers
  const getNextPONumber = () => {
    const lastPO = purchaseOrders
      .map(po => parseInt(po.poNumber.replace('PO-', '')))
      .sort((a, b) => b - a)[0] || 0;
    return `PO-${String(lastPO + 1).padStart(3, '0')}`;
  };

  const handleCreatePO = () => {
    const newPO: PurchaseOrder = {
      id: Date.now().toString(),
      poNumber: getNextPONumber(),
      vendor: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: '',
      status: 'draft',
      items: [],
      totalAmount: 0,
      notes: ''
    };
    setEditingPO(newPO);
    setIsEditingPO(false);
    setDialogType('createPO');
    setOpenDialog(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO({ ...po });
    setIsEditingPO(true);
    setDialogType('editPO');
    setOpenDialog(true);
  };

  const handleReceivePO = (po: PurchaseOrder) => {
    setEditingPO({ ...po });
    handleInitializeReceiving(po);
    setDialogType('receivePO');
    setOpenDialog(true);
  };

  const handleSavePO = () => {
    if (!editingPO) return;

    if (isEditingPO) {
      setPurchaseOrders(prev => 
        prev.map(po => po.id === editingPO.id ? editingPO : po)
      );
    } else {
      setPurchaseOrders(prev => [...prev, editingPO]);
    }

    setOpenDialog(false);
    setEditingPO(null);
    setIsEditingPO(false);
  };

  const handleDeletePO = (poId: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
  };

  // Note: handleAddPOItem removed - now using search interface directly

  const handleUpdatePOItem = (itemId: string, field: keyof POItem, value: any) => {
    if (!editingPO) return;

    const updatedItems = editingPO.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
        }
        return updatedItem;
      }
      return item;
    });

    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalCost, 0);

    setEditingPO({
      ...editingPO,
      items: updatedItems,
      totalAmount
    });
  };

  const handleRemovePOItem = (itemId: string) => {
    if (!editingPO) return;

    const updatedItems = editingPO.items.filter(item => item.id !== itemId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalCost, 0);

    setEditingPO({
      ...editingPO,
      items: updatedItems,
      totalAmount
    });
  };

  // Removed handleMarkAsReceived - replaced with handleProcessReceiving

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'primary';
      case 'received': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Get open purchase orders (draft or sent status)
  const openPOs = useMemo(() => {
    return purchaseOrders.filter(po => po.status === 'draft' || po.status === 'sent');
  }, [purchaseOrders]);

  // Get recent 10 received orders
  const recentReceivedOrders = useMemo(() => {
    return recentOrders.slice(0, 10);
  }, [recentOrders]);

  // PO Item search handlers
  const handlePOItemSearch = (searchTerm: string) => {
    setPOItemSearch(searchTerm);
    if (searchTerm.length < 2) {
      setFilteredPOItems([]);
      setShowPOItemResults(false);
      return;
    }

    const filtered = inventoryData.filter(item => 
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    setFilteredPOItems(filtered);
    setShowPOItemResults(true);
  };

  const handleSelectPOItem = (item: InventoryItem) => {
    setSelectedPOItem(item);
    setPOItemSearch(`${item.partNumber} - ${item.name}`);
    setShowPOItemResults(false);
  };

  const handleAddSelectedItemToPO = () => {
    if (!selectedPOItem || !editingPO) return;

    const newPOItem: POItem = {
      id: Date.now().toString(),
      partNumber: selectedPOItem.partNumber,
      description: selectedPOItem.name,
      quantity: 1,
      unitCost: selectedPOItem.cost,
      totalCost: selectedPOItem.cost
    };

    setEditingPO({
      ...editingPO,
      items: [...editingPO.items, newPOItem],
      totalAmount: editingPO.totalAmount + newPOItem.totalCost
    });

    // Reset search
    setSelectedPOItem(null);
    setPOItemSearch('');
    setShowPOItemResults(false);
  };

  const handleCreateNewInventoryItem = () => {
    if (!newItemData.partNumber || !newItemData.name || !editingPO) return;

    // Create new inventory item
    const newInventoryItem: InventoryItem = {
      id: Date.now().toString(),
      sku: `SKU-${Date.now()}`,
      partNumber: newItemData.partNumber,
      name: newItemData.name,
      description: newItemData.description,
      manufacturer: newItemData.manufacturer,
      tags: [],
      category: 'General',
      vendor: newItemData.vendor,
      warehouseStock: 0,
      truckStock: 0,
      allocatedStock: 0,
      totalStock: 0,
      minStock: 0,
      maxStock: 0,
      cost: newItemData.cost,
      sellingPrice: newItemData.cost * 1.5, // 50% markup
      status: 'Out of Stock'
    };

    // Add to inventory
    setInventoryData(prev => [...prev, newInventoryItem]);

    // Create PO item
    const newPOItem: POItem = {
      id: Date.now().toString(),
      partNumber: newItemData.partNumber,
      description: newItemData.name,
      quantity: 1,
      unitCost: newItemData.cost,
      totalCost: newItemData.cost
    };

    setEditingPO({
      ...editingPO,
      items: [...editingPO.items, newPOItem],
      totalAmount: editingPO.totalAmount + newPOItem.totalCost
    });

    // Reset form
    setNewItemData({
      partNumber: '',
      name: '',
      description: '',
      manufacturer: '',
      vendor: '',
      cost: 0
    });
    setShowCreateNewItem(false);
    setPOItemSearch('');
  };

  const handleInitializeReceiving = (po: PurchaseOrder) => {
    const quantities: {[itemId: string]: number} = {};
    po.items.forEach(item => {
      quantities[item.id] = 0; // Start with 0 received
    });
    setReceivingQuantities(quantities);
    console.log('Initialized receiving quantities for PO:', po.poNumber, quantities);
  };

  const handleReceivingQuantityChange = (itemId: string, quantity: number) => {
    setReceivingQuantities(prev => {
      const updated = {
        ...prev,
        [itemId]: quantity
      };
      console.log('Updated receiving quantities:', updated);
      return updated;
    });
  };

  const handleProcessReceiving = () => {
    if (!editingPO) return;
    
    console.log('Processing receiving for PO:', editingPO.poNumber);
    console.log('Receiving quantities:', receivingQuantities);
    
    // Start with current inventory data
    let updatedInventoryData = [...inventoryData];
    const newInventoryItems: InventoryItem[] = [];
    
    // Process each PO item
    editingPO.items.forEach(poItem => {
      const receivedQty = receivingQuantities[poItem.id] || 0;
      console.log(`Processing ${poItem.partNumber}: received ${receivedQty} of ${poItem.quantity}`);
      
      if (receivedQty > 0) {
        // Find existing inventory item
        const existingItemIndex = updatedInventoryData.findIndex(
          invItem => invItem.partNumber === poItem.partNumber
        );
        
        if (existingItemIndex >= 0) {
          // Update existing inventory item
          const existingItem = updatedInventoryData[existingItemIndex];
          const newWarehouseStock = existingItem.warehouseStock + receivedQty;
          const newTotalStock = existingItem.totalStock + receivedQty;
          
          updatedInventoryData[existingItemIndex] = {
            ...existingItem,
            warehouseStock: newWarehouseStock,
            totalStock: newTotalStock,
            status: newWarehouseStock > existingItem.minStock ? 'In Stock' as const : 'Low Stock' as const
          };
          
          console.log(`Updated existing item ${poItem.partNumber}: +${receivedQty} stock`);
        } else {
          // Create new inventory item for items that don't exist
          const newInventoryItem: InventoryItem = {
            id: `inv-${Date.now()}-${Math.random()}`,
            sku: `SKU-${poItem.partNumber}`,
            partNumber: poItem.partNumber,
            name: poItem.description,
            description: poItem.description,
            manufacturer: 'Unknown', // Could be enhanced to capture this from PO
            tags: [],
            category: 'General',
            vendor: editingPO.vendor,
            warehouseStock: receivedQty,
            truckStock: 0,
            allocatedStock: 0,
            totalStock: receivedQty,
            minStock: 5, // Default minimum
            maxStock: 100, // Default maximum
            cost: poItem.unitCost,
            sellingPrice: poItem.unitCost * 1.5, // 50% markup
            status: receivedQty > 5 ? 'In Stock' as const : 'Low Stock' as const
          };
          
          newInventoryItems.push(newInventoryItem);
          console.log(`Created new inventory item: ${poItem.partNumber} with ${receivedQty} stock`);
        }
      }
    });
    
    // Add new items to inventory
    if (newInventoryItems.length > 0) {
      updatedInventoryData = [...updatedInventoryData, ...newInventoryItems];
      console.log(`Added ${newInventoryItems.length} new inventory items`);
    }
    
    // Update inventory state
    setInventoryData(updatedInventoryData);
    
    // Determine if PO is fully received
    const isFullyReceived = editingPO.items.every(item => {
      const receivedQty = receivingQuantities[item.id] || 0;
      const isComplete = receivedQty >= item.quantity;
      console.log(`Item ${item.partNumber}: received ${receivedQty}/${item.quantity} = ${isComplete ? 'COMPLETE' : 'PARTIAL'}`);
      return isComplete;
    });
    
    console.log('PO fully received?', isFullyReceived);
    
    // Update PO status
    const newStatus = isFullyReceived ? 'received' : editingPO.status;
    console.log('New PO status:', newStatus);
    
    const updatedPO = {
      ...editingPO,
      status: newStatus
    };

    setPurchaseOrders(prev => {
      const updated = prev.map(po => po.id === editingPO.id ? updatedPO : po);
      console.log('Updated PO list:', updated.map(p => ({ number: p.poNumber, status: p.status })));
      return updated;
    });

    // Close dialog and reset state
    setOpenDialog(false);
    setEditingPO(null);
    setReceivingQuantities({});
    
    console.log('Receiving process completed');
  };

  // PO Search and Details handlers
  const handlePOSearch = (searchTerm: string) => {
    setPOSearchTerm(searchTerm);
    if (searchTerm.length < 2) {
      setFilteredSearchPOs([]);
      setShowPOSearchResults(false);
      return;
    }

    // Search all purchase orders (including received ones)
    const allPOs = [...purchaseOrders]; // In real app, this would include historical POs
    const filtered = allPOs.filter(po => 
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    setFilteredSearchPOs(filtered);
    setShowPOSearchResults(true);
  };

  const handleShowPODetails = (po: PurchaseOrder) => {
    setSelectedPOForDetails(po);
    setShowPODetails(true);
    setShowPOSearchResults(false);
    setPOSearchTerm('');
  };

  const handleClosePODetails = () => {
    setShowPODetails(false);
    setSelectedPOForDetails(null);
  };

  // Inventory Action Handlers
  const isAdmin = () => {
    return user?.role?.toUpperCase() === 'ADMIN';
  };

  const handleEditItem = () => {
    if (!selectedItem) return;
    setEditFormData({ ...selectedItem });
    setDialogType('edit');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleMoveStock = () => {
    if (!selectedItem) return;
    setMoveStockData({
      fromLocation: 'warehouse',
      toLocation: '',
      quantity: 0
    });
    setDialogType('move');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleAdjustCount = () => {
    if (!selectedItem) return;
    if (!isAdmin()) {
      setPendingAction('adjust');
      setShowAdminAuth(true);
      handleMenuClose();
      return;
    }
    setAdjustCountData({
      newCount: selectedItem.warehouseStock,
      reason: '',
      adminPassword: ''
    });
    setDialogType('adjust');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    if (!isAdmin()) {
      setPendingAction('delete');
      setShowAdminAuth(true);
      handleMenuClose();
      return;
    }
    // For admin users, show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${selectedItem.name}" (${selectedItem.partNumber})? This action cannot be undone.`)) {
      setInventoryData(prev => prev.filter(item => item.id !== selectedItem.id));
      handleMenuClose();
    }
  };

  const handleAdminAuth = () => {
    // Simple password check for demo - in production, this would be a proper API call
    if (adminPassword === 'admin123') {
      setShowAdminAuth(false);
      setAdminPassword('');
      
      if (pendingAction === 'adjust') {
        setAdjustCountData({
          newCount: selectedItem?.warehouseStock || 0,
          reason: '',
          adminPassword: ''
        });
        setDialogType('adjust');
        setOpenDialog(true);
      } else if (pendingAction === 'delete') {
        if (window.confirm(`Are you sure you want to delete "${selectedItem?.name}" (${selectedItem?.partNumber})? This action cannot be undone.`)) {
          setInventoryData(prev => prev.filter(item => item.id !== selectedItem?.id));
        }
      }
      setPendingAction(null);
    } else {
      alert('Invalid admin password');
    }
  };

  const handleSaveEdit = () => {
    if (!selectedItem || !editFormData) return;
    
    setInventoryData(prev => 
      prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              ...editFormData,
              status: calculateItemStatus({ ...item, ...editFormData } as InventoryItem)
            }
          : item
      )
    );
    setOpenDialog(false);
    setSelectedItem(null);
    setEditFormData({});
  };

  const handleSaveMoveStock = () => {
    if (!selectedItem || !moveStockData.toLocation || moveStockData.quantity <= 0) return;
    
    const updatedItem = { ...selectedItem };
    
    // Move stock logic
    if (moveStockData.fromLocation === 'warehouse' && moveStockData.toLocation === 'trucks') {
      updatedItem.warehouseStock -= moveStockData.quantity;
      updatedItem.truckStock += moveStockData.quantity;
    } else if (moveStockData.fromLocation === 'trucks' && moveStockData.toLocation === 'warehouse') {
      updatedItem.truckStock -= moveStockData.quantity;
      updatedItem.warehouseStock += moveStockData.quantity;
    }
    
    updatedItem.totalStock = updatedItem.warehouseStock + updatedItem.truckStock;
    updatedItem.status = calculateItemStatus(updatedItem);
    
    setInventoryData(prev => 
      prev.map(item => item.id === selectedItem.id ? updatedItem : item)
    );
    
    setOpenDialog(false);
    setSelectedItem(null);
    setMoveStockData({ fromLocation: '', toLocation: '', quantity: 0 });
  };

  const handleSaveAdjustCount = () => {
    if (!selectedItem || !adjustCountData.reason) return;
    
    const updatedItem = {
      ...selectedItem,
      warehouseStock: adjustCountData.newCount,
      totalStock: adjustCountData.newCount + selectedItem.truckStock
    };
    updatedItem.status = calculateItemStatus(updatedItem);
    
    setInventoryData(prev => 
      prev.map(item => item.id === selectedItem.id ? updatedItem : item)
    );
    
    // Log the adjustment for audit trail (in production, this would go to a database)
    console.log('Stock adjustment:', {
      item: selectedItem.partNumber,
      oldCount: selectedItem.warehouseStock,
      newCount: adjustCountData.newCount,
      reason: adjustCountData.reason,
      user: user?.username,
      timestamp: new Date().toISOString()
    });
    
    setOpenDialog(false);
    setSelectedItem(null);
    setAdjustCountData({ newCount: 0, reason: '', adminPassword: '' });
  };

  // Helper function to calculate item status based on stock levels
  const calculateItemStatus = (item: InventoryItem): 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked' => {
    const totalStock = item.warehouseStock + item.truckStock;
    if (totalStock === 0) return 'Out of Stock';
    if (totalStock <= item.minStock) return 'Low Stock';
    if (totalStock >= item.maxStock && item.maxStock > 0) return 'Overstocked';
    return 'In Stock';
  };

  const handleShowReceivedOrderDetails = (order: ReceivedOrder) => {
    // Find the original PO by number
    const originalPO = purchaseOrders.find(po => po.poNumber === order.poNumber);
    if (originalPO) {
      setSelectedPOForDetails(originalPO);
      setShowPODetails(true);
    } else {
      // Create a mock PO from received order data for display
      const mockPO: PurchaseOrder = {
        id: order.id,
        poNumber: order.poNumber,
        vendor: order.vendor,
        orderDate: order.receiveDate, // Use receive date as approximation
        expectedDelivery: order.receiveDate,
        status: 'received',
        items: [], // No item details available
        totalAmount: order.totalAmount,
        notes: `Received by ${order.receivedBy} on ${new Date(order.receiveDate).toLocaleDateString()}`
      };
      setSelectedPOForDetails(mockPO);
      setShowPODetails(true);
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
                  <IconButton onClick={(event) => handleMenuOpen(event, item)} size="small">
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

  const renderJobList = () => {
    // Filter jobs to show active jobs prominently and completed jobs separately
    const activeJobs = jobs.filter(job => job.status === 'Active');
    const completedJobs = jobs.filter(job => job.status === 'Completed');
    const cancelledJobs = jobs.filter(job => job.status === 'Cancelled');

    return (
      <Box>
        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Active Jobs ({activeJobs.length})
            </Typography>
            <Grid container spacing={3}>
              {activeJobs.map((job) => (
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
                        color="primary"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Completed Jobs */}
        {completedJobs.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Completed Jobs ({completedJobs.length}) - Sent to Billing
            </Typography>
            <Grid container spacing={3}>
              {completedJobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      opacity: 0.8,
                      border: 1,
                      borderColor: 'success.main'
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
                          {job.quotes.some(q => q.billedToInvoice) && (
                            <Typography variant="caption" color="success.main">
                              Invoice: {job.quotes.find(q => q.billedToInvoice)?.billedToInvoice}
                            </Typography>
                          )}
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
                        label="Completed - Billed" 
                        size="small"
                        color="success"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Cancelled Jobs */}
        {cancelledJobs.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Cancelled Jobs ({cancelledJobs.length})
            </Typography>
            <Grid container spacing={3}>
              {cancelledJobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      opacity: 0.6
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
                        color="error"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* No Jobs */}
        {jobs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Kitted Jobs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Add Job" to create your first kitted job
            </Typography>
          </Box>
        )}
      </Box>
    );
  };


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
      {/* PO Search Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Search Purchase Orders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search by PO number or vendor..."
            size="small"
            sx={{ minWidth: 300, flexGrow: 1 }}
            value={poSearchTerm}
            onChange={(e) => handlePOSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Search Results */}
        {showPOSearchResults && (
          <Box sx={{ mb: 3, maxHeight: 300, overflowY: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            {filteredSearchPOs.length > 0 ? (
              filteredSearchPOs.map((po) => (
                <Box
                  key={po.id}
                  onClick={() => handleShowPODetails(po)}
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer', 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {po.poNumber} - {po.vendor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {po.status.toUpperCase()} • Total: {formatCurrency(po.totalAmount)} • Items: {po.items.length}
                      </Typography>
                    </Box>
                    <Chip
                      label={po.status.toUpperCase()}
                      color={getStatusColor(po.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No purchase orders found
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* New Order Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          New Order
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreatePO}
          sx={{ mt: 1 }}
        >
          New Purchase Order
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 3 }} />

      {/* Open Purchase Orders Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Open Purchase Orders
        </Typography>
        
        {openPOs.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No open purchase orders
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {openPOs.map((po) => (
              <Grid item xs={12} md={6} lg={4} key={po.id}>
                <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                  <CardContent onClick={() => handleShowPODetails(po)}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {po.poNumber}
                      </Typography>
                      <Chip
                        label={po.status.toUpperCase()}
                        color={getStatusColor(po.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Vendor: {po.vendor}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Order Date: {new Date(po.orderDate).toLocaleDateString()}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Expected: {new Date(po.expectedDelivery).toLocaleDateString()}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                      Total: {formatCurrency(po.totalAmount)}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {po.items.length} item(s)
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPO(po);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        startIcon={<ReceiptIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReceivePO(po);
                        }}
                      >
                        Receive
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePO(po.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 3 }} />

      {/* Recent Orders Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Recent Orders
        </Typography>
        
        {recentReceivedOrders.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No recent orders
          </Typography>
        ) : (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                {recentReceivedOrders.map((order, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    key={order.id}
                    sx={index > 0 ? { borderTop: 1, borderColor: 'divider', pt: 2 } : {}}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        py: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        borderRadius: 1,
                        px: 1
                      }}
                      onClick={() => handleShowReceivedOrderDetails(order)}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {order.poNumber} 
                          <Chip 
                            label={order.status.toUpperCase()} 
                            color={order.status === 'complete' ? 'success' : 'warning'} 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.vendor} • Received: {new Date(order.receiveDate).toLocaleDateString()} • By: {order.receivedBy}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
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
                          onClick={() => handleEditQuote(quote)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<ReceiptIcon />}
                          onClick={() => handleSendToBilling(quote)}
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
                            <TableCell align="right">Price Each</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Warehouse Stock</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quote.parts.map((part) => {
                            const warehouseStock = getWarehouseStockForPart(part.partNumber);
                            const totalPrice = part.cost * part.quantity;
                            return (
                              <TableRow key={part.itemId}>
                                <TableCell>{part.partNumber}</TableCell>
                                <TableCell>{part.name}</TableCell>
                                <TableCell align="right">${part.cost.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={part.quantity}
                                    sx={{ width: 80 }}
                                    inputProps={{ min: 0, max: warehouseStock }}
                                    onChange={(e) => {
                                      const newQuantity = Number(e.target.value);
                                      const warehouseStock = getWarehouseStockForPart(part.partNumber);
                                      const currentAllocated = inventoryData.find(inv => inv.partNumber === part.partNumber)?.allocatedStock || 0;
                                      const currentPartQuantity = part.quantity;
                                      const availableStock = warehouseStock + currentAllocated - currentPartQuantity;
                                      
                                      if (newQuantity >= 0 && newQuantity <= availableStock) {
                                        handlePartQuantityChange(quote.id, part.itemId, newQuantity);
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right">${totalPrice.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                  <Typography 
                                    variant="body2" 
                                    color={warehouseStock > 0 ? 'success.main' : 'error.main'}
                                  >
                                    {warehouseStock}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    title="Remove Part"
                                    onClick={() => handleRemovePart(quote.id, part.itemId)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
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

    const renderPurchaseOrderDialogs = () => (
    <>
      {/* Create/Edit/Receive PO Dialog */}
      <Dialog
        open={openDialog && ['createPO', 'editPO', 'receivePO'].includes(dialogType)}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'createPO' && 'Create New Purchase Order'}
          {dialogType === 'editPO' && 'Edit Purchase Order'}
          {dialogType === 'receivePO' && 'Receive Purchase Order'}
        </DialogTitle>
        <DialogContent>
          {editingPO && (
            <Box sx={{ pt: 2 }}>
              {dialogType === 'receivePO' ? (
                // Receiving interface
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PO Number"
                        value={editingPO.poNumber}
                        disabled
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Vendor"
                        value={editingPO.vendor}
                        disabled
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Order Date"
                        value={new Date(editingPO.orderDate).toLocaleDateString()}
                        disabled
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Expected Delivery"
                        value={new Date(editingPO.expectedDelivery).toLocaleDateString()}
                        disabled
                        margin="normal"
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Items to Receive
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Part Number</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Ordered Qty</TableCell>
                            <TableCell>Received Qty</TableCell>
                            <TableCell>Remaining</TableCell>
                            <TableCell>Unit Cost</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {editingPO.items.map((item) => {
                            const receivedQty = receivingQuantities[item.id] || 0;
                            const remainingQty = item.quantity - receivedQty;
                            return (
                              <TableRow key={item.id}>
                                <TableCell>{item.partNumber}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={receivedQty}
                                    onChange={(e) => handleReceivingQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0, max: item.quantity }}
                                    sx={{ width: 80 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography 
                                    variant="body2" 
                                    color={remainingQty === 0 ? 'success.main' : 'text.secondary'}
                                  >
                                    {remainingQty}
                                  </Typography>
                                </TableCell>
                                <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                                <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Receiving Summary
                            </Typography>
                            {editingPO.items.map(item => {
                              const receivedQty = receivingQuantities[item.id] || 0;
                              const isComplete = receivedQty >= item.quantity;
                              return (
                                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                  <Typography variant="body2">
                                    {item.partNumber}:
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    color={isComplete ? 'success.main' : receivedQty > 0 ? 'warning.main' : 'text.secondary'}
                                  >
                                    {receivedQty}/{item.quantity} {isComplete ? '✓' : receivedQty > 0 ? '⚠' : '○'}
                                  </Typography>
                                </Box>
                              );
                            })}
                            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1, mt: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                Status: {editingPO.items.every(item => (receivingQuantities[item.id] || 0) >= item.quantity) ? 
                                  'Ready for Complete Receiving' : 'Partial Receiving'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6">
                              Total Order Value: {formatCurrency(editingPO.totalAmount)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              ) : (
                // Create/Edit interface
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PO Number"
                        value={editingPO.poNumber}
                        onChange={(e) => setEditingPO({ ...editingPO, poNumber: e.target.value })}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Vendor"
                        value={editingPO.vendor}
                        onChange={(e) => setEditingPO({ ...editingPO, vendor: e.target.value })}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Order Date"
                        type="date"
                        value={editingPO.orderDate}
                        onChange={(e) => setEditingPO({ ...editingPO, orderDate: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Expected Delivery"
                        type="date"
                        value={editingPO.expectedDelivery}
                        onChange={(e) => setEditingPO({ ...editingPO, expectedDelivery: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={editingPO.status}
                          onChange={(e) => setEditingPO({ ...editingPO, status: e.target.value as any })}
                          label="Status"
                        >
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="sent">Sent</MenuItem>
                          <MenuItem value="received">Received</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={editingPO.notes}
                        onChange={(e) => setEditingPO({ ...editingPO, notes: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Items</Typography>
                    </Box>

                    {/* Add Item Section */}
                    <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Add Item to Purchase Order
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                          placeholder="Search inventory by part number, name, or manufacturer..."
                          size="small"
                          sx={{ minWidth: 300, flexGrow: 1 }}
                          value={poItemSearch}
                          onChange={(e) => handlePOItemSearch(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowCreateNewItem(true)}
                          startIcon={<AddIcon />}
                        >
                          Create New Item
                        </Button>
                        {selectedPOItem && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddSelectedItemToPO}
                            startIcon={<AddIcon />}
                          >
                            Add to PO
                          </Button>
                        )}
                      </Box>

                      {/* Search Results */}
                      {showPOItemResults && (
                        <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          {filteredPOItems.length > 0 ? (
                            filteredPOItems.map((item) => (
                              <MenuItem
                                key={item.id}
                                onClick={() => handleSelectPOItem(item)}
                                sx={{ p: 2, cursor: 'pointer', borderBottom: 1, borderColor: 'divider' }}
                              >
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {item.partNumber} - {item.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.manufacturer} • Cost: {formatCurrency(item.cost)} • Stock: {item.warehouseStock}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))
                          ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                No items found. Try a different search or create a new item.
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Create New Item Dialog */}
                      {showCreateNewItem && (
                        <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1, bgcolor: 'primary.50' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Create New Inventory Item
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Part Number"
                                value={newItemData.partNumber}
                                onChange={(e) => setNewItemData(prev => ({...prev, partNumber: e.target.value}))}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Name"
                                value={newItemData.name}
                                onChange={(e) => setNewItemData(prev => ({...prev, name: e.target.value}))}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Description"
                                value={newItemData.description}
                                onChange={(e) => setNewItemData(prev => ({...prev, description: e.target.value}))}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Manufacturer"
                                value={newItemData.manufacturer}
                                onChange={(e) => setNewItemData(prev => ({...prev, manufacturer: e.target.value}))}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Vendor"
                                value={newItemData.vendor}
                                onChange={(e) => setNewItemData(prev => ({...prev, vendor: e.target.value}))}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Cost"
                                type="number"
                                value={newItemData.cost}
                                onChange={(e) => setNewItemData(prev => ({...prev, cost: parseFloat(e.target.value) || 0}))}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleCreateNewInventoryItem}
                                  startIcon={<AddIcon />}
                                >
                                  Create & Add to PO
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => setShowCreateNewItem(false)}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>

                    {/* Existing Items */}
                    {editingPO.items.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Items in Purchase Order
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Part Number</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit Cost</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {editingPO.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {item.partNumber}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {item.description}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => handleUpdatePOItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                      inputProps={{ min: 1 }}
                                      sx={{ width: 80 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={item.unitCost}
                                      onChange={(e) => handleUpdatePOItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                      sx={{ width: 100 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {formatCurrency(item.totalCost)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRemovePOItem(item.id)}
                                      color="error"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Typography variant="h6">
                        Total: {formatCurrency(editingPO.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          {dialogType === 'receivePO' ? (
            <Button
               onClick={handleProcessReceiving}
               variant="contained"
               startIcon={<ReceiptIcon />}
             >
               Process Receiving
             </Button>
          ) : (
            <Button
              onClick={handleSavePO}
              variant="contained"
              startIcon={<AddIcon />}
            >
              {dialogType === 'createPO' ? 'Create PO' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );

  const renderPODetailsModal = () => (
    <Dialog
      open={showPODetails}
      onClose={handleClosePODetails}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            Purchase Order Details
          </Typography>
          {selectedPOForDetails && (
            <Chip
              label={selectedPOForDetails.status.toUpperCase()}
              color={getStatusColor(selectedPOForDetails.status) as any}
              size="medium"
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedPOForDetails && (
          <Box sx={{ pt: 2 }}>
            {/* PO Header Information */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1">
                    <strong>PO Number:</strong> {selectedPOForDetails.poNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Vendor:</strong> {selectedPOForDetails.vendor}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Order Date:</strong> {new Date(selectedPOForDetails.orderDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Expected Delivery:</strong> {new Date(selectedPOForDetails.expectedDelivery).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1">
                    <strong>Total Items:</strong> {selectedPOForDetails.items.length}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Quantity:</strong> {selectedPOForDetails.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    <strong>Total Amount:</strong> {formatCurrency(selectedPOForDetails.totalAmount)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Notes */}
            {selectedPOForDetails.notes && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {selectedPOForDetails.notes}
                </Typography>
              </Box>
            )}

            {/* Items Table */}
            {selectedPOForDetails.items.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Items
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Part Number</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Cost</TableCell>
                        <TableCell align="right">Total Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPOForDetails.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {item.partNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {item.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(item.unitCost)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(item.totalCost)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                          Total:
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(selectedPOForDetails.totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No item details available for this order
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePODetails}>
          Close
        </Button>
        {selectedPOForDetails && selectedPOForDetails.status !== 'received' && (
          <>
            <Button
              onClick={() => {
                handleClosePODetails();
                handleEditPO(selectedPOForDetails);
              }}
              variant="outlined"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            {(selectedPOForDetails.status === 'draft' || selectedPOForDetails.status === 'sent') && (
              <Button
                onClick={() => {
                  handleClosePODetails();
                  handleReceivePO(selectedPOForDetails);
                }}
                variant="contained"
                startIcon={<ReceiptIcon />}
              >
                Receive
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
        Inventory Management
      </Typography>
        {activeTab === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add New Item
          </Button>
        )}
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
        <MenuItem onClick={handleEditItem}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Item
        </MenuItem>
        <MenuItem onClick={handleMoveStock}>
          <TruckIcon sx={{ mr: 1 }} />
          Move Stock
        </MenuItem>
        <MenuItem onClick={handleAdjustCount}>
          <EditIcon sx={{ mr: 1 }} />
          Adjust Count {!isAdmin() && <Typography variant="caption" sx={{ ml: 1, color: 'warning.main' }}>(Requires Admin)</Typography>}
        </MenuItem>
        <MenuItem onClick={handleDeleteItem} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Item {!isAdmin() && <Typography variant="caption" sx={{ ml: 1, color: 'warning.main' }}>(Requires Admin)</Typography>}
        </MenuItem>
      </Menu>

      {/* Dialog for Add/Edit/Move/Adjust */}
      <Dialog open={openDialog && ['add', 'edit', 'move', 'adjust'].includes(dialogType)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Inventory Item'}
          {dialogType === 'edit' && `Edit ${selectedItem?.name || 'Inventory Item'}`}
          {dialogType === 'move' && `Move Stock - ${selectedItem?.name || 'Item'}`}
          {dialogType === 'adjust' && `Adjust Stock Count - ${selectedItem?.name || 'Item'}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {dialogType === 'add' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                This is a demo interface. In a real application, this would connect to your database.
              </Alert>
            )}

            {dialogType === 'edit' && selectedItem && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Part Number"
                    value={editFormData.partNumber || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, partNumber: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Manufacturer"
                    value={editFormData.manufacturer || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    value={editFormData.category || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cost"
                    type="number"
                    value={editFormData.cost || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Selling Price"
                    type="number"
                    value={editFormData.sellingPrice || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Min Stock Level"
                    type="number"
                    value={editFormData.minStock || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Stock Level"
                    type="number"
                    value={editFormData.maxStock || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 0 }))}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}

            {dialogType === 'move' && selectedItem && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Current Stock: Warehouse ({selectedItem.warehouseStock}) • Trucks ({selectedItem.truckStock})
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>From Location</InputLabel>
                    <Select
                      value={moveStockData.fromLocation}
                      onChange={(e) => setMoveStockData(prev => ({ ...prev, fromLocation: e.target.value }))}
                      label="From Location"
                    >
                      <MenuItem value="warehouse">Warehouse</MenuItem>
                      <MenuItem value="trucks">Service Trucks</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>To Location</InputLabel>
                    <Select
                      value={moveStockData.toLocation}
                      onChange={(e) => setMoveStockData(prev => ({ ...prev, toLocation: e.target.value }))}
                      label="To Location"
                    >
                      <MenuItem value="warehouse">Warehouse</MenuItem>
                      <MenuItem value="trucks">Service Trucks</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantity to Move"
                    type="number"
                    value={moveStockData.quantity || ''}
                    onChange={(e) => setMoveStockData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    margin="normal"
                    inputProps={{ 
                      min: 1, 
                      max: moveStockData.fromLocation === 'warehouse' ? selectedItem.warehouseStock : selectedItem.truckStock
                    }}
                    helperText={`Available: ${moveStockData.fromLocation === 'warehouse' ? selectedItem.warehouseStock : selectedItem.truckStock} units`}
                  />
                </Grid>
              </Grid>
            )}

            {dialogType === 'adjust' && selectedItem && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Stock Count Adjustment</Typography>
                    Current warehouse stock: <strong>{selectedItem.warehouseStock} units</strong>
                    <br />
                    This action requires admin privileges and will be logged for audit purposes.
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Stock Count"
                    type="number"
                    value={adjustCountData.newCount || ''}
                    onChange={(e) => setAdjustCountData(prev => ({ ...prev, newCount: parseInt(e.target.value) || 0 }))}
                    margin="normal"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mt: 3, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <strong>Adjustment:</strong> {adjustCountData.newCount - selectedItem.warehouseStock > 0 ? '+' : ''}{adjustCountData.newCount - selectedItem.warehouseStock} units
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Adjustment"
                    value={adjustCountData.reason}
                    onChange={(e) => setAdjustCountData(prev => ({ ...prev, reason: e.target.value }))}
                    margin="normal"
                    multiline
                    rows={3}
                    required
                    placeholder="e.g., Physical count discrepancy, damaged goods, theft, etc."
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogType === 'edit' && (
            <Button variant="contained" onClick={handleSaveEdit} disabled={!editFormData.name || !editFormData.partNumber}>
              Save Changes
            </Button>
          )}
          {dialogType === 'move' && (
            <Button 
              variant="contained" 
              onClick={handleSaveMoveStock}
              disabled={!moveStockData.toLocation || moveStockData.quantity <= 0 || moveStockData.fromLocation === moveStockData.toLocation}
            >
              Move Stock
            </Button>
          )}
          {dialogType === 'adjust' && (
            <Button 
              variant="contained" 
              onClick={handleSaveAdjustCount}
              disabled={!adjustCountData.reason.trim()}
              color="warning"
            >
              Adjust Count
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Admin Authentication Dialog */}
      <Dialog open={showAdminAuth} onClose={() => setShowAdminAuth(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Admin Authentication Required</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action requires admin privileges. Please enter the admin password to continue.
          </Alert>
          <TextField
            fullWidth
            label="Admin Password"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            margin="normal"
            onKeyPress={(e) => e.key === 'Enter' && handleAdminAuth()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAdminAuth(false);
            setAdminPassword('');
            setPendingAction(null);
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdminAuth} disabled={!adminPassword}>
            Authenticate
          </Button>
        </DialogActions>
      </Dialog>
      {renderTruckSettingsDialog()}
      {renderAddTruckDialog()}
      {renderEditTruckDialog()}
      {renderAddJobDialog()}
      {renderJobSettingsDialog()}
      {renderAddQuoteDialog()}
      {renderPurchaseOrderDialogs()}
      {renderPODetailsModal()}
    </Box>
  );
};

export default Inventory; 