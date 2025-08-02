# QuickDesk Admin Frontend

A comprehensive admin panel for managing the QuickDesk support system, built with React, Vite, and Tailwind CSS.

## Features

### 🎯 Core Admin Features
- **Dashboard**: Overview of system statistics, recent activity, and performance metrics
- **User Management**: Complete CRUD operations for user accounts with role management
- **Ticket Management**: Advanced ticket oversight with status updates and assignment
- **File Management**: Storage management with orphan file cleanup and analytics
- **Notification Management**: System-wide notification and announcement control

### 🔐 Authentication & Security
- JWT-based admin authentication
- Protected routes with automatic token validation
- Secure API communication with authorization headers

### 🎨 Professional UI/UX
- Modern, responsive design with Tailwind CSS
- Mobile-first responsive layout
- Clean, accessible component library
- Professional admin interface with sidebar navigation

### 📊 Data Management
- Advanced search and filtering capabilities
- Pagination for large datasets
- Real-time data updates
- Bulk operations support

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router DOM for navigation
- **HTTP Client**: Axios for API communication
- **Icons**: Heroicons via inline SVG
- **State Management**: React Hooks (useState, useEffect)

## Project Structure

```
admin-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── index.js
│   │   ├── layout/           # Layout components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── index.js
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Main page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UserManagement.jsx
│   │   ├── TicketManagement.jsx
│   │   ├── FileManagement.jsx
│   │   ├── NotificationManagement.jsx
│   │   └── index.js
│   ├── services/            # API service layer
│   │   ├── api.js
│   │   └── adminApi.js
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.js
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── index.html              # HTML template
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   cd admin-frontend
   npm install
   ```

2. **Environment Configuration**
   - Update API base URL in `src/services/api.js` if needed
   - Default backend URL: `http://localhost:5000/api`

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

The admin frontend integrates with the QuickDesk backend APIs:

### Authentication
- `POST /api/auth/admin/login` - Admin login

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/tickets/recent` - Recent tickets
- `GET /api/admin/users/recent` - Recent users

### User Management
- `GET /api/admin/users` - Get users with pagination/filtering
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status

### Ticket Management
- `GET /api/admin/tickets` - Get tickets with pagination/filtering
- `PUT /api/admin/tickets/:id/assign` - Assign ticket
- `PUT /api/admin/tickets/:id/status` - Update ticket status
- `DELETE /api/admin/tickets/:id` - Delete ticket
- `POST /api/admin/tickets/:id/comments` - Add comment

### File Management
- `GET /api/admin/files` - Get files with pagination
- `GET /api/admin/files/stats` - Storage statistics
- `DELETE /api/admin/files` - Bulk delete files
- `POST /api/admin/files/cleanup` - Cleanup orphan files

### Notification Management
- `GET /api/admin/notifications` - Get notifications
- `POST /api/admin/notifications` - Create notification
- `PUT /api/admin/notifications/:id/read` - Mark as read
- `DELETE /api/admin/notifications/:id` - Delete notification
- `POST /api/admin/notifications/mark-all-read` - Mark all as read

## Key Components

### Dashboard
- System overview with key metrics
- Recent activity feeds
- Performance indicators
- Quick action buttons

### User Management
- User listing with search and filters
- User creation and editing forms
- Role management (user/admin)
- Account status controls
- Bulk operations

### Ticket Management
- Advanced ticket filtering and search
- Ticket status management
- Assignment capabilities
- Detailed ticket views with comments
- Analytics and reporting

### File Management
- File listing with type indicators
- Storage usage analytics
- Orphan file detection and cleanup
- Bulk file operations
- Download and preview capabilities

### Notification Management
- System notification creation
- Targeted or broadcast messaging
- Read/unread status tracking
- Notification type categorization
- Bulk management operations

## Development Features

- **Hot Module Replacement**: Instant updates during development
- **Component Modularity**: Reusable component architecture
- **API Abstraction**: Clean service layer for backend communication
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Professional loading indicators throughout
- **Responsive Design**: Mobile-friendly admin interface

## Security Features

- JWT token management with automatic logout
- Protected route authentication
- Secure API communication
- Admin-only access controls
- Session persistence with localStorage

## Customization

The admin panel is highly customizable:

- **Theming**: Update color variables in `index.css`
- **Components**: Extend common components for new features
- **Layout**: Modify sidebar navigation and layout structure
- **API**: Extend service layer for additional endpoints

## Performance

- Vite build optimization for fast loading
- Component lazy loading where appropriate
- Efficient API data fetching with custom hooks
- Optimized bundle size with tree shaking
- Progressive enhancement for better UX

This admin frontend provides a complete administrative interface for the QuickDesk support system with professional design, comprehensive functionality, and modern development practices.
