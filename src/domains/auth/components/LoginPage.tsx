import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Link
} from '@mui/material';
import { useAuth } from '../AuthContext';

interface LoginPageProps {
  onGoToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoToSignup }) => {
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            로그인
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            AI 과외선생님에 오신 것을 환영합니다
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                계정이 없으신가요?{' '}
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={onGoToSignup}
                  sx={{ border: 'none', background: 'none', cursor: 'pointer', color: 'primary.main' }}
                >
                  회원가입
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
