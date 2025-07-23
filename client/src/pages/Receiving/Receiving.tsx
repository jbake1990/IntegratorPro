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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Save as SaveIcon
} from '@mui/icons-material';

interface ReceivedItem {
  id: string;
  partNumber: string;
  description: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalCost: number;
  condition: 'good' | 'damaged' | 'missing';
  notes: string;
}

interface ReceivingRecord {
  id: string;
  poNumber: string;
  vendor: string;
  receiveDate: string;
  receivedBy: string;
  status: 'partial' | 'complete' | 'pending';
  items: ReceivedItem[];
  totalAmount: number;
  notes: string;
}

const Receiving: React.FC = () => {
  const [receivingRecords, setReceivingRecords] = useState<ReceivingRecord[]>([
    {
      id: '1',
      poNumber: 'PO-001',
      vendor: 'ABC Suppliers',
      receiveDate: '2024-01-25',
      receivedBy: 'John Smith',
      status: 'complete',
      items: [
        {
          id: '1',
          partNumber: 'ABC-123',
          description: 'Hydraulic Pump',
          orderedQuantity: 5,
          receivedQuantity: 5,
          unitCost: 150.00,
          totalCost: 750.00,
          condition: 'good',
          notes: ''
        },
        {
          id: '2',
          partNumber: 'XYZ-456',
          description: 'Control Valve',
          orderedQuantity: 10,
          receivedQuantity: 10,
          unitCost: 75.50,
          totalCost: 755.00,
          condition: 'good',
          notes: ''
        }
      ],
      totalAmount: 1505.00,
      notes: 'All items received in good condition'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ReceivingRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPO, setSelectedPO] = useState<string>('');

  // Mock PO data for receiving
  const mockPOs = [
    {
      poNumber: 'PO-001',
      vendor: 'ABC Suppliers',
      items: [
        { partNumber: 'ABC-123', description: 'Hydraulic Pump', quantity: 5, unitCost: 150.00 },
        { partNumber: 'XYZ-456', description: 'Control Valve', quantity: 10, unitCost: 75.50 }
      ]
    },
    {
      poNumber: 'PO-002',
      vendor: 'Tech Parts Inc',
      items: [
        { partNumber: 'DEF-789', description: 'Electrical Components', quantity: 20, unitCost: 25.00 }
      ]
    }
  ];

  // Filter receiving records based on search term
  const filteredRecords = useMemo(() => {
    return receivingRecords.filter(record =>
      record.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [receivingRecords, searchTerm]);

  const handleCreateReceiving = () => {
    setOpenDialog(true);
    setEditingRecord(null);
  };

  const handleSelectPO = (poNumber: string) => {
    const selectedPOData = mockPOs.find(po => po.poNumber === poNumber);
    if (!selectedPOData) return;

    const newRecord: ReceivingRecord = {
      id: Date.now().toString(),
      poNumber: selectedPOData.poNumber,
      vendor: selectedPOData.vendor,
      receiveDate: new Date().toISOString().split('T')[0],
      receivedBy: '',
      status: 'pending',
      items: selectedPOData.items.map(item => ({
        id: Date.now().toString() + Math.random(),
        partNumber: item.partNumber,
        description: item.description,
        orderedQuantity: item.quantity,
        receivedQuantity: 0,
        unitCost: item.unitCost,
        totalCost: 0,
        condition: 'good',
        notes: ''
      })),
      totalAmount: 0,
      notes: ''
    };

    setEditingRecord(newRecord);
    setSelectedPO('');
  };

  const handleSaveReceiving = () => {
    if (!editingRecord) return;

    // Calculate totals and determine status
    const totalAmount = editingRecord.items.reduce((sum, item) => sum + item.totalCost, 0);
    const isComplete = editingRecord.items.every(item => item.receivedQuantity >= item.orderedQuantity);
    const hasPartial = editingRecord.items.some(item => item.receivedQuantity > 0);
    
    let status: 'partial' | 'complete' | 'pending';
    if (isComplete) {
      status = 'complete';
    } else if (hasPartial) {
      status = 'partial';
    } else {
      status = 'pending';
    }

    const updatedRecord: ReceivingRecord = {
      ...editingRecord,
      totalAmount,
      status
    };

    setReceivingRecords(prev => [...prev, updatedRecord]);
    setOpenDialog(false);
    setEditingRecord(null);
  };

  const handleCancelReceiving = () => {
    setOpenDialog(false);
    setEditingRecord(null);
    setSelectedPO('');
  };

  const handleUpdateReceivedItem = (itemId: string, field: keyof ReceivedItem, value: any) => {
    if (!editingRecord) return;

    const updatedItems = editingRecord.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'receivedQuantity' || field === 'unitCost') {
          updatedItem.totalCost = updatedItem.receivedQuantity * updatedItem.unitCost;
        }
        return updatedItem;
      }
      return item;
    });

    setEditingRecord({
      ...editingRecord,
      items: updatedItems
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'partial': return 'warning';
      case 'complete': return 'success';
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
        Receiving
      </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateReceiving}
        >
          Create Receiving Record
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search receiving records by PO number, vendor, or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredRecords.map((record) => (
          <Grid item xs={12} md={6} lg={4} key={record.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {record.poNumber}
                  </Typography>
                  <Chip
                    label={record.status.toUpperCase()}
                    color={getStatusColor(record.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography color="text.secondary" gutterBottom>
                  Vendor: {record.vendor}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Receive Date: {new Date(record.receiveDate).toLocaleDateString()}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Received By: {record.receivedBy}
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                  Total: {formatCurrency(record.totalAmount)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {record.items.length} item(s)
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Items Received: {record.items.filter(item => item.receivedQuantity > 0).length}/{record.items.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Receiving Record Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelReceiving}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Create Receiving Record
        </DialogTitle>
        <DialogContent>
          {!editingRecord ? (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select Purchase Order
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Purchase Order</InputLabel>
                <Select
                  value={selectedPO}
                  onChange={(e) => setSelectedPO(e.target.value)}
                  label="Purchase Order"
                >
                  {mockPOs.map((po) => (
                    <MenuItem key={po.poNumber} value={po.poNumber}>
                      {po.poNumber} - {po.vendor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedPO && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleSelectPO(selectedPO)}
                    startIcon={<ReceiptIcon />}
                  >
                    Create Receiving Record for {selectedPO}
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="PO Number"
                    value={editingRecord.poNumber}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vendor"
                    value={editingRecord.vendor}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Receive Date"
                    type="date"
                    value={editingRecord.receiveDate}
                    onChange={(e) => setEditingRecord({ ...editingRecord, receiveDate: e.target.value })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Received By"
                    value={editingRecord.receivedBy}
                    onChange={(e) => setEditingRecord({ ...editingRecord, receivedBy: e.target.value })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={editingRecord.notes}
                    onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Received Items
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Part Number</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Ordered Qty</TableCell>
                        <TableCell>Received Qty</TableCell>
                        <TableCell>Unit Cost</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Condition</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editingRecord.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {item.partNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.orderedQuantity}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.receivedQuantity}
                              onChange={(e) => handleUpdateReceivedItem(item.id, 'receivedQuantity', parseInt(e.target.value) || 0)}
                              inputProps={{ min: 0, max: item.orderedQuantity }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => handleUpdateReceivedItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatCurrency(item.totalCost)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={item.condition}
                                onChange={(e) => handleUpdateReceivedItem(item.id, 'condition', e.target.value)}
                              >
                                <MenuItem value="good">Good</MenuItem>
                                <MenuItem value="damaged">Damaged</MenuItem>
                                <MenuItem value="missing">Missing</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.notes}
                              onChange={(e) => handleUpdateReceivedItem(item.id, 'notes', e.target.value)}
                              placeholder="Notes"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant="h6">
                    Total Received: {formatCurrency(editingRecord.items.reduce((sum, item) => sum + item.totalCost, 0))}
      </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReceiving}>
            Cancel
          </Button>
          {editingRecord && (
            <Button
              onClick={handleSaveReceiving}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Save Receiving Record
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Receiving; 