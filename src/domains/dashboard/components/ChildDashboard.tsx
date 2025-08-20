import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useAuth } from '../../auth/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
}

interface ChildDashboardProps {
  onNavigateToProfile: () => void;
}

const ChildDashboard: React.FC<ChildDashboardProps> = ({ onNavigateToProfile }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 임시 데이터 (나중에 실제 API로 교체)
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: '수학 문제 풀기',
        description: '교과서 45-47페이지 문제 1-10번',
        completed: false,
        due_date: '2024-01-15'
      },
      {
        id: '2',
        title: '영어 단어 외우기',
        description: 'Unit 3 단어 20개 암기',
        completed: true,
        due_date: '2024-01-15'
      },
      {
        id: '3',
        title: '과학 실험 보고서',
        description: '물의 상태 변화 실험 결과 정리',
        completed: false,
        due_date: '2024-01-16'
      }
    ];

    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          오늘의 학습
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          안녕하세요, {user?.email}님! 오늘도 열심히 공부해요! 💪
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* 진행 중인 과제 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            📝 진행 중인 과제 ({pendingTasks.length}개)
          </Typography>
          
          {pendingTasks.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                오늘은 새로운 과제가 없어요! 🎉
              </Typography>
            </Paper>
          ) : (
            <List>
              {pendingTasks.map((task) => (
                <Card key={task.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleTaskToggle(task.id)}
                        color="primary"
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3">
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {task.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          마감일: {task.due_date}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Box>

        {/* 완료된 과제 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            ✅ 완료된 과제 ({completedTasks.length}개)
          </Typography>
          
          {completedTasks.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                아직 완료된 과제가 없어요. 화이팅! 💪
              </Typography>
            </Paper>
          ) : (
            <List>
              {completedTasks.map((task) => (
                <Card key={task.id} sx={{ mb: 2, opacity: 0.7 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleTaskToggle(task.id)}
                        color="primary"
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ textDecoration: 'line-through' }}>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {task.description}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          완료됨! 🎉
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* 진행률 표시 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          오늘의 진행률
        </Typography>
        <Typography variant="h3" color="primary" gutterBottom>
          {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {completedTasks.length} / {tasks.length} 과제 완료
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 4 }}>
        {/* 빠른 액션 */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ 빠른 액션
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={onNavigateToProfile}
                >
                  👤 프로필 관리
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                >
                  📚 학습 진도
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                >
                  🏆 성취도
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default ChildDashboard;





