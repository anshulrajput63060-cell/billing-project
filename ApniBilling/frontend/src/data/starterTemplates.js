export const STORE_PRESETS = [
  {
    id: 'blank',
    name: 'Blank / Custom Store (शून्य से शुरुआत)',
    desc: 'Start completely empty with 0 products and add your own items',
    products: []
  },
  {
    id: 'kirana',
    name: 'Kirana & Grocery Store (किराना स्टोर)',
    desc: 'Pre-loaded common grocery items with HSN and GST rates',
    products: [
      { id: 'kp1', name: 'Mustard Oil 1L', sellingPrice: 140, purchasePrice: 120, gstRate: 5, hsnSac: '1514', category: 'Oils', unit: 'LTR', currentStock: 25, lowStockAlert: 5, barcode: '890101' },
      { id: 'kp2', name: 'Basmati Rice 5kg', sellingPrice: 420, purchasePrice: 360, gstRate: 5, hsnSac: '1006', category: 'Grains', unit: 'BAG', currentStock: 15, lowStockAlert: 3, barcode: '890102' },
      { id: 'kp3', name: 'Sugar (चीनी) 1kg', sellingPrice: 45, purchasePrice: 39, gstRate: 5, hsnSac: '1701', category: 'Grocery', unit: 'KG', currentStock: 60, lowStockAlert: 10, barcode: '890103' },
      { id: 'kp4', name: 'Tea Leaves (चाय पत्ती) 250g', sellingPrice: 95, purchasePrice: 78, gstRate: 5, hsnSac: '0902', category: 'Beverages', unit: 'PKT', currentStock: 30, lowStockAlert: 6, barcode: '890104' },
      { id: 'kp5', name: 'Bathing Soap Pack', sellingPrice: 60, purchasePrice: 48, gstRate: 18, hsnSac: '3401', category: 'Personal Care', unit: 'PCS', currentStock: 40, lowStockAlert: 8, barcode: '890105' }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics & Mobile (इलेक्ट्रॉनिक्स एवं मोबाइल)',
    desc: 'Accessories, chargers, cables with standard 18% GST',
    products: [
      { id: 'ep1', name: 'Fast Charging Cable USB-C', sellingPrice: 199, purchasePrice: 85, gstRate: 18, hsnSac: '8544', category: 'Accessories', unit: 'PCS', currentStock: 20, lowStockAlert: 4, barcode: '890201' },
      { id: 'ep2', name: '20W Fast Charger Adapter', sellingPrice: 449, purchasePrice: 210, gstRate: 18, hsnSac: '8504', category: 'Chargers', unit: 'PCS', currentStock: 15, lowStockAlert: 3, barcode: '890202' },
      { id: 'ep3', name: 'Bluetooth Neckband / Earphones', sellingPrice: 799, purchasePrice: 380, gstRate: 18, hsnSac: '8518', category: 'Audio', unit: 'PCS', currentStock: 12, lowStockAlert: 2, barcode: '890203' },
      { id: 'ep4', name: 'Tempered Glass Screen Guard', sellingPrice: 99, purchasePrice: 25, gstRate: 18, hsnSac: '7007', category: 'Protection', unit: 'PCS', currentStock: 50, lowStockAlert: 10, barcode: '890204' }
    ]
  },
  {
    id: 'garments',
    name: 'Clothing & Footwear (कपड़े एवं जूते)',
    desc: 'Apparel with 5% and 12% GST slabs',
    products: [
      { id: 'gp1', name: 'Men Cotton Casual T-Shirt', sellingPrice: 399, purchasePrice: 210, gstRate: 5, hsnSac: '6109', category: 'Apparel', unit: 'PCS', currentStock: 25, lowStockAlert: 5, barcode: '890301' },
      { id: 'gp2', name: 'Men Slim Fit Denim Jeans', sellingPrice: 899, purchasePrice: 480, gstRate: 12, hsnSac: '6203', category: 'Apparel', unit: 'PCS', currentStock: 18, lowStockAlert: 4, barcode: '890302' },
      { id: 'gp3', name: 'Daily Wear Cotton Kurti', sellingPrice: 499, purchasePrice: 260, gstRate: 5, hsnSac: '6204', category: 'Women Wear', unit: 'PCS', currentStock: 20, lowStockAlert: 4, barcode: '890303' }
    ]
  }
];
