import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { useAuth } from '../domains/auth/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI 과외선생님
            </Typography>
            {user && (
              <Typography variant="body2" sx={{ mr: 2 }}>
                {user.user_metadata?.name || user.email}
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;




