import React from 'react';
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
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Email as EmailIcon
} from '@mui/icons-material';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  jobNumber: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  dueDate: string;
  createdAt: string;
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
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'XYZ Industries',
    jobNumber: 'JOB-2024-002',
    amount: 1890.50,
    status: 'Paid',
    dueDate: '2024-02-10',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerName: 'Tech Solutions Inc',
    jobNumber: 'JOB-2024-003',
    amount: 3200.00,
    status: 'Draft',
    dueDate: '2024-02-20',
    createdAt: '2024-01-20'
  }
];

const Billing: React.FC = () => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Billing & Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Invoice
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Invoices</Typography>
              <Typography variant="h4" color="primary.main">{mockInvoices.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Outstanding</Typography>
              <Typography variant="h4" color="warning.main">
                ${mockInvoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue')
                  .reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Paid This Month</Typography>
              <Typography variant="h4" color="success.main">
                ${mockInvoices.filter(inv => inv.status === 'Paid')
                  .reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overdue</Typography>
              <Typography variant="h4" color="error.main">
                {mockInvoices.filter(inv => inv.status === 'Overdue').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.jobNumber}</TableCell>
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<ReceiptIcon />}>
                      View
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      PDF
                    </Button>
                    <Button size="small" startIcon={<EmailIcon />}>
                      Send
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Billing; 