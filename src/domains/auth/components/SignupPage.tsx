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
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAuth } from '../AuthContext';

interface SignupPageProps {
  onBackToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBackToLogin }) => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'parent'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, formData.userType);
      if (error) {
        setError(error);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement> | any
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
            회원가입
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            AI 과외선생님과 함께 시작하세요
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
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>사용자 유형</InputLabel>
              <Select
                value={formData.userType}
                onChange={handleChange('userType')}
                label="사용자 유형"
              >
                <MenuItem value="parent">학부모</MenuItem>
                <MenuItem value="child">자녀</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? '회원가입 중...' : '회원가입'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                이미 계정이 있으신가요?{' '}
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={onBackToLogin}
                  sx={{ border: 'none', background: 'none', cursor: 'pointer', color: 'primary.main' }}
                >
                  로그인
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignupPage;
