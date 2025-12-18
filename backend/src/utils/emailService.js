const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server connection failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Read email templates
const templates = {
  welcome: fs.readFileSync(path.join(__dirname, '../templates/emails/welcome.ejs'), 'utf8'),
  'password-reset': fs.readFileSync(path.join(__dirname, '../templates/emails/password-reset.ejs'), 'utf8'),
  'order-confirmation': fs.readFileSync(path.join(__dirname, '../templates/emails/order-confirmation.ejs'), 'utf8'),
  'order-shipped': fs.readFileSync(path.join(__dirname, '../templates/emails/order-shipped.ejs'), 'utf8')
};

const sendEmail = async (options) => {
  try {
    const { to, subject, template, context, attachments } = options;

    // Compile template
    const html = ejs.render(templates[template], {
      ...context,
      currentYear: new Date().getFullYear(),
      siteUrl: process.env.CLIENT_URL,
      supportEmail: process.env.FROM_EMAIL
    });

    // Mail options
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      attachments
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to TailorCraft!',
    template: 'welcome',
    context: {
      name: user.name,
      loginUrl: `${process.env.CLIENT_URL}/login`
    }
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'password-reset',
    context: {
      name: user.name,
      resetUrl,
      expiryHours: 1
    }
  });
};

const sendOrderConfirmationEmail = async (order, user) => {
  return sendEmail({
    to: user.email,
    subject: `Order Confirmation - ${order.order_number}`,
    template: 'order-confirmation',
    context: {
      name: user.name,
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at).toLocaleDateString(),
      total: order.total,
      items: order.items,
      trackingUrl: `${process.env.CLIENT_URL}/dashboard/orders/${order.id}`
    }
  });
};

const sendOrderShippedEmail = async (order, user, trackingNumber) => {
  return sendEmail({
    to: user.email,
    subject: `Your Order Has Been Shipped - ${order.order_number}`,
    template: 'order-shipped',
    context: {
      name: user.name,
      orderNumber: order.order_number,
      trackingNumber,
      estimatedDelivery: new Date(order.estimated_delivery).toLocaleDateString(),
      trackingUrl: `${process.env.CLIENT_URL}/dashboard/orders/${order.id}`
    }
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  transporter
};
