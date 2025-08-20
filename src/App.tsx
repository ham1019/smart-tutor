import React, { useState } from 'react';
import { AuthProvider, useAuth } from './domains/auth/AuthContext';
import Layout from './components/Layout';
import { Box, Typography, Container, Button } from '@mui/material';
import LoginPage from './domains/auth/components/LoginPage';
import SignupPage from './domains/auth/components/SignupPage';
import ParentDashboard from './domains/dashboard/components/ParentDashboard';
import ChildDashboard from './domains/dashboard/components/ChildDashboard';
import ProfileManagement from './domains/auth/components/ProfileManagement';

// 메인 앱 컴포넌트
const MainApp: React.FC = () => {
  const { user, loading, userType, isInitialized } = useAuth();
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard' | 'profile'>('dashboard');

  // 인증 초기화가 완료되지 않았으면 로딩 표시
  if (!isInitialized || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  // 로그인하지 않은 사용자
  if (!user) {
    if (currentPage === 'signup') {
      return <SignupPage onBackToLogin={() => setCurrentPage('login')} />;
    }
    return <LoginPage onGoToSignup={() => setCurrentPage('signup')} />;
  }

  // 로그인한 사용자 - 페이지에 따라 컴포넌트 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfileManagement />;
      case 'dashboard':
      default:
        if (userType === 'child') {
          return <ChildDashboard onNavigateToProfile={() => setCurrentPage('profile')} />;
        } else {
          return <ParentDashboard onNavigateToProfile={() => setCurrentPage('profile')} />;
        }
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
