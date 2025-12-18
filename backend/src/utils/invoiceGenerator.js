const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      // Collect PDF chunks
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add content to PDF
      addHeader(doc, order);
      addCustomerInfo(doc, order);
      addOrderDetails(doc, order);
      addItemsTable(doc, order);
      addTotals(doc, order);
      addFooter(doc, order);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

function addHeader(doc, order) {
  doc
    .fontSize(25)
    .font('Helvetica-Bold')
    .fillColor('#4361ee')
    .text('TAILORCRAFT', 50, 50)
    .fontSize(10)
    .font('Helvetica')
    .fillColor('black')
    .text('Invoice', 50, 85)
    .fontSize(10)
    .text(`Invoice #: ${order.order_number}`, 400, 50, { align: 'right' })
    .text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 400, 65, { align: 'right' })
    .moveDown();
}

function addCustomerInfo(doc, order) {
  const shippingAddress = order.shipping_address;
  
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Bill To:', 50, 120)
    .font('Helvetica')
    .fontSize(10)
    .text(shippingAddress.fullName, 50, 140)
    .text(shippingAddress.address, 50, 155)
    .text(`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`, 50, 170)
    .text(shippingAddress.email || '', 50, 185)
    .text(shippingAddress.phone || '', 50, 200);
}

function addOrderDetails(doc, order) {
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Order Details:', 300, 120)
    .font('Helvetica')
    .fontSize(10)
    .text(`Status: ${order.status.toUpperCase()}`, 300, 140)
    .text(`Payment Method: ${order.payment_method.toUpperCase()}`, 300, 155)
    .text(`Order Date: ${new Date(order.created_at).toLocaleDateString()}`, 300, 170);
}

function addItemsTable(doc, order) {
  const tableTop = 250;
  
  // Table headers
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Item', 50, tableTop)
    .text('Quantity', 300, tableTop)
    .text('Price', 350, tableTop)
    .text('Total', 420, tableTop)
    .moveDown();

  // Table rows
  let y = tableTop + 20;
  
  order.items.forEach((item, i) => {
    doc
      .fontSize(9)
      .font('Helvetica')
      .text(item.product_name || `Product ${item.product_id}`, 50, y, { width: 200 })
      .text(item.quantity.toString(), 300, y)
      .text(`₹${item.price.toFixed(2)}`, 350, y)
      .text(`₹${(item.price * item.quantity).toFixed(2)}`, 420, y);
    
    if (item.customization) {
      y += 15;
      doc
        .fontSize(8)
        .fillColor('gray')
        .text('Custom: ' + JSON.stringify(item.customization), 50, y, { width: 300 });
    }
    
    y += 25;
  });

  // Horizontal line
  doc
    .strokeColor('#cccccc')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function addTotals(doc, order) {
  const totalsTop = 450;
  
  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Subtotal:', 350, totalsTop)
    .text(`₹${order.subtotal.toFixed(2)}`, 450, totalsTop, { align: 'right' })
    .text('Discount:', 350, totalsTop + 20)
    .text(`₹${order.discount_amount.toFixed(2)}`, 450, totalsTop + 20, { align: 'right' })
    .font('Helvetica-Bold')
    .text('Total:', 350, totalsTop + 40)
    .text(`₹${order.total.toFixed(2)}`, 450, totalsTop + 40, { align: 'right' })
    .font('Helvetica')
    .text('Advance Paid:', 350, totalsTop + 60)
    .text(`₹${order.advance.toFixed(2)}`, 450, totalsTop + 60, { align: 'right' })
    .font('Helvetica-Bold')
    .text('Balance Due:', 350, totalsTop + 80)
    .text(`₹${order.due.toFixed(2)}`, 450, totalsTop + 80, { align: 'right' });
}

function addFooter(doc, order) {
  doc
    .fontSize(8)
    .fillColor('gray')
    .text('Thank you for your business!', 50, 550)
    .text('For any queries, contact: support@tailorcraft.com', 50, 565)
    .text('Terms & Conditions apply', 50, 580);
}

module.exports = {
  generateInvoice
};
