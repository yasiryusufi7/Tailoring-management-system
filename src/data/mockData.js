export const branches = [
  { id: 1, name: 'Kabul Main', address: 'Shar-e-Naw, Kabul', phone: '+93 700 111 222', managerId: null, createdAt: '2024-01-01' },
  { id: 2, name: 'Herat Branch', address: 'Old City, Herat', phone: '+93 700 333 444', managerId: 2, createdAt: '2024-03-15' },
  { id: 3, name: 'Mazar-i-Sharif', address: 'Mazar-i-Sharif Bazaar', phone: '+93 700 555 666', managerId: null, createdAt: '2024-06-20' },
]

export const customers = [
  { id: 1, name: 'Ahmad Shah', phone: '+93 700 123 456', email: 'ahmad@email.com', address: 'Kabul, Shar-e-Naw', totalOrders: 12, lastVisit: '2026-07-25', avatar: null, notes: 'Preferred fabric: imported Italian', balance: 5000, branchId: 1 },
  { id: 2, name: 'Mohammad Nadir', phone: '+93 701 234 567', email: 'nadir@email.com', address: 'Kabul, Wazir Akbar Khan', totalOrders: 8, lastVisit: '2026-07-24', avatar: null, notes: 'Formal suits specialist', balance: 0, branchId: 1 },
  { id: 3, name: 'Omar Farooq', phone: '+93 702 345 678', email: 'omar@email.com', address: 'Mazar-i-Sharif', totalOrders: 15, lastVisit: '2026-07-26', avatar: null, notes: 'Regular customer', balance: 2500, branchId: 3 },
  { id: 4, name: 'Bilal Karimi', phone: '+93 703 456 789', email: 'bilal@email.com', address: 'Herat', totalOrders: 5, lastVisit: '2026-07-20', avatar: null, notes: 'Wedding orders', balance: 15000, branchId: 2 },
  { id: 5, name: 'Khalid Popal', phone: '+93 704 567 890', email: 'khalid@email.com', address: 'Kandahar', totalOrders: 22, lastVisit: '2026-07-27', avatar: null, notes: 'VIP customer', balance: 0, branchId: 1 },
  { id: 6, name: 'Rahimullah Akhund', phone: '+93 705 678 901', email: 'rahim@email.com', address: 'Jalalabad', totalOrders: 3, lastVisit: '2026-07-15', avatar: null, notes: 'New customer', balance: 8000, branchId: 1 },
  { id: 7, name: 'Zabiullah Noori', phone: '+93 706 789 012', email: 'zabi@email.com', address: 'Kabul, Kart-e-Parwan', totalOrders: 10, lastVisit: '2026-07-23', avatar: null, notes: 'Prefers dark colors', balance: 3000, branchId: 1 },
  { id: 8, name: 'HashimStanikzai', phone: '+93 707 890 123', email: 'hashim@email.com', address: 'Ghazni', totalOrders: 7, lastVisit: '2026-07-21', avatar: null, notes: 'Military uniforms', balance: 0, branchId: 2 },
]

export const tailors = [
  { id: 1, name: 'Gul Ahmad', specialization: 'Suits & Blazers', dailyProduction: 3, pieceRate: 800, dailyWage: 1500, monthlyWage: 45000, pendingPayment: 12000, rating: 4.8, completed: 45, inProgress: 3, avatar: null, joinDate: '2024-01-15', branchId: 1 },
  { id: 2, name: 'Zainuddin', specialization: 'Shirts & Kurtas', dailyProduction: 5, pieceRate: 400, dailyWage: 1200, monthlyWage: 36000, pendingPayment: 8000, rating: 4.5, completed: 62, inProgress: 4, avatar: null, joinDate: '2023-06-20', branchId: 1 },
  { id: 3, name: 'Nasir Ahmad', specialization: 'Traditional Wear', dailyProduction: 2, pieceRate: 1000, dailyWage: 1800, monthlyWage: 54000, pendingPayment: 18000, rating: 4.9, completed: 38, inProgress: 2, avatar: null, joinDate: '2022-11-10', branchId: 2 },
  { id: 4, name: 'Farid Khan', specialization: 'Trouser & Pents', dailyProduction: 4, pieceRate: 500, dailyWage: 1300, monthlyWage: 39000, pendingPayment: 5500, rating: 4.3, completed: 55, inProgress: 5, avatar: null, joinDate: '2024-03-05', branchId: 1 },
  { id: 5, name: 'Abdul Baseer', specialization: 'Wedding Attire', dailyProduction: 1, pieceRate: 2000, dailyWage: 2000, monthlyWage: 60000, pendingPayment: 25000, rating: 4.7, completed: 18, inProgress: 2, avatar: null, joinDate: '2023-09-01', branchId: 3 },
]

export const orders = [
  { id: 'ORD-001', customerId: 1, tailorId: 1, type: 'Three-Piece Suit', status: 'stitching', amount: 8500, deliveryDate: '2026-08-01', priority: 'high', createdAt: '2026-07-20', notes: 'Navy blue, slim fit', branchId: 1 },
  { id: 'ORD-002', customerId: 2, tailorId: 2, type: 'Shalwar Kameez', status: 'cutting', amount: 3500, deliveryDate: '2026-07-30', priority: 'medium', createdAt: '2026-07-25', notes: 'White cotton', branchId: 1 },
  { id: 'ORD-003', customerId: 3, tailorId: 3, type: 'Traditional Perahan Tunban', status: 'ready', amount: 6000, deliveryDate: '2026-07-29', priority: 'high', createdAt: '2026-07-18', notes: 'Embroidered collar', branchId: 3 },
  { id: 'ORD-004', customerId: 4, tailorId: 5, type: 'Wedding Sherwani', status: 'assigned', amount: 25000, deliveryDate: '2026-08-15', priority: 'high', createdAt: '2026-07-15', notes: 'Gold embroidery', branchId: 2 },
  { id: 'ORD-005', customerId: 5, tailorId: 4, type: 'Trouser', status: 'delivered', amount: 2000, deliveryDate: '2026-07-26', priority: 'low', createdAt: '2026-07-22', notes: 'Black formal', branchId: 1 },
  { id: 'ORD-006', customerId: 6, tailorId: 1, type: 'Blazer', status: 'ironing', amount: 5500, deliveryDate: '2026-07-29', priority: 'medium', createdAt: '2026-07-21', notes: 'Charcoal gray', branchId: 1 },
  { id: 'ORD-007', customerId: 7, tailorId: 2, type: 'Kurta', status: 'received', amount: 2500, deliveryDate: '2026-08-03', priority: 'low', createdAt: '2026-07-27', notes: 'Cream colored', branchId: 1 },
  { id: 'ORD-008', customerId: 8, tailorId: 3, type: 'Military Uniform', status: 'stitching', amount: 4500, deliveryDate: '2026-08-02', priority: 'high', createdAt: '2026-07-23', notes: 'Camouflage pattern', branchId: 2 },
  { id: 'ORD-009', customerId: 1, tailorId: 4, type: 'Shirt', status: 'received', amount: 1800, deliveryDate: '2026-08-05', priority: 'low', createdAt: '2026-07-28', notes: 'Light blue formal', branchId: 1 },
  { id: 'ORD-010', customerId: 3, tailorId: 5, type: 'Waistcoat', status: 'delivered', amount: 2200, deliveryDate: '2026-07-25', priority: 'medium', createdAt: '2026-07-19', notes: 'Silk finish', branchId: 3 },
  { id: 'ORD-011', customerId: 5, tailorId: 1, type: 'Coat', status: 'cutting', amount: 7000, deliveryDate: '2026-08-04', priority: 'high', createdAt: '2026-07-26', notes: 'Winter collection', branchId: 1 },
  { id: 'ORD-012', customerId: 2, tailorId: 2, type: 'Shalwar Kameez x3', status: 'stitching', amount: 9000, deliveryDate: '2026-08-01', priority: 'medium', createdAt: '2026-07-24', notes: 'Different colors', branchId: 1 },
]

export const fabricInventory = [
  { id: 1, name: 'Italian Wool', color: '#1e3a5f', quantity: 45, unit: 'meters', price: 2500, supplierId: 1, reorderLevel: 20, status: 'inStock', branchId: 1 },
  { id: 2, name: 'Cotton White', color: '#ffffff', quantity: 120, unit: 'meters', price: 800, supplierId: 2, reorderLevel: 30, status: 'inStock', branchId: 1 },
  { id: 3, name: 'Silk Maroon', color: '#800020', quantity: 15, unit: 'meters', price: 3500, supplierId: 1, reorderLevel: 10, status: 'inStock', branchId: 2 },
  { id: 4, name: 'Linen Beige', color: '#d4c5a9', quantity: 8, unit: 'meters', price: 1200, supplierId: 3, reorderLevel: 15, status: 'lowStock', branchId: 1 },
  { id: 5, name: 'Denim Blue', color: '#1560bd', quantity: 60, unit: 'meters', price: 1500, supplierId: 2, reorderLevel: 20, status: 'inStock', branchId: 1 },
  { id: 6, name: 'Velvet Black', color: '#0d0d0d', quantity: 5, unit: 'meters', price: 4000, supplierId: 1, reorderLevel: 10, status: 'lowStock', branchId: 2 },
  { id: 7, name: 'Chiffon Cream', color: '#fffdd0', quantity: 0, unit: 'meters', price: 900, supplierId: 3, reorderLevel: 10, status: 'outOfStock', branchId: 3 },
  { id: 8, name: 'Twill Gray', color: '#808080', quantity: 35, unit: 'meters', price: 1100, supplierId: 2, reorderLevel: 15, status: 'inStock', branchId: 1 },
]

export const suppliers = [
  { id: 1, name: 'Afghan Textiles Co.', phone: '+93 780 111 222', email: 'info@afghantextiles.com', address: 'Kabul Industrial Area', outstandingBalance: 45000, totalPurchases: 280000, branchId: 1 },
  { id: 2, name: 'Kandahar Fabrics', phone: '+93 781 222 333', email: 'contact@kandaharfabric.com', address: 'Kandahar Bazaar', outstandingBalance: 12000, totalPurchases: 150000, branchId: 1 },
  { id: 3, name: 'Herat Silk House', phone: '+93 782 333 444', email: 'sales@heratsilk.com', address: 'Herat Old City', outstandingBalance: 0, totalPurchases: 95000, branchId: 2 },
]

export const measurements = [
  { id: 1, customerId: 1, date: '2026-07-20', measuredBy: 'Gul Ahmad', data: { neck: 15, chest: 40, waist: 34, hip: 38, shoulder: 18, sleeve: 25, arm: 12, shirtLength: 30, trouserLength: 42, bottom: 16, collar: 15.5, cuff: 8.5 }, notes: 'Slim fit preferred', units: 'inches', branchId: 1 },
  { id: 2, customerId: 2, date: '2026-07-25', measuredBy: 'Zainuddin', data: { neck: 16, chest: 42, waist: 36, hip: 40, shoulder: 19, sleeve: 26, arm: 13, shirtLength: 32, trouserLength: 43, bottom: 17, collar: 16, cuff: 9 }, notes: 'Regular fit', units: 'inches', branchId: 1 },
  { id: 3, customerId: 3, date: '2026-07-18', measuredBy: 'Nasir Ahmad', data: { neck: 15.5, chest: 38, waist: 32, hip: 36, shoulder: 17.5, sleeve: 24, arm: 11.5, shirtLength: 29, trouserLength: 41, bottom: 15, collar: 15, cuff: 8 }, notes: 'Traditional fit', units: 'inches', branchId: 3 },
  { id: 4, customerId: 4, date: '2026-07-15', measuredBy: 'Abdul Baseer', data: { neck: 16.5, chest: 44, waist: 38, hip: 42, shoulder: 20, sleeve: 27, arm: 13.5, shirtLength: 33, trouserLength: 44, bottom: 18, collar: 16.5, cuff: 9.5 }, notes: 'Wedding sherwani measurements', units: 'inches', branchId: 2 },
  { id: 5, customerId: 5, date: '2026-07-22', measuredBy: 'Farid Khan', data: { neck: 15, chest: 39, waist: 33, hip: 37, shoulder: 17.5, sleeve: 24.5, arm: 12, shirtLength: 30, trouserLength: 42, bottom: 16, collar: 15, cuff: 8.5 }, notes: 'Athletic build', units: 'inches', branchId: 1 },
]

export const invoices = [
  { id: 'INV-001', orderId: 'ORD-001', customerId: 1, amount: 8500, status: 'unpaid', date: '2026-07-20', dueDate: '2026-08-01', discount: 0, tax: 0 },
  { id: 'INV-002', orderId: 'ORD-003', customerId: 3, amount: 6000, status: 'paid', date: '2026-07-29', dueDate: '2026-07-29', discount: 500, tax: 0 },
  { id: 'INV-003', orderId: 'ORD-005', customerId: 5, amount: 2000, status: 'paid', date: '2026-07-26', dueDate: '2026-07-26', discount: 0, tax: 0 },
  { id: 'INV-004', orderId: 'ORD-004', customerId: 4, amount: 25000, status: 'unpaid', date: '2026-07-15', dueDate: '2026-08-15', discount: 0, tax: 0 },
  { id: 'INV-005', orderId: 'ORD-006', customerId: 6, amount: 5500, status: 'unpaid', date: '2026-07-21', dueDate: '2026-07-29', discount: 200, tax: 0 },
  { id: 'INV-006', orderId: 'ORD-010', customerId: 3, amount: 2200, status: 'paid', date: '2026-07-25', dueDate: '2026-07-25', discount: 0, tax: 0 },
]

export const recentOrders = [
  { id: 'ORD-009', customer: 'Ahmad Shah', type: 'Shirt', status: 'received', amount: 1800, date: '2026-07-28' },
  { id: 'ORD-007', customer: 'Zabiullah Noori', type: 'Kurta', status: 'received', amount: 2500, date: '2026-07-27' },
  { id: 'ORD-011', customer: 'Khalid Popal', type: 'Coat', status: 'cutting', amount: 7000, date: '2026-07-26' },
  { id: 'ORD-012', customer: 'Mohammad Nadir', type: 'Shalwar Kameez x3', status: 'stitching', amount: 9000, date: '2026-07-24' },
  { id: 'ORD-008', customer: 'Hashim Stanikzai', type: 'Military Uniform', status: 'stitching', amount: 4500, date: '2026-07-23' },
]

export const notifications = [
  { id: 1, title: 'New Order Received', message: 'ORD-009 from Ahmad Shah', type: 'info', time: '2 minutes ago', read: false },
  { id: 2, title: 'Order Ready for Pickup', message: 'ORD-003 for Omar Farooq', type: 'success', time: '15 minutes ago', read: false },
  { id: 3, title: 'Low Stock Alert', message: 'Velvet Black fabric is below reorder level', type: 'warning', time: '1 hour ago', read: false },
  { id: 4, title: 'Payment Received', message: 'PKR 6,000 from Omar Farooq', type: 'success', time: '2 hours ago', read: true },
  { id: 5, title: 'Delivery Overdue', message: 'ORD-005 delivery was yesterday', type: 'error', time: '3 hours ago', read: true },
  { id: 6, title: 'Tailor Completed Work', message: 'Nasir Ahmad completed 2 pieces today', type: 'info', time: '5 hours ago', read: true },
]

export const accountingData = {
  monthlyIncome: 485000,
  monthlyExpenses: 312000,
  monthlyProfit: 173000,
  fabricCost: 145000,
  tailorWages: 125000,
  rent: 25000,
  utilities: 17000,
  recentTransactions: [
    { id: 1, date: '2026-07-28', description: 'Sale - ORD-005', category: 'Income', amount: 2000, type: 'income' },
    { id: 2, date: '2026-07-27', description: 'Fabric Purchase - Italian Wool', category: 'Fabric', amount: 12500, type: 'expense' },
    { id: 3, date: '2026-07-26', description: 'Tailor Wage - Gul Ahmad', category: 'Wages', amount: 1500, type: 'expense' },
    { id: 4, date: '2026-07-26', description: 'Sale - ORD-003', category: 'Income', amount: 5500, type: 'income' },
    { id: 5, date: '2026-07-25', description: 'Sale - ORD-010', category: 'Income', amount: 2200, type: 'income' },
    { id: 6, date: '2026-07-25', description: 'Utility Bill', category: 'Utilities', amount: 4500, type: 'expense' },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 380000, expenses: 245000 },
    { month: 'Feb', revenue: 420000, expenses: 268000 },
    { month: 'Mar', revenue: 395000, expenses: 252000 },
    { month: 'Apr', revenue: 450000, expenses: 290000 },
    { month: 'May', revenue: 475000, expenses: 305000 },
    { month: 'Jun', revenue: 510000, expenses: 328000 },
    { month: 'Jul', revenue: 485000, expenses: 312000 },
  ],
  ordersByStatus: [
    { status: 'Received', count: 3 },
    { status: 'Cutting', count: 2 },
    { status: 'Stitching', count: 3 },
    { status: 'Ironing', count: 1 },
    { status: 'Ready', count: 1 },
    { status: 'Delivered', count: 2 },
  ],
}

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@tailorpro.com', role: 'administrator', status: 'active', lastLogin: '2026-07-28 09:30', branchId: null, phone: '+93 700 123 456', shopName: 'TailorPro Head Office', joined: '2024-01-15' },
  { id: 2, name: 'Herat Manager', email: 'manager.herat@tailorpro.com', role: 'manager', status: 'active', lastLogin: '2026-07-28 08:15', branchId: 2, phone: '+93 701 234 567', shopName: 'Herat Tailoring House', joined: '2026-01-10' },
  { id: 3, name: 'Kabul Manager', email: 'manager.kabul@tailorpro.com', role: 'manager', status: 'active', lastLogin: '2026-07-27 17:00', branchId: 1, phone: '+93 702 345 678', shopName: 'Kabul Fashion Studio', joined: '2026-02-20' },
]

export const auditLogs = [
  { id: 1, user: 'Admin User', action: 'Created new order ORD-009', timestamp: '2026-07-28 09:32:15', details: 'Order for Ahmad Shah - Shirt' },
  { id: 2, user: 'Manager', action: 'Updated order ORD-003 status', timestamp: '2026-07-28 09:15:00', details: 'Status changed to Ready' },
  { id: 3, user: 'Cashier', action: 'Recorded payment', timestamp: '2026-07-28 08:45:30', details: 'PKR 6,000 received from Omar Farooq' },
  { id: 4, user: 'Admin User', action: 'Added new customer', timestamp: '2026-07-27 16:20:00', details: 'Hashim Stanikzai added' },
  { id: 5, user: 'Reception', action: 'Created measurement', timestamp: '2026-07-27 14:10:00', details: 'Measurements for Khalid Popal' },
  { id: 6, user: 'Admin User', action: 'System backup created', timestamp: '2026-07-27 03:00:00', details: 'Automatic daily backup' },
]

export const backups = [
  { id: 1, date: '2026-07-28 03:00:00', size: '2.4 MB', status: 'completed', type: 'automatic' },
  { id: 2, date: '2026-07-27 03:00:00', size: '2.3 MB', status: 'completed', type: 'automatic' },
  { id: 3, date: '2026-07-26 14:30:00', size: '2.3 MB', status: 'completed', type: 'manual' },
  { id: 4, date: '2026-07-26 03:00:00', size: '2.2 MB', status: 'completed', type: 'automatic' },
  { id: 5, date: '2026-07-25 03:00:00', size: '2.1 MB', status: 'completed', type: 'automatic' },
]
