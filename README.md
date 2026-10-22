# 🚀 **ShopSense - Intelligent E-commerce Platform**

> **Revolutionizing E-commerce with AI-Powered Search, Voice Recognition, and Environmental Sustainability**

## 🎯 **Project Overview**

**ShopSense** is a cutting-edge e-commerce platform that demonstrates the future of online shopping through **AI-powered search technology**, **multi-modal interaction**, and **environmental consciousness**. Built with modern web technologies, this project showcases advanced algorithms, real-time processing, and sustainable e-commerce practices.

### 🌟 **Key Innovations**

- **⚡ Sub-millisecond Autosuggest** with Trie Data Structure
- **🎤 Real-time Voice Search** using Web Speech API
- **📷 Advanced Image Search** with drag-and-drop functionality
- **🌱 Environmental Impact Assessment** for sustainable shopping
- **🧠 NLP-powered Query Understanding** for intelligent search
- **📊 Real-time Analytics** and search pattern optimization

---

## 🛠️ **Technology Stack**

### **Frontend**

| Technology       | Purpose               | Version |
| ---------------- | --------------------- | ------- |
| **React 18**     | UI Framework          | Latest  |
| **TypeScript**   | Type Safety           | 5.5+    |
| **Tailwind CSS** | Styling               | 3.4+    |
| **React Query**  | Data Fetching         | 5.56+   |
| **Radix UI**     | Accessible Components | Latest  |
| **React Router** | Navigation            | 6.26+   |

### **Backend**

| Technology     | Purpose        | Version |
| -------------- | -------------- | ------- |
| **Node.js**    | Runtime        | 18+     |
| **Express.js** | Web Framework  | 4.18+   |
| **MongoDB**    | Database       | 8.16+   |
| **Mongoose**   | ODM            | 8.16+   |
| **JWT**        | Authentication | 9.0+    |
| **Multer**     | File Uploads   | 2.0+    |

### **Advanced Algorithms**

- **Trie Data Structure** - O(k) prefix matching
- **Levenshtein Distance** - Fuzzy search capability
- **Machine Learning Scoring** - Contextual relevance
- **NLP Query Processing** - Intent recognition

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   React     │  │  Voice      │  │   Image     │          │
│  │ Components  │  │  Search     │  │   Search    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Express   │  │   JWT       │  │   CORS      │          │
│  │   Router    │  │   Auth      │  │   Handler   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INTELLIGENCE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Trie      │  │   NLP       │  │   Scoring   │          │
│  │   Engine    │  │   Engine    │  │   Algorithm │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  MongoDB    │  │   Redis     │  │   Analytics │          │
│  │  Products   │  │   Cache     │  │   Engine    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB 6.0+** - [Download here](https://www.mongodb.com/try/download/community)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### **Step-by-Step Setup**

#### **1. Clone the Repository**

```bash
# Clone the repository
https://github.com/Bhupender942/ShopSense-Intelligent-E-commerce-Search-Product-Discovery-Platform.git

```

#### **2. Install Dependencies**

```bash
# Install all dependencies (both frontend and backend)
npm install

# Verify installation
npm list --depth=0
```

#### **3. Set Up MongoDB**

**Option A: Local MongoDB**

```bash
# Start MongoDB service
# On macOS/Linux:
sudo systemctl start mongod

# On Windows:
net start MongoDB

# Or start MongoDB manually
mongod --dbpath /path/to/your/data/directory
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace in `.env` file

#### **4. Environment Configuration**

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your settings
nano .env
# or
code .env
```

**Required Environment Variables:**

```env
# MongoDB Connection (Choose one)
MONGODB_URI=mongodb://localhost:27017/shopsense
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsense

# JWT Secret for authentication (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Cookie Secret (Generate a strong secret)
COOKIE_SECRET=your-cookie-secret-here

# Client URL for production
CLIENT_URL=http://localhost:5173

# Optional: Ping message
PING_MESSAGE=pong
```

#### **5. Database Setup**

```bash
# The application will automatically:
# - Connect to MongoDB
# - Import product data
# - Preload autosuggest cache
# - Create necessary indexes

# You can also manually import data:
npm run update-environmental-data
```

#### **6. Start Development Server**

```bash
# Start the development server
npm run dev

# The server will start on:
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# API: http://localhost:8080/api
```

### **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix

# Update environmental data
npm run update-environmental-data
```

### **Production Deployment**

#### **1. Build the Application**

```bash
# Build both frontend and backend
npm run build

# Verify build output
ls dist/
```

#### **2. Environment Setup for Production**

```env
# Production environment variables
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
COOKIE_SECRET=your-production-cookie-secret
CLIENT_URL=https://your-domain.com
```

#### **3. Start Production Server**

```bash
# Start production server
npm start

# The application will be available at:
# http://localhost:8080 (or your configured port)
```

### **Troubleshooting**

#### **Common Issues & Solutions**

**1. MongoDB Connection Error**

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Check connection string in .env file
cat .env | grep MONGODB_URI
```

**2. Port Already in Use**

```bash
# Check what's using the port
lsof -i :8080
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use different ports
PORT=3000 npm run dev
```

**3. Dependencies Issues**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Build Errors**

```bash
# Check TypeScript errors
npm run typecheck

# Fix formatting issues
npm run format.fix

# Clear build cache
rm -rf dist/
npm run build
```

```

### **Development Workflow**

#### **Adding New Features**

1. **Frontend Components**

```bash
# Create new component
mkdir -p client/components/feature
touch client/components/feature/NewFeature.tsx
```

2. **Backend API**

```bash
# Create new controller
touch server/controllers/newFeatureController.ts

# Create new route
touch server/routes/newFeatureRoutes.ts
```

3. **Database Models**

```bash
# Create new model
touch server/models/NewFeature.ts
```

#### **Testing Your Changes**

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "feature name"

# Check for TypeScript errors
npm run typecheck

# Format code
npm run format.fix
```

### **Performance Monitoring**

```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8080/api/autosuggest/suggestions?q=test"

# Monitor memory usage
node --inspect npm run dev

# Check database performance
# Use MongoDB Compass or mongo shell
```

### **Security Checklist**

- [ ] Change default JWT secret
- [ ] Use strong cookie secret
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS configuration
- [ ] Implement rate limiting
- [ ] Validate file uploads
- [ ] Sanitize user inputs

---

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix
```

---

## 📁 **Project Structure**

```
Flipkart_GRiD_7.0/
├── 📁 client/                    # Frontend React application
│   ├── 📁 components/           # Reusable UI components
│   │   ├── 📁 ui/              # Base UI components (Radix UI)
│   │   ├── 📁 product/         # Product-related components
│   │   ├── 📁 search/          # Search-specific components
│   │   └── 📁 layout/          # Layout components
│   ├── 📁 pages/               # Route components
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 contexts/            # React contexts
│   ├── 📁 services/            # API service functions
│   └── 📁 lib/                 # Utility functions
├── 📁 server/                   # Backend Express application
│   ├── 📁 controllers/         # Request handlers
│   ├── 📁 models/              # MongoDB schemas
│   ├── 📁 routes/              # API route definitions
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 utils/               # Utility functions
│   └── 📁 uploads/             # File upload directory
├── 📁 public/                   # Static assets
└── 📁 shared/                   # Shared types and utilities
```

---

## 🤝 **Contributing**

We welcome contributions!

### **Development Setup**

```bash
# Fork the repository
https://github.com/Bhupender942/ShopSense-Intelligent-E-commerce-Search-Product-Discovery-Platform.git

# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

---
