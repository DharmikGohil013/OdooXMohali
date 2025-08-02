# QuickDesk - Help Desk System

A complete MERN stack help desk and ticket management system built with modern technologies.

## 🚀 Features

### Backend Features
- **JWT Authentication** with role-based access control (User, Agent, Admin)
- **RESTful API** with Express.js and MongoDB
- **File Upload Support** with Multer (attachments for tickets)
- **Email Notifications** with Nodemailer
- **Input Validation** with Joi
- **Error Handling** with custom middleware
- **Rate Limiting** for API security
- **CORS Configuration** for cross-origin requests

### Frontend Features
- **React 18** with Vite for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for modern UI styling
- **React Hook Form** for form handling
- **React Toastify** for notifications
- **Responsive Design** for all devices

### User Roles & Permissions
- **Users**: Create and view their own tickets, add comments
- **Agents**: Manage all tickets, assign tickets, add internal comments
- **Admins**: Full system access, user management, category management

## 📁 Project Structure

```
QuickDesk/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── userController.js
│   │   └── categoryController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── userRoutes.js
│   │   └── categoryRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── common/
    │   │   ├── layout/
    │   │   └── ... (other components)
    │   ├── pages/
    │   ├── redux/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuickDesk/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quickdesk
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=QuickDesk
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Ticket Endpoints
- `GET /api/tickets` - Get all tickets (filtered by user role)
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket (Admin only)
- `POST /api/tickets/:id/comments` - Add comment to ticket
- `POST /api/tickets/:id/rate` - Rate resolved ticket
- `GET /api/tickets/stats` - Get ticket statistics

### User Management Endpoints (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/agents` - Get agents for assignment
- `GET /api/users/stats` - Get user statistics

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Agent/Admin)
- `PUT /api/categories/:id` - Update category (Agent/Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)
- `GET /api/categories/stats` - Get category statistics

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `EMAIL_*` - Email configuration for notifications
- `MAX_FILE_SIZE` - Maximum file upload size
- `ALLOWED_FILE_TYPES` - Allowed file extensions
- `FRONTEND_URL` - Frontend URL for CORS

#### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_MAX_FILE_SIZE` - Maximum file upload size
- `VITE_ALLOWED_FILE_TYPES` - Allowed file types

## 🚦 Usage

### For End Users
1. **Register** for a new account or **login** with existing credentials
2. **Create tickets** by providing title, description, priority, and category
3. **Track ticket status** and receive email notifications
4. **Add comments** to communicate with support agents
5. **Rate tickets** once they are resolved

### For Agents
1. **View all tickets** across the system
2. **Assign tickets** to themselves or other agents
3. **Update ticket status** and priority
4. **Add internal comments** for team coordination
5. **Manage categories** for better organization

### For Administrators
1. **Full system access** with all agent capabilities
2. **User management** - create, update, delete users
3. **Role assignment** - promote users to agents
4. **System statistics** and reporting
5. **Category management** with full CRUD operations

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** with bcrypt
- **Role-based access control** (RBAC)
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS protection** for cross-origin requests
- **File upload validation** for security
- **Environment variable protection**

## 🎨 UI/UX Features

- **Responsive design** for all devices
- **Modern Tailwind CSS** styling
- **Loading states** and error handling
- **Toast notifications** for user feedback
- **Intuitive navigation** with role-based menus
- **Search and filtering** capabilities
- **Pagination** for large datasets
- **Avatar system** with initials fallback

## 📊 Dashboard Features

- **Statistics overview** with charts and metrics
- **Ticket status breakdown** by priority and status
- **Response time analytics** for performance tracking
- **Quick action shortcuts** for common tasks
- **Recent activity** timeline
- **Role-specific dashboards** for different user types

## 🔄 State Management

The frontend uses Redux Toolkit for centralized state management:

- **Auth State** - User authentication and profile data
- **Ticket State** - Ticket data, pagination, and statistics
- **Category State** - Category management
- **User State** - User management (admin only)

## 📱 Responsive Design

QuickDesk is fully responsive and works on:
- **Desktop** computers (1024px+)
- **Tablets** (768px - 1023px)
- **Mobile phones** (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced reporting and analytics
- [ ] Ticket templates and automation
- [ ] Knowledge base integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced file handling
- [ ] Integration with third-party services
