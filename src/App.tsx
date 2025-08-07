import React from 'react';
import { AuthProvider } from './domains/auth/AuthContext';
import Layout from './components/Layout';
import { Box, Typography, Paper } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            AI 과외선생님
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            학부모와 자녀를 위한 스마트 학습 관리 플랫폼
          </Typography>
          <Paper sx={{ p: 3, mt: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body1" paragraph>
              인증 시스템이 성공적으로 구축되었습니다!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              환경 변수를 설정하고 개발 서버를 실행해보세요.
            </Typography>
          </Paper>
        </Box>
      </Layout>
    </AuthProvider>
  );
}

export default App;
