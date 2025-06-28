import { Request } from 'express';
import { User } from '@prisma/client';

// Extended Request interface with user
export interface AuthRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Inventory types
export interface InventoryUpdate {
  itemId: string;
  warehouseId?: string;
  vehicleId?: string;
  quantity: number;
  location?: string;
  notes?: string;
}

// Invoice types
export interface InvoiceItemInput {
  itemId: string;
  quantity: number;
  price: number;
}

export interface CreateInvoiceRequest {
  customerId: string;
  items: InvoiceItemInput[];
  notes?: string;
  dueDate?: string;
}

// Purchase Order types
export interface POItemInput {
  itemId: string;
  quantity: number;
  cost: number;
}

export interface CreatePORequest {
  vendorId: string;
  items: POItemInput[];
  notes?: string;
  expectedDate?: string;
}

// Receiving types
export interface ReceivingItemInput {
  itemId: string;
  quantity: number;
  cost: number;
}

export interface CreateReceivingRequest {
  poId?: string;
  warehouseId: string;
  items: ReceivingItemInput[];
  notes?: string;
}

// Dashboard types
export interface DashboardStats {
  totalInventory: number;
  lowStockItems: number;
  pendingInvoices: number;
  pendingPOs: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

// Search and filter types
export interface SearchFilters {
  search?: string;
  categoryId?: string;
  warehouseId?: string;
  vehicleId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Socket event types
export interface SocketEvents {
  'inventory-updated': (data: any) => void;
  'invoice-created': (data: any) => void;
  'po-status-changed': (data: any) => void;
} 