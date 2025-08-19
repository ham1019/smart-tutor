import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useGoals } from '../hooks/useGoals';
import { CreateGoalRequest } from '../types/goals';

interface GoalInputFormProps {
  onGoalCreated?: () => void;
}

const GoalInputForm: React.FC<GoalInputFormProps> = ({ onGoalCreated }) => {
  const { createGoal, loading, error } = useGoals();
  const [formData, setFormData] = useState<CreateGoalRequest>({
    title: '',
    description: '',
    goal_type: 'short_term',
    target_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('폼 제출됨:', formData);
    
    if (!formData.title.trim()) {
      console.log('제목이 비어있음');
      return;
    }

    try {
      console.log('목표 생성 시작');
      await createGoal(formData);
      console.log('목표 생성 완료');
      setFormData({
        title: '',
        description: '',
        goal_type: 'short_term',
        target_date: ''
      });
      onGoalCreated?.();
    } catch (err) {
      console.error('목표 생성 에러:', err);
      // 에러는 useGoals에서 처리됨
    }
  };

  const handleChange = (field: keyof CreateGoalRequest) => (
    e: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    console.log('필드 변경:', field, e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        새로운 목표 설정
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="목표 제목"
          value={formData.title}
          onChange={handleChange('title')}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="목표 설명"
          value={formData.description}
          onChange={handleChange('description')}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>목표 유형</InputLabel>
          <Select
            value={formData.goal_type}
            onChange={handleChange('goal_type')}
            label="목표 유형"
          >
            <MenuItem value="short_term">단기 목표</MenuItem>
            <MenuItem value="medium_term">중기 목표</MenuItem>
            <MenuItem value="long_term">장기 목표</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="목표 날짜"
          type="date"
          value={formData.target_date}
          onChange={handleChange('target_date')}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !formData.title.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? '생성 중...' : '목표 생성'}
        </Button>
      </Box>
    </Paper>
  );
};

export default GoalInputForm;

