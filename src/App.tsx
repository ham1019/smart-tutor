import React, { useState } from 'react';
import { AuthProvider, useAuth } from './domains/auth/AuthContext';
import Layout from './components/Layout';
import { Box, Typography, Container, Button } from '@mui/material';
import LoginPage from './domains/auth/components/LoginPage';
import SignupPage from './domains/auth/components/SignupPage';
import ParentDashboard from './domains/dashboard/components/ParentDashboard';
import ChildDashboard from './domains/dashboard/components/ChildDashboard';

// 메인 앱 컴포넌트
const MainApp: React.FC = () => {
  const { user, loading, userType, isInitialized } = useAuth();
  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login');

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

  // 로그인한 사용자 - 사용자 유형에 따라 대시보드 표시
  const renderDashboard = () => {
    if (userType === 'child') {
      return <ChildDashboard />;
    } else {
      return <ParentDashboard />;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
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
