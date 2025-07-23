import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

interface InvoiceItem {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'part' | 'labor';
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  jobNumber: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
  notes: string;
  quoteName?: string;
  quoteId?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerName: 'ABC Corporation',
    jobNumber: 'JOB-2024-001',
    amount: 2450.00,
    status: 'Sent',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15',
    notes: 'Brake system installation',
    items: [
      { id: '1', partNumber: 'BRK-001', name: 'Brake Pads - Premium', quantity: 4, unitPrice: 125.00, totalPrice: 500.00, type: 'part' as const },
      { id: '2', partNumber: 'BRK-002', name: 'Brake Rotors - Heavy Duty', quantity: 2, unitPrice: 975.00, totalPrice: 1950.00, type: 'part' as const }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'XYZ Industries',
    jobNumber: 'JOB-2024-002',
    amount: 1890.50,
    status: 'Paid',
    dueDate: '2024-02-10',
    createdAt: '2024-01-10',
    notes: 'Air conditioning repair',
    items: [
      { id: '3', partNumber: 'AC-001', name: 'A/C Compressor', quantity: 1, unitPrice: 1250.50, totalPrice: 1250.50, type: 'part' as const },
      { id: '4', partNumber: 'AC-002', name: 'Refrigerant', quantity: 2, unitPrice: 320.00, totalPrice: 640.00, type: 'part' as const }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerName: 'Tech Solutions Inc',
    jobNumber: 'JOB-2024-003',
    amount: 3200.00,
    status: 'Draft',
    dueDate: '2024-02-20',
    createdAt: '2024-01-20',
    notes: 'Fleet maintenance package',
    items: [
      { id: '5', partNumber: 'OIL-001', name: 'Synthetic Oil', quantity: 10, unitPrice: 45.00, totalPrice: 450.00, type: 'part' as const },
      { id: '6', partNumber: 'FLT-001', name: 'Air Filter', quantity: 8, unitPrice: 25.00, totalPrice: 200.00, type: 'part' as const },
      { id: '7', partNumber: 'TIR-001', name: 'Commercial Tires', quantity: 8, unitPrice: 318.75, totalPrice: 2550.00, type: 'part' as const }
    ]
  }
];

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Partial<Invoice>>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Item editing state
  const [editingItems, setEditingItems] = useState<InvoiceItem[]>([]);
  const [newItemData, setNewItemData] = useState({
    partNumber: '',
    name: '',
    quantity: 1,
    unitPrice: 0,
    type: 'part' as 'part' | 'labor'
  });

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        setInvoices([...mockInvoices, ...parsed]);
      } catch (error) {
        console.error('Error loading invoices from localStorage:', error);
      }
    }
  }, []);

  // Listen for new invoices from inventory system
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'invoices') {
        const savedInvoices = localStorage.getItem('invoices');
        if (savedInvoices) {
          try {
            const parsed = JSON.parse(savedInvoices);
            setInvoices(prev => {
              const existingIds = new Set(prev.map(inv => inv.id));
              const newInvoices = parsed.filter((inv: Invoice) => !existingIds.has(inv.id));
              return [...prev, ...newInvoices];
            });
          } catch (error) {
            console.error('Error loading invoices from localStorage:', error);
          }
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.type === 'newInvoice') {
        const newInvoice = e.detail;
        setInvoices(prev => [...prev, newInvoice]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newInvoice' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newInvoice' as any, handleCustomEvent);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'default';
      case 'Sent':
        return 'info';
      case 'Paid':
        return 'success';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'create' | 'edit' | 'view', invoice?: Invoice | null) => {
    setDialogType(type);
    if (invoice) {
      setSelectedInvoice(invoice);
      setEditingInvoice({ ...invoice });
      setEditingItems([...invoice.items]);
    } else {
      setSelectedInvoice(null);
      setEditingInvoice({
        customerName: '',
        jobNumber: '',
        notes: '',
        items: [],
        amount: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      });
      setEditingItems([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvoice(null);
    setEditingInvoice({});
    setEditingItems([]);
    setNewItemData({
      partNumber: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      type: 'part'
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoice: Invoice) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const getNextInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const currentInvoices = invoices.filter(inv => 
      inv.invoiceNumber.includes(currentYear.toString())
    );
    const nextNumber = currentInvoices.length + 1;
    return `INV-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
  };

  // Item management functions
  const handleAddItem = () => {
    if (!newItemData.name) return;

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      partNumber: newItemData.partNumber || (newItemData.type === 'labor' ? 'LABOR' : 'PART'),
      name: newItemData.name,
      quantity: newItemData.quantity,
      unitPrice: newItemData.unitPrice,
      totalPrice: newItemData.quantity * newItemData.unitPrice,
      type: newItemData.type
    };

    setEditingItems(prev => [...prev, newItem]);
    setNewItemData({
      partNumber: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      type: 'part'
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setEditingItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setEditingItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleMoveItemUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...editingItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setEditingItems(newItems);
  };

  const handleMoveItemDown = (index: number) => {
    if (index === editingItems.length - 1) return;
    const newItems = [...editingItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setEditingItems(newItems);
  };

  const calculateTotalAmount = () => {
    return editingItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSaveInvoice = () => {
    if (!editingInvoice.customerName || !editingInvoice.jobNumber) return;

    const totalAmount = calculateTotalAmount();

    const invoiceData: Invoice = {
      id: selectedInvoice?.id || Date.now().toString(),
      invoiceNumber: selectedInvoice?.invoiceNumber || getNextInvoiceNumber(),
      customerName: editingInvoice.customerName || '',
      jobNumber: editingInvoice.jobNumber || '',
      amount: totalAmount,
      status: editingInvoice.status || 'Draft',
      dueDate: editingInvoice.dueDate || '',
      createdAt: selectedInvoice?.createdAt || new Date().toISOString().split('T')[0],
      items: editingItems,
      notes: editingInvoice.notes || '',
      quoteName: editingInvoice.quoteName,
      quoteId: editingInvoice.quoteId
    };

    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? invoiceData : inv));
    } else {
      setInvoices(prev => [...prev, invoiceData]);
    }

    handleCloseDialog();
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id ? { ...inv, status: 'Sent' as const } : inv
    ));
    handleMenuClose();
  };

  const handleMarkPaid = (invoice: Invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id ? { ...inv, status: 'Paid' as const } : inv
    ));
    handleMenuClose();
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
    }
    handleMenuClose();
  };

  const filterInvoicesByTab = () => {
    switch (activeTab) {
      case 0: // Draft
        return invoices.filter(inv => inv.status === 'Draft');
      case 1: // Sent
        return invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue');
      case 2: // Paid
        return invoices.filter(inv => inv.status === 'Paid');
      default:
        return invoices;
    }
  };

  const calculateSummaryStats = () => {
    const draftInvoices = invoices.filter(inv => inv.status === 'Draft');
    const sentInvoices = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue');
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');

    return {
      totalInvoices: invoices.length,
      draftCount: draftInvoices.length,
      draftAmount: draftInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      outstandingCount: sentInvoices.length,
      outstandingAmount: sentInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      paidCount: paidInvoices.length,
      paidAmount: paidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      overdueCount: invoices.filter(inv => inv.status === 'Overdue').length
    };
  };

  const stats = calculateSummaryStats();
  const filteredInvoices = filterInvoicesByTab();

  const renderInvoiceTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Job #</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id} sx={{ cursor: 'pointer' }} onClick={() => handleOpenDialog('view', invoice)}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{invoice.jobNumber}</Typography>
                  {invoice.quoteName && (
                    <Typography variant="caption" color="text.secondary">
                      Quote: {invoice.quoteName}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Chip 
                  label={invoice.status} 
                  color={getStatusColor(invoice.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell align="center">
                <IconButton onClick={(e) => handleMenuOpen(e, invoice)} size="small">
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {filteredInvoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No {activeTab === 0 ? 'draft' : activeTab === 1 ? 'sent' : 'paid'} invoices found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Billing & Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          Create Invoice
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Draft Invoices</Typography>
              <Typography variant="h4" color="default.main">{stats.draftCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${stats.draftAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Outstanding</Typography>
              <Typography variant="h4" color="warning.main">{stats.outstandingCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${stats.outstandingAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Paid Invoices</Typography>
              <Typography variant="h4" color="success.main">{stats.paidCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${stats.paidAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overdue</Typography>
              <Typography variant="h4" color="error.main">{stats.overdueCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for organizing invoices */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Draft (${stats.draftCount})`} />
          <Tab label={`Sent (${stats.outstandingCount})`} />
          <Tab label={`Paid (${stats.paidCount})`} />
        </Tabs>
      </Box>

      {renderInvoiceTable()}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedInvoice?.status === 'Draft' && [
          <MenuItem key="edit" onClick={() => {
            handleOpenDialog('edit', selectedInvoice);
            handleMenuClose();
          }}>
            <EditIcon sx={{ mr: 1 }} />
            Edit Invoice
          </MenuItem>,
          <MenuItem key="send" onClick={() => handleSendInvoice(selectedInvoice)}>
            <SendIcon sx={{ mr: 1 }} />
            Send Invoice
          </MenuItem>,
          <Divider key="divider1" />
        ]}
        
        {selectedInvoice?.status === 'Sent' && [
          <MenuItem key="paid" onClick={() => handleMarkPaid(selectedInvoice)}>
            <PaymentIcon sx={{ mr: 1 }} />
            Mark as Paid
          </MenuItem>,
          <Divider key="divider2" />
        ]}
        
        <MenuItem onClick={() => {
          handleOpenDialog('view', selectedInvoice);
          handleMenuClose();
        }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EmailIcon sx={{ mr: 1 }} />
          Email Invoice
        </MenuItem>
        
        {selectedInvoice?.status === 'Draft' && [
          <Divider key="divider3" />,
          <MenuItem key="delete" onClick={() => handleDeleteInvoice(selectedInvoice)} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Invoice
          </MenuItem>
        ]}
      </Menu>

      {/* Invoice Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogType === 'create' && 'Create New Invoice'}
          {dialogType === 'edit' && `Edit Invoice ${selectedInvoice?.invoiceNumber}`}
          {dialogType === 'view' && `Invoice ${selectedInvoice?.invoiceNumber} Details`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {dialogType === 'view' && selectedInvoice ? (
              // View mode
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Invoice Information</Typography>
                  <Typography variant="body1"><strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}</Typography>
                  <Typography variant="body1"><strong>Customer:</strong> {selectedInvoice.customerName}</Typography>
                  <Typography variant="body1"><strong>Job #:</strong> {selectedInvoice.jobNumber}</Typography>
                  <Typography variant="body1"><strong>Created:</strong> {selectedInvoice.createdAt}</Typography>
                  <Typography variant="body1"><strong>Due Date:</strong> {selectedInvoice.dueDate}</Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> 
                    <Chip 
                      label={selectedInvoice.status} 
                      color={getStatusColor(selectedInvoice.status) as any}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Typography variant="body1"><strong>Total Items:</strong> {selectedInvoice.items.length}</Typography>
                  <Typography variant="h4" color="primary.main">
                    <strong>Total: ${selectedInvoice.amount.toFixed(2)}</strong>
                  </Typography>
                  {selectedInvoice.quoteName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Generated from quote: {selectedInvoice.quoteName}
                    </Typography>
                  )}
                </Grid>
                
                {selectedInvoice.notes && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Notes</Typography>
                    <Typography variant="body1">{selectedInvoice.notes}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Invoice Items</Typography>
                  <TableContainer component={Paper}>
                                           <Table>
                         <TableHead>
                           <TableRow>
                             <TableCell>Type</TableCell>
                             <TableCell>Part Number</TableCell>
                             <TableCell>Description</TableCell>
                             <TableCell align="right">Quantity</TableCell>
                             <TableCell align="right">Unit Price</TableCell>
                             <TableCell align="right">Total</TableCell>
                           </TableRow>
                         </TableHead>
                         <TableBody>
                           {selectedInvoice.items.map((item) => (
                             <TableRow key={item.id}>
                               <TableCell>
                                 <Chip 
                                   label={item.type.toUpperCase()} 
                                   color={item.type === 'labor' ? 'secondary' : 'primary'} 
                                   size="small" 
                                 />
                               </TableCell>
                               <TableCell>{item.partNumber}</TableCell>
                               <TableCell>{item.name}</TableCell>
                               <TableCell align="right">{item.quantity}</TableCell>
                               <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                               <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                             </TableRow>
                           ))}
                        <TableRow>
                                                     <TableCell colSpan={5} sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                             Total:
                           </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            ${selectedInvoice.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              // Create/Edit mode
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={editingInvoice.customerName || ''}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Job Number"
                    value={editingInvoice.jobNumber || ''}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, jobNumber: e.target.value }))}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={editingInvoice.amount || ''}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={editingInvoice.dueDate || ''}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={editingInvoice.notes || ''}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
                                 {/* Items Management Section */}
                 <Grid item xs={12}>
                   <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                     Invoice Items
                   </Typography>
                   
                   {/* Add New Item Form */}
                   <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                     <Typography variant="subtitle1" gutterBottom>
                       Add New Item
                     </Typography>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={3}>
                         <FormControl fullWidth size="small">
                           <InputLabel>Type</InputLabel>
                           <Select
                             value={newItemData.type}
                             onChange={(e) => setNewItemData(prev => ({ ...prev, type: e.target.value as 'part' | 'labor' }))}
                             label="Type"
                           >
                             <MenuItem value="part">Part</MenuItem>
                             <MenuItem value="labor">Labor</MenuItem>
                           </Select>
                         </FormControl>
                       </Grid>
                       <Grid item xs={12} md={3}>
                         <TextField
                           fullWidth
                           size="small"
                           label={newItemData.type === 'labor' ? "Labor Code" : "Part Number"}
                           value={newItemData.partNumber}
                           onChange={(e) => setNewItemData(prev => ({ ...prev, partNumber: e.target.value }))}
                           placeholder={newItemData.type === 'labor' ? "Optional" : "Required"}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label={newItemData.type === 'labor' ? "Labor Description" : "Part Description"}
                           value={newItemData.name}
                           onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                           required
                         />
                       </Grid>
                       <Grid item xs={12} md={3}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Quantity"
                           type="number"
                           value={newItemData.quantity}
                           onChange={(e) => setNewItemData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                           inputProps={{ min: 0, step: 0.1 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={3}>
                         <TextField
                           fullWidth
                           size="small"
                           label={newItemData.type === 'labor' ? "Rate/Hour" : "Unit Price"}
                           type="number"
                           value={newItemData.unitPrice}
                           onChange={(e) => setNewItemData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                           InputProps={{
                             startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                           }}
                           inputProps={{ min: 0, step: 0.01 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={3}>
                         <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                           <Typography variant="body2" sx={{ mr: 1 }}>Total:</Typography>
                           <Typography variant="h6" color="primary.main">
                             ${(newItemData.quantity * newItemData.unitPrice).toFixed(2)}
                           </Typography>
                         </Box>
                       </Grid>
                       <Grid item xs={12} md={3}>
                         <Button
                           fullWidth
                           variant="contained"
                           onClick={handleAddItem}
                           disabled={!newItemData.name}
                           startIcon={<AddIcon />}
                         >
                           Add Item
                         </Button>
                       </Grid>
                     </Grid>
                   </Box>

                   {/* Current Items List */}
                   {editingItems.length > 0 && (
                     <TableContainer component={Paper} sx={{ mb: 2 }}>
                       <Table>
                         <TableHead>
                           <TableRow>
                             <TableCell>Type</TableCell>
                             <TableCell>Part/Code</TableCell>
                             <TableCell>Description</TableCell>
                             <TableCell align="right">Qty</TableCell>
                             <TableCell align="right">Unit Price</TableCell>
                             <TableCell align="right">Total</TableCell>
                             <TableCell align="center">Actions</TableCell>
                           </TableRow>
                         </TableHead>
                         <TableBody>
                           {editingItems.map((item, index) => (
                             <TableRow key={item.id}>
                               <TableCell>
                                 <Chip 
                                   label={item.type.toUpperCase()} 
                                   color={item.type === 'labor' ? 'secondary' : 'primary'} 
                                   size="small" 
                                 />
                               </TableCell>
                               <TableCell>
                                 <TextField
                                   size="small"
                                   value={item.partNumber}
                                   onChange={(e) => handleUpdateItem(item.id, 'partNumber', e.target.value)}
                                   sx={{ minWidth: 100 }}
                                 />
                               </TableCell>
                               <TableCell>
                                 <TextField
                                   size="small"
                                   value={item.name}
                                   onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                   sx={{ minWidth: 200 }}
                                 />
                               </TableCell>
                               <TableCell align="right">
                                 <TextField
                                   size="small"
                                   type="number"
                                   value={item.quantity}
                                   onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                   sx={{ width: 80 }}
                                   inputProps={{ min: 0, step: 0.1 }}
                                 />
                               </TableCell>
                               <TableCell align="right">
                                 <TextField
                                   size="small"
                                   type="number"
                                   value={item.unitPrice}
                                   onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                   sx={{ width: 100 }}
                                   InputProps={{
                                     startAdornment: <Box sx={{ mr: 0.5 }}>$</Box>,
                                   }}
                                   inputProps={{ min: 0, step: 0.01 }}
                                 />
                               </TableCell>
                               <TableCell align="right">
                                 <Typography variant="body2" fontWeight="medium">
                                   ${item.totalPrice.toFixed(2)}
                                 </Typography>
                               </TableCell>
                               <TableCell align="center">
                                 <Box sx={{ display: 'flex', gap: 0.5 }}>
                                   <IconButton 
                                     size="small" 
                                     onClick={() => handleMoveItemUp(index)}
                                     disabled={index === 0}
                                   >
                                     ↑
                                   </IconButton>
                                   <IconButton 
                                     size="small" 
                                     onClick={() => handleMoveItemDown(index)}
                                     disabled={index === editingItems.length - 1}
                                   >
                                     ↓
                                   </IconButton>
                                   <IconButton 
                                     size="small" 
                                     onClick={() => handleRemoveItem(item.id)}
                                     color="error"
                                   >
                                     <DeleteIcon />
                                   </IconButton>
                                 </Box>
                               </TableCell>
                             </TableRow>
                           ))}
                           <TableRow>
                             <TableCell colSpan={5} sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                               Total Amount:
                             </TableCell>
                             <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                               ${calculateTotalAmount().toFixed(2)}
                             </TableCell>
                             <TableCell />
                           </TableRow>
                         </TableBody>
                       </Table>
                     </TableContainer>
                   )}

                   {dialogType === 'create' && editingItems.length === 0 && (
                     <Alert severity="info">
                       Add items above or send kitted jobs from the Stock Movement section to auto-populate invoice items.
                     </Alert>
                   )}
                 </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType !== 'view' && (
            <Button 
              variant="contained" 
              onClick={handleSaveInvoice}
              disabled={!editingInvoice.customerName || !editingInvoice.jobNumber}
            >
              {dialogType === 'create' ? 'Create Invoice' : 'Save Changes'}
            </Button>
          )}
          {dialogType === 'view' && selectedInvoice?.status === 'Draft' && (
            <>
              <Button 
                variant="outlined" 
                onClick={() => {
                  handleOpenDialog('edit', selectedInvoice);
                }}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  handleSendInvoice(selectedInvoice);
                  handleCloseDialog();
                }}
                startIcon={<SendIcon />}
              >
                Send Invoice
              </Button>
            </>
          )}
          {dialogType === 'view' && selectedInvoice?.status === 'Sent' && (
            <Button 
              variant="contained" 
              onClick={() => {
                handleMarkPaid(selectedInvoice);
                handleCloseDialog();
              }}
              startIcon={<PaymentIcon />}
              color="success"
            >
              Mark as Paid
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Billing; 