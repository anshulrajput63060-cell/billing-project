// Indian Currency Formatter (₹)
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Standard Date Formatter (DD-MMM-YYYY)
export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Time Formatter (HH:MM AM/PM)
export const formatTime = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Calculate Indian GST breakdown
export const calculateGST = ({
  items = [],
  customerState = '07', // Delhi default
  businessState = '07', // Delhi default
  orderDiscount = 0,
}) => {
  let subtotal = 0;
  let totalItemDiscount = 0;
  let totalTaxable = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalCess = 0;

  const isInterState = customerState && businessState && customerState !== businessState;

  const calculatedItems = items.map((item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.sellingPrice || item.price) || 0;
    const itemDiscount = Number(item.discountAmount) || 0;
    
    // Tax rate (e.g. 18 for 18%)
    const gstRate = Number(item.gstRate ?? 18);
    const cessRate = Number(item.cessRate ?? 0);

    const lineGross = qty * price;
    const lineDiscount = itemDiscount;
    const lineTaxable = Math.max(0, lineGross - lineDiscount);

    // GST amount calculation
    const lineGSTAmount = (lineTaxable * gstRate) / 100;
    const lineCessAmount = (lineTaxable * cessRate) / 100;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = lineGSTAmount;
    } else {
      cgst = lineGSTAmount / 2;
      sgst = lineGSTAmount / 2;
    }

    const lineTotal = lineTaxable + lineGSTAmount + lineCessAmount;

    subtotal += lineGross;
    totalItemDiscount += lineDiscount;
    totalTaxable += lineTaxable;
    totalCGST += cgst;
    totalSGST += sgst;
    totalIGST += igst;
    totalCess += lineCessAmount;

    return {
      ...item,
      quantity: qty,
      unitPrice: price,
      lineGross,
      lineDiscount,
      taxableValue: lineTaxable,
      cgst,
      sgst,
      igst,
      cess: lineCessAmount,
      total: lineTotal,
    };
  });

  const grossTotal = totalTaxable + totalCGST + totalSGST + totalIGST + totalCess - Number(orderDiscount || 0);
  const roundedTotal = Math.round(grossTotal);
  const roundOff = Number((roundedTotal - grossTotal).toFixed(2));

  return {
    items: calculatedItems,
    isInterState,
    subtotal: Number(subtotal.toFixed(2)),
    totalItemDiscount: Number(totalItemDiscount.toFixed(2)),
    orderDiscount: Number(orderDiscount || 0),
    taxableAmount: Number(totalTaxable.toFixed(2)),
    cgst: Number(totalCGST.toFixed(2)),
    sgst: Number(totalSGST.toFixed(2)),
    igst: Number(totalIGST.toFixed(2)),
    cess: Number(totalCess.toFixed(2)),
    roundOff,
    grandTotal: roundedTotal,
  };
};

export const INDIAN_STATES = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '19', name: 'West Bengal' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
];
