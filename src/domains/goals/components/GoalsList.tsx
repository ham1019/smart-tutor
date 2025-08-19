import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';

const getGoalTypeLabel = (goalType: string) => {
  switch (goalType) {
    case 'short_term':
      return '단기';
    case 'medium_term':
      return '중기';
    case 'long_term':
      return '장기';
    default:
      return goalType;
  }
};

const getGoalTypeColor = (goalType: string) => {
  switch (goalType) {
    case 'short_term':
      return 'success';
    case 'medium_term':
      return 'warning';
    case 'long_term':
      return 'info';
    default:
      return 'default';
  }
};

const GoalsList: React.FC = () => {
  const { goals, loading, error } = useGoals();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (goals.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          아직 설정된 목표가 없습니다.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          새로운 목표를 설정해보세요!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        내 목표 목록
      </Typography>
      
      <Grid container spacing={2}>
        {goals.map((goal: Goal) => (
          <Grid key={goal.id} sx={{ width: { xs: '100%', md: '50%', lg: '33.33%' } }}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                    {goal.title}
                  </Typography>
                  <Chip
                    label={getGoalTypeLabel(goal.goal_type)}
                    color={getGoalTypeColor(goal.goal_type) as any}
                    size="small"
                  />
                </Box>
                
                {goal.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {goal.description}
                  </Typography>
                )}
                
                {goal.target_date && (
                  <Typography variant="caption" color="text.secondary">
                    목표 날짜: {new Date(goal.target_date).toLocaleDateString('ko-KR')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GoalsList;

