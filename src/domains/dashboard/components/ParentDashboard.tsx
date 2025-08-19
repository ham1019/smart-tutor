import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import GoalInputForm from '../../goals/components/GoalInputForm';
import GoalsList from '../../goals/components/GoalsList';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();

  // 임시 데이터 (나중에 실제 API로 교체)
  const childProgress = {
    name: '김철수',
    totalTasks: 15,
    completedTasks: 12,
    progress: 80,
    recentActivity: [
      { task: '수학 문제 풀기', completed: true, time: '2시간 전' },
      { task: '영어 단어 외우기', completed: true, time: '1시간 전' },
      { task: '과학 실험 보고서', completed: false, time: '오늘' }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          학부모 대시보드
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          안녕하세요, {user?.email}님! 자녀의 학습을 관리해보세요.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {/* 자녀 진행 상황 */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👨‍👩‍👧‍👦 자녀 진행 상황
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {childProgress.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    진행률:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {childProgress.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={childProgress.progress} 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {childProgress.completedTasks} / {childProgress.totalTasks} 과제 완료
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                최근 활동:
              </Typography>
              {childProgress.recentActivity.map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={activity.completed ? '완료' : '진행중'} 
                    size="small" 
                    color={activity.completed ? 'success' : 'warning'}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {activity.task}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

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
                  fullWidth
                  onClick={() => {/* TODO: 새 목표 설정 모달 */}}
                >
                  🎯 새 목표 설정
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => {/* TODO: 로드맵 생성 */}}
                >
                  🗺️ 로드맵 생성
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => {/* TODO: 일정 관리 */}}
                >
                  📅 일정 관리
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => {/* TODO: 리포트 보기 */}}
                >
                  📊 리포트 보기
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 통계 */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 이번 주 통계
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {childProgress.progress}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    주간 완료율
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    5일
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    연속 학습일
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" gutterBottom>
                    2시간
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 학습 시간
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 목표 관리 섹션 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          🎯 학습 목표 관리
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  새 목표 설정
                </Typography>
                <GoalInputForm />
              </CardContent>
            </Card>
          </Box>
          
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  현재 목표
                </Typography>
                <GoalsList />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ParentDashboard;
