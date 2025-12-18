TailorCraft - Custom E-Commerce Platform

📋 Project Overview

TailorCraft is a full-featured e-commerce platform for custom tailoring and ready-made clothing. It allows customers to order custom-tailored clothing with precise measurements, upload design references, and track their orders in real-time.

https://img.shields.io/badge/TailorCraft-E--Commerce-blue
https://img.shields.io/badge/React-18.2.0-blue
https://img.shields.io/badge/Express-4.18.2-green
https://img.shields.io/badge/PostgreSQL-15.0-blue

✨ Features

🛍️ Customer Features

· Product Browsing: Filter by category, size, color, fabric, price
· Custom Tailoring: Upload designs, add measurements, customize existing products
· Shopping Cart: Add items, manage quantities, apply coupons
· Checkout: Multiple payment methods (COD, Card, UPI, Net Banking)
· User Dashboard: Order tracking, saved measurements, wishlist, invoice download
· Authentication: JWT-based login/register with password reset

👨‍💼 Admin Features (Future)

· Product management
· Order management
· Customer management
· Analytics dashboard

🏗️ Technology Stack

Frontend

· React 18 - UI library
· React Router DOM - Routing
· Bootstrap 5 - CSS framework
· Bootstrap Icons - Icon library
· Axios - HTTP client
· Context API - State management
· JWT Decode - Token decoding

Backend

· Node.js - Runtime environment
· Express.js - Web framework
· PostgreSQL - Database
· JWT - Authentication
· Bcryptjs - Password hashing
· Multer & Cloudinary - File uploads
· Nodemailer - Email service
· PDFKit - Invoice generation
· Express Validator - Input validation

🚀 Quick Start

Prerequisites

1. Node.js (v16 or higher)
2. PostgreSQL (v12 or higher)
3. npm or yarn package manager
4. Git

Installation Steps

1. Clone the Repository

```bash
git clone https://github.com/yourusername/tailorcraft.git
cd tailorcraft
```

2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file with your configurations
# See Environment Variables section below

# Run database migrations
npm run migrate

# Seed sample data (optional)
npm run seed

# Start development server
npm run dev

# Or start production server
npm start
```

3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file with your configurations

# Start development server
npm start

# Build for production
npm run build
```

⚙️ Environment Variables

Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tailorcraft
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=TailorCraft

# Client URL
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLIENT_URL=http://localhost:3000
```

🗄️ Database Setup

1. Install PostgreSQL

Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

macOS:

```bash
brew install postgresql
brew services start postgresql
```

Windows:
Download frompostgresql.org

2. Create Database and User

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE tailorcraft;

# Create user
CREATE USER tailorcraft_user WITH PASSWORD 'yourpassword';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tailorcraft TO tailorcraft_user;

# Exit
\q
```

3. Run Migrations

```bash
cd backend
npm run migrate
```

4. Seed Sample Data (Optional)

```bash
npm run seed
```

📁 Project Structure

```
tailorcraft/
├── frontend/                 # React frontend
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable components
│       ├── pages/          # Page components
│       ├── context/        # Context providers
│       ├── services/       # API services
│       ├── assets/         # Images, styles
│       ├── App.jsx         # Main app component
│       └── main.jsx        # Entry point
│
├── backend/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── database/       # Migrations & seeders
│   ├── server.js           # Entry point
│   └── package.json        # Dependencies
│
└── README.md               # This file
```

🌐 API Documentation

Base URL

```
http://localhost:5000/api
```

Authentication Endpoints

Method Endpoint Description Auth Required
POST /auth/register Register new user No
POST /auth/login Login user No
GET /auth/profile Get user profile Yes
PUT /auth/profile Update profile Yes
POST /auth/logout Logout user Yes
POST /auth/forgot-password Request password reset No
POST /auth/reset-password/:token Reset password No

Product Endpoints

Method Endpoint Description Auth Required
GET /products Get all products (with filters) No
GET /products/:id Get single product No
GET /products/categories Get all categories No
GET /products/filters Get filter options No
GET /products/search Search products No
POST /products Create product Admin
PUT /products/:id Update product Admin
DELETE /products/:id Delete product Admin

Order Endpoints

Method Endpoint Description Auth Required
GET /orders Get user orders Yes
POST /orders Create order Yes
GET /orders/:id Get order details Yes
PUT /orders/:id/cancel Cancel order Yes
GET /orders/:id/invoice Download invoice PDF Yes
POST /orders/coupon Apply coupon Yes
GET /orders/stats Get order statistics Yes

User Endpoints

Method Endpoint Description Auth Required
GET /users/measurements Get saved measurements Yes
POST /users/measurements Save measurements Yes
GET /users/measurements/:id Get measurement Yes
PUT /users/measurements/:id Update measurement Yes
DELETE /users/measurements/:id Delete measurement Yes
GET /users/wishlist Get wishlist Yes
POST /users/wishlist Add to wishlist Yes
DELETE /users/wishlist/:product_id Remove from wishlist Yes

Payment Endpoints

Method Endpoint Description Auth Required
GET /payments/methods Get payment methods Yes
POST /payments/initiate Initiate payment Yes
GET /payments/verify/:payment_id Verify payment Yes

🔧 Development

Running in Development Mode

1. Start Backend:

```bash
cd backend
npm run dev
```

1. Start Frontend:

```bash
cd frontend
npm start
```

1. Access the application:

· Frontend: http://localhost:3000
· Backend API: http://localhost:5000
· API Health Check: http://localhost:5000/api/health

Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

🐳 Docker Deployment

Docker Compose Setup

Create docker-compose.yml:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: tailorcraft
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - tailorcraft-network

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: tailorcraft
      DB_USER: postgres
      DB_PASSWORD: yourpassword
      JWT_SECRET: your_jwt_secret
      CLOUDINARY_CLOUD_NAME: your_cloud_name
      CLOUDINARY_API_KEY: your_api_key
      CLOUDINARY_API_SECRET: your_api_secret
      SMTP_HOST: smtp.gmail.com
      SMTP_PORT: 587
      SMTP_USER: your_email@gmail.com
      SMTP_PASS: your_app_password
      FROM_EMAIL: your_email@gmail.com
      FROM_NAME: TailorCraft
      CLIENT_URL: http://localhost:3000
    depends_on:
      - postgres
    networks:
      - tailorcraft-network
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - tailorcraft-network

volumes:
  postgres_data:

networks:
  tailorcraft-network:
    driver: bridge
```

Dockerfile for Backend

backend/Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Dockerfile for Frontend

frontend/Dockerfile:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

🌐 Deployment

Heroku Deployment

1. Create Heroku apps:

```bash
# For backend
heroku create tailorcraft-backend
heroku addons:create heroku-postgresql:hobby-dev

# For frontend
heroku create tailorcraft-frontend
```

1. Deploy Backend:

```bash
cd backend
heroku git:remote -a tailorcraft-backend
git push heroku main
```

1. Deploy Frontend:

```bash
cd frontend
heroku git:remote -a tailorcraft-frontend
git push heroku main
```

Vercel Deployment (Frontend)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

1. Deploy:

```bash
cd frontend
vercel
```

Railway Deployment (Backend)

1. Install Railway CLI:

```bash
npm i -g @railway/cli
```

1. Deploy:

```bash
cd backend
railway up
```

🧪 Testing

Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

Test Coverage

```bash
# Backend coverage
cd backend
npm run test:coverage

# Frontend coverage
cd frontend
npm run test:coverage
```

📱 Mobile Responsiveness

The application is fully responsive and optimized for:

· 📱 Mobile devices (320px - 480px)
· 📱 Tablets (481px - 768px)
· 💻 Laptops (769px - 1024px)
· 🖥️ Desktops (1025px and above)

🔒 Security Features

1. Authentication & Authorization
   · JWT-based authentication
   · Password hashing with bcrypt
   · Role-based access control
2. Input Validation
   · Express Validator for all inputs
   · SQL injection prevention
   · XSS protection
3. Security Headers
   · Helmet.js for security headers
   · CORS configuration
   · Rate limiting
4. File Upload Security
   · File type validation
   · File size limits
   · Cloudinary integration

📈 Performance Optimization

Frontend

· Code splitting with React.lazy()
· Image optimization
· Bundle size optimization
· Memoization with React.memo()

Backend

· Database indexing
· Query optimization
· Response compression
· Caching implementation

🔄 API Response Format

Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

📊 Database Schema

Main Tables

1. users - User accounts and authentication
2. products - Product catalog
3. product_variants - Product variations (size, color, fabric)
4. orders - Customer orders
5. order_items - Items within orders
6. measurements - Customer measurements
7. wishlists - Customer wishlists
8. payments - Payment records
9. reviews - Product reviews

🎨 UI Components

Reusable Components

· ProductCard - Product display card
· Navbar - Navigation bar with cart counter
· Footer - Site footer with links
· Loader - Loading spinner
· ProtectedRoute - Route protection

Pages

· Home - Landing page with hero, categories, featured products
· Products - Product listing with filters
· ProductDetails - Product details with customization options
· Cart - Shopping cart
· Checkout - Checkout process
· Login/Register - Authentication pages
· Wishlist - Saved products
· CustomerDashboard - User dashboard

📧 Email Templates

1. Welcome Email - Sent after registration
2. Password Reset - Password reset instructions
3. Order Confirmation - Order receipt
4. Order Shipped - Shipping notification
5. Payment Confirmation - Payment receipt

🔗 Third-Party Integrations

Cloudinary

· Image upload and storage
· Image optimization
· CDN delivery

Email Service

· Nodemailer with SMTP
· Email templates with EJS
· Transactional emails

Payment Gateways (Future)

· Stripe
· Razorpay
· PayPal

📝 Code Quality

ESLint Configuration

```json
{
  "extends": ["react-app", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

🐛 Debugging

Backend Debugging

```bash
# Enable debug logging
DEBUG=express:* npm run dev

# View database queries
DEBUG=pg:* npm run dev
```

Frontend Debugging

```bash
# React Developer Tools
# Available as Chrome/Firefox extension

# Redux DevTools
# For state management debugging
```

📚 Documentation

API Documentation

· Swagger/OpenAPI specification available at /api-docs
· Postman collection included in /docs folder

Code Documentation

· JSDoc comments for functions
· Component documentation with PropTypes
· Database schema documentation

🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add some AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

Commit Guidelines

· Use conventional commit messages
· Reference issue numbers in commits
· Write meaningful commit messages

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments

· Icons by Bootstrap Icons
· UI Components by Bootstrap 5
· Design inspiration from modern e-commerce platforms
· Thanks to all contributors

📞 Support

For support, email support@tailorcraft.com or join our Slack channel.

🚀 Getting Help

Common Issues

1. Database Connection Failed
   · Check PostgreSQL service is running
   · Verify credentials in .env file
   · Ensure database exists
2. Frontend Can't Connect to Backend
   · Check CORS configuration
   · Verify backend is running
   · Check network connectivity
3. Image Upload Failing
   · Verify Cloudinary credentials
   · Check file size and type
   · Ensure proper file permissions

Useful Commands

```bash
# Reset database
npm run db:reset

# Check logs
npm run logs

# Check application health
curl http://localhost:5000/api/health

# Generate API documentation
npm run docs:generate
```

📊 Monitoring & Logging

Application Logs

```bash
# View backend logs
cd backend
npm run logs

# View frontend logs
cd frontend
npm run logs
```

Performance Monitoring

· Response time tracking
· Error rate monitoring
· Database query performance
· Memory usage monitoring

---

🎯 Next Steps

Planned Features

1. Admin Dashboard - Complete admin interface
2. Real-time Notifications - WebSocket integration
3. Advanced Analytics - Sales and customer analytics
4. Mobile App - React Native application
5. Multi-language Support - Internationalization
6. Social Login - Google, Facebook authentication
7. Advanced Search - Elasticsearch integration
8. Recommendation Engine - AI-based product recommendations

Immediate Tasks

· Set up CI/CD pipeline
· Add unit and integration tests
· Implement caching layer
· Set up monitoring and alerting
· Create admin dashboard
· Optimize database queries
· Implement CDN for static assets

---

Happy Coding! 🚀

Built with ❤️ by the TailorCraft Team
