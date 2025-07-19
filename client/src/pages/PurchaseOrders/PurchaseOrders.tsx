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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon
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
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate next PO number
  const getNextPONumber = () => {
    const lastPO = purchaseOrders
      .map(po => parseInt(po.poNumber.replace('PO-', '')))
      .sort((a, b) => b - a)[0] || 0;
    return `PO-${String(lastPO + 1).padStart(3, '0')}`;
  };

  // Filter POs based on search term
  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter(po =>
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [purchaseOrders, searchTerm]);

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
    setOpenDialog(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO({ ...po });
    setIsEditing(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Purchase Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePO}
        >
          Create New PO
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search POs by number, vendor, or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredPOs.map((po) => (
          <Grid item xs={12} md={6} lg={4} key={po.id}>
            <Card>
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
                
                <Typography variant="body2" color="text.secondary">
                  {po.items.length} item(s)
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditPO(po)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
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

      {/* Create/Edit PO Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Purchase Order' : 'Create New Purchase Order'}
        </DialogTitle>
        <DialogContent>
          {editingPO && (
            <Box sx={{ pt: 2 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button
            onClick={handleSavePO}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save PO
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrders; 