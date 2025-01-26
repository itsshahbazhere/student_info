import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { useFirebase } from 'src/context/Firebase';

// Lazy-loaded pages
const HomePage = lazy(() => import('src/pages/home'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

// Loading Indicator Component
const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress sx={{ width: 1, maxWidth: 320 }} />
  </Box>
);

export function Router() {
  const { user, loading } = useFirebase(); // Access user authentication state

  // If Firebase is still checking authentication status, show loading
  if (loading) {
    return renderFallback;
  }

  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: user ? <HomePage /> : <Navigate to="/logout" replace />,
          index: true
        },
      ],
    },
    {
      path: 'logout',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
