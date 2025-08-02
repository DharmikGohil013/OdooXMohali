# QuickDesk Frontend

React frontend for the QuickDesk help desk system built with Vite, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **React 18** with modern hooks and patterns
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API communication
- **React Toastify** for notifications
- **React Icons** for iconography

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "@reduxjs/toolkit": "^1.9.5",
  "react-redux": "^8.1.2",
  "axios": "^1.5.0",
  "react-hook-form": "^7.46.1",
  "react-toastify": "^9.1.3",
  "react-icons": "^4.11.0",
  "clsx": "^2.0.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.15",
  "@types/react-dom": "^18.2.7",
  "@vitejs/plugin-react": "^4.0.3",
  "vite": "^4.4.5",
  "tailwindcss": "^3.3.3",
  "autoprefixer": "^10.4.15",
  "postcss": "^8.4.29",
  "eslint": "^8.45.0",
  "eslint-plugin-react": "^7.32.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.3"
}
```

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=QuickDesk
   VITE_MAX_FILE_SIZE=5242880
   VITE_ALLOWED_FILE_TYPES=image/*,.pdf,.doc,.docx,.txt
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── common/          # Common UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Avatar.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ConfirmDialog.jsx
│   └── layout/          # Layout components
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── Layout.jsx
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── TicketList.jsx
│   ├── TicketDetail.jsx
│   ├── CreateTicket.jsx
│   ├── Profile.jsx
│   ├── UserList.jsx
│   └── CategoryList.jsx
├── redux/               # Redux store and slices
│   ├── store.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── ticketSlice.js
│   │   ├── categorySlice.js
│   │   └── userSlice.js
├── services/            # API service functions
│   ├── api.js
│   ├── authService.js
│   ├── ticketService.js
│   ├── categoryService.js
│   └── userService.js
├── utils/               # Utility functions
│   ├── constants.js
│   ├── helpers.js
│   └── formatters.js
├── App.jsx              # Main App component
├── index.css            # Global styles
└── main.jsx             # Entry point
```

## 🎨 UI Components

### Common Components

#### Button Component
```jsx
<Button 
  variant="primary" 
  size="md" 
  onClick={handleClick}
  loading={isLoading}
  disabled={isDisabled}
>
  Click Me
</Button>
```

#### Input Component
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

#### Card Component
```jsx
<Card className="p-6">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Card content goes here
  </Card.Content>
</Card>
```

#### Badge Component
```jsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Urgent</Badge>
```

### Layout Components

#### Header
- User avatar and dropdown menu
- Notifications
- Mobile menu toggle
- Breadcrumb navigation

#### Sidebar
- Role-based navigation menu
- Collapsible on mobile
- Active state indicators
- User role display

## 🗃️ State Management

### Redux Store Structure
```javascript
{
  auth: {
    user: User | null,
    token: string | null,
    isLoading: boolean,
    error: string | null
  },
  tickets: {
    tickets: Ticket[],
    currentTicket: Ticket | null,
    stats: TicketStats,
    filters: FilterState,
    pagination: PaginationState,
    isLoading: boolean,
    error: string | null
  },
  categories: {
    categories: Category[],
    isLoading: boolean,
    error: string | null
  },
  users: {
    users: User[],
    agents: User[],
    stats: UserStats,
    isLoading: boolean,
    error: string | null
  }
}
```

### Auth Slice Actions
```javascript
// Async thunks
login(credentials)
register(userData)
logout()
getCurrentUser()
updateProfile(profileData)
changePassword(passwordData)

// Reducers
setUser(user)
clearUser()
setLoading(boolean)
setError(error)
```

### Ticket Slice Actions
```javascript
// Async thunks
fetchTickets(filters)
fetchTicketById(id)
createTicket(ticketData)
updateTicket({ id, data })
deleteTicket(id)
addComment({ ticketId, comment })
rateTicket({ ticketId, rating })
fetchTicketStats()

// Reducers
setTickets(tickets)
setCurrentTicket(ticket)
addTicket(ticket)
updateTicket(ticket)
removeTicket(id)
setFilters(filters)
setPagination(pagination)
```

## 🌐 API Integration

### API Service Setup
```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Functions
```javascript
// ticketService.js
export const ticketService = {
  getTickets: (params) => api.get('/tickets', { params }),
  getTicketById: (id) => api.get(`/tickets/${id}`),
  createTicket: (data) => api.post('/tickets', data),
  updateTicket: (id, data) => api.put(`/tickets/${id}`, data),
  deleteTicket: (id) => api.delete(`/tickets/${id}`),
  addComment: (id, comment) => api.post(`/tickets/${id}/comments`, comment),
  rateTicket: (id, rating) => api.post(`/tickets/${id}/rate`, rating),
  getStats: () => api.get('/tickets/stats')
};
```

## 🎯 Routing

### Route Configuration
```jsx
// App.jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="tickets" element={<TicketList />} />
    <Route path="tickets/:id" element={<TicketDetail />} />
    <Route path="tickets/create" element={<CreateTicket />} />
    <Route path="profile" element={<Profile />} />
    
    {/* Agent/Admin routes */}
    <Route path="users" element={<ProtectedRoute role="admin"><UserList /></ProtectedRoute>} />
    <Route path="categories" element={<ProtectedRoute role="agent"><CategoryList /></ProtectedRoute>} />
  </Route>
  
  {/* Auth routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
```

### Protected Routes
```jsx
const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (role && !hasRole(user, role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

## 📱 Responsive Design

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile-First Approach
```jsx
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {/* Responsive grid */}
</div>
```

## 🎪 Form Handling

### React Hook Form Integration
```jsx
import { useForm } from 'react-hook-form';

const CreateTicketForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(createTicket(data));
      toast.success('Ticket created successfully');
      navigate('/tickets');
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />
      
      <Button type="submit" loading={isSubmitting}>
        Create Ticket
      </Button>
    </form>
  );
};
```

## 🔔 Notifications

### Toast Integration
```jsx
import { toast } from 'react-toastify';

// Success notification
toast.success('Ticket created successfully');

// Error notification
toast.error('Failed to create ticket');

// Info notification
toast.info('Please check your email');

// Warning notification
toast.warn('Session will expire soon');
```

### Toast Configuration
```jsx
// main.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>
```

## 🔧 Utilities

### Constants
```javascript
// constants.js
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const USER_ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin'
};
```

### Helper Functions
```javascript
// helpers.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getStatusColor = (status) => {
  const colors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const hasRole = (user, role) => {
  const roleHierarchy = ['user', 'agent', 'admin'];
  const userRoleIndex = roleHierarchy.indexOf(user?.role);
  const requiredRoleIndex = roleHierarchy.indexOf(role);
  return userRoleIndex >= requiredRoleIndex;
};
```

## 🚀 Development

### Development Server
```bash
npm run dev
```
- Starts Vite dev server on `http://localhost:5173`
- Hot module replacement (HMR)
- Fast refresh for React components

### Build Process
```bash
npm run build
```
- Creates optimized production build
- Output in `dist/` directory
- Tree shaking and code splitting

### Preview Production Build
```bash
npm run preview
```

## 🧪 Testing

### Component Testing (Future Enhancement)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Run tests
npm run test
```

### Example Test
```jsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Button from '../components/common/Button';

test('renders button with text', () => {
  render(
    <Provider store={store}>
      <Button>Click me</Button>
    </Provider>
  );
  
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 📊 Performance

### Optimization Strategies
- **Code splitting** with React.lazy()
- **Memoization** with React.memo()
- **Virtual scrolling** for large lists
- **Image optimization** with proper sizing
- **Bundle analysis** with webpack-bundle-analyzer

### Code Splitting Example
```jsx
import { lazy, Suspense } from 'react';

const TicketDetail = lazy(() => import('./pages/TicketDetail'));

<Suspense fallback={<LoadingSpinner />}>
  <TicketDetail />
</Suspense>
```

## 🔒 Security

### XSS Prevention
- Input sanitization
- Content Security Policy
- Proper HTML escaping

### Authentication
- JWT token storage in localStorage
- Automatic token refresh
- Protected route implementation
- Role-based access control

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
VITE_API_URL=https://api.quickdesk.com/api
VITE_APP_NAME=QuickDesk
```

### Static Hosting
Deploy the `dist/` folder to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 Troubleshooting

### Common Issues

1. **Vite dev server not starting**
   - Check port 5173 is available
   - Clear node_modules and reinstall

2. **API calls failing**
   - Verify VITE_API_URL in .env
   - Check CORS configuration on backend

3. **Build errors**
   - Check for TypeScript errors
   - Verify all imports are correct

4. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration

### Debug Tools
- React Developer Tools
- Redux DevTools Extension
- Vite debug logs
- Network tab in browser
