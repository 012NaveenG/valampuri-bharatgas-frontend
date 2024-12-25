import { createRoot } from 'react-dom/client';
import './index.css';

import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import Login from './Pages/auth/Login';
import useAuth from './middleware/auth.middleware';
import EmployeeDashboard from './Pages/employee/EmployeeDashboard.tsx';
import EmployeeOpeningDetails from './Pages/employee/EmployeeOpeningDetails.tsx';
import AdminDashboard from './Pages/admin/AdminDashboard.tsx';


// Layout Component to Apply `useAuth`
const AuthLayout = () => {
  useAuth(); // Run the authentication logic
  return <Outlet />; // Render nested routes
};

// Define Protected Routes Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const empData = localStorage.getItem('signedIn');
  const parsedData = empData ? JSON.parse(empData) : null;

  if (!parsedData) {
    return <Navigate to="/" replace />; // Redirect to login if not logged in
  }

  // Redirect based on role
  if (parsedData.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    element: <AuthLayout />, // Apply useAuth to these routes
    children: [
      {
        path: '/',
        element: <Login />,
      },
      // Employee routes
      {
        path: '/employee/opening-details',
        element: (
          <ProtectedRoute>
            <EmployeeOpeningDetails/>
          </ProtectedRoute>
        ),
      },
      {
        path: '/employee/dashboard',
        element: (
          <ProtectedRoute>
            <EmployeeDashboard/>
          </ProtectedRoute>
        ),
      },
      // Admin routes
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Toaster />
    <RouterProvider router={router} />
  </ThemeProvider>
);
