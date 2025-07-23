import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Receipt as ReceiptIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';

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

const PurchaseOrders: React.FC = () => {
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

  // Mock recent received orders
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
    },
    {
      id: '4',
      poNumber: 'PO-007',
      vendor: 'Hardware Plus',
      receiveDate: '2024-01-12',
      receivedBy: 'Sarah Wilson',
      totalAmount: 675.00,
      status: 'complete'
    },
    {
      id: '5',
      poNumber: 'PO-008',
      vendor: 'Parts Central',
      receiveDate: '2024-01-10',
      receivedBy: 'Tom Brown',
      totalAmount: 450.00,
      status: 'complete'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'receive'>('create');

  // Calculate next PO number
  const getNextPONumber = () => {
    const lastPO = purchaseOrders
      .map(po => parseInt(po.poNumber.replace('PO-', '')))
      .sort((a, b) => b - a)[0] || 0;
    return `PO-${String(lastPO + 1).padStart(3, '0')}`;
  };

  // Get open purchase orders (draft or sent status)
  const openPOs = useMemo(() => {
    return purchaseOrders.filter(po => po.status === 'draft' || po.status === 'sent');
  }, [purchaseOrders]);

  // Get recent 10 received orders
  const recentReceivedOrders = useMemo(() => {
    return recentOrders.slice(0, 10);
  }, [recentOrders]);

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
    setIsEditing(false);
    setDialogType('create');
    setOpenDialog(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO({ ...po });
    setIsEditing(true);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleReceivePO = (po: PurchaseOrder) => {
    setEditingPO({ ...po });
    setDialogType('receive');
    setOpenDialog(true);
  };

  const handleSavePO = () => {
    if (!editingPO) return;

    if (isEditing) {
      setPurchaseOrders(prev => 
        prev.map(po => po.id === editingPO.id ? editingPO : po)
      );
    } else {
      setPurchaseOrders(prev => [...prev, editingPO]);
    }

    setOpenDialog(false);
    setEditingPO(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setOpenDialog(false);
    setEditingPO(null);
    setIsEditing(false);
  };

  const handleDeletePO = (poId: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
  };

  const handleAddItem = () => {
    if (!editingPO) return;

    const newItem: POItem = {
      id: Date.now().toString(),
      partNumber: '',
      description: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0
    };

    setEditingPO({
      ...editingPO,
      items: [...editingPO.items, newItem]
    });
  };

  const handleUpdateItem = (itemId: string, field: keyof POItem, value: any) => {
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

  const handleRemoveItem = (itemId: string) => {
    if (!editingPO) return;

    const updatedItems = editingPO.items.filter(item => item.id !== itemId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalCost, 0);

    setEditingPO({
      ...editingPO,
      items: updatedItems,
      totalAmount
    });
  };

  const handleMarkAsReceived = (partial: boolean = false) => {
    if (!editingPO) return;

    const updatedPO = {
      ...editingPO,
      status: 'received' as const
    };

    setPurchaseOrders(prev => 
      prev.map(po => po.id === editingPO.id ? updatedPO : po)
    );

    // In real app, this would create a new received order record and add to recent orders
    setOpenDialog(false);
    setEditingPO(null);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Purchasing & Receiving
      </Typography>

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

      <Divider sx={{ my: 3 }} />

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
                  <CardContent>
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
                        onClick={() => handleEditPO(po)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ReceiptIcon />}
                        onClick={() => handleReceivePO(po)}
                      >
                        Receive
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePO(po.id)}
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

      <Divider sx={{ my: 3 }} />

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
            <List>
              {recentReceivedOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {order.poNumber}
                          </Typography>
                          <Chip
                            label={order.status.toUpperCase()}
                            color={order.status === 'complete' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {order.vendor} • Received: {new Date(order.receiveDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Received by: {order.receivedBy}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="medium" color="primary">
                          {formatCurrency(order.totalAmount)}
                        </Typography>
                        <IconButton size="small" color="primary">
                          <LocalShippingIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentReceivedOrders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        )}
      </Box>

      {/* Create/Edit/Receive PO Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'create' && 'Create New Purchase Order'}
          {dialogType === 'edit' && 'Edit Purchase Order'}
          {dialogType === 'receive' && 'Receive Purchase Order'}
        </DialogTitle>
        <DialogContent>
          {editingPO && (
            <Box sx={{ pt: 2 }}>
              {dialogType === 'receive' ? (
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
                            <TableCell>Unit Cost</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {editingPO.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.partNumber}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                              <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Typography variant="h6">
                        Total: {formatCurrency(editingPO.totalAmount)}
                      </Typography>
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
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddItem}
                      >
                        Add Item
                      </Button>
                    </Box>

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
                                <TextField
                                  size="small"
                                  value={item.partNumber}
                                  onChange={(e) => handleUpdateItem(item.id, 'partNumber', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={item.description}
                                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  inputProps={{ min: 1 }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={item.unitCost}
                                  onChange={(e) => handleUpdateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {formatCurrency(item.totalCost)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveItem(item.id)}
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
          <Button onClick={handleCancelEdit}>
            Cancel
          </Button>
          {dialogType === 'receive' ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => handleMarkAsReceived(true)}
                variant="outlined"
                startIcon={<ReceiptIcon />}
              >
                Receive Partial
              </Button>
              <Button
                onClick={() => handleMarkAsReceived(false)}
                variant="contained"
                startIcon={<ReceiptIcon />}
              >
                Receive Complete
              </Button>
            </Box>
          ) : (
            <Button
              onClick={handleSavePO}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Save PO
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrders; 