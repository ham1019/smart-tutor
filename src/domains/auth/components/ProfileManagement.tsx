import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { supabase } from '../../../supabase';

interface Profile {
  id: string;
  full_name: string;
  user_type: 'parent' | 'child' | 'admin';
  birth_date?: string;
  grade_level?: string;
  school_name?: string;
  parent_id?: string;
  profile_image_url?: string;
  is_active: boolean;
}

interface ChildProfile extends Profile {
  grade_level: string;
  school_name: string;
}

const ProfileManagement: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // 새 자녀 등록 폼 상태
  const [newChild, setNewChild] = useState({
    full_name: '',
    birth_date: '',
    grade_level: '',
    school_name: ''
  });

  // 학년 옵션
  const gradeOptions = [
    '유치원', '초등학교 1학년', '초등학교 2학년', '초등학교 3학년', '초등학교 4학년', '초등학교 5학년', '초등학교 6학년',
    '중학교 1학년', '중학교 2학년', '중학교 3학년',
    '고등학교 1학년', '고등학교 2학년', '고등학교 3학년'
  ];

  // useEffect 의존성 배열 수정
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  // profile이 로드된 후 자녀 목록 로드
  useEffect(() => {
    if (profile && profile.user_type === 'parent') {
      loadChildren();
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      // Supabase에서 프로필 정보 로드
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // 프로필이 없으면 새로 생성
        if (error.code === 'PGRST116') {
          const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.name || user.email || '',
            user_type: 'parent', // 기본값으로 parent 설정
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
          
          if (createError) {
            throw createError;
          }
          
          setProfile(createdProfile);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      setMessage({ type: 'error', text: '프로필을 불러오는 중 오류가 발생했습니다.' });
    }
  };

  const loadChildren = async () => {
    try {
      // Supabase에서 자녀 프로필 목록 로드
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setChildren(data || []);
    } catch (error) {
      console.error('자녀 목록 로드 오류:', error);
      setMessage({ type: 'error', text: '자녀 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile) return; // null 체크 추가
    
    try {
      // Supabase에서 프로필 업데이트
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          birth_date: profile.birth_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) {
        throw error;
      }
      
      setIsEditing(false);
      setMessage({ type: 'success', text: '프로필이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      setMessage({ type: 'error', text: '프로필 업데이트 중 오류가 발생했습니다.' });
    }
  };

  const handleAddChild = async () => {
    if (!user) return; // user null 체크 추가
    
    try {
      // Supabase에서 자녀 프로필 생성
      const newChildProfile = {
        full_name: newChild.full_name,
        birth_date: newChild.birth_date,
        grade_level: newChild.grade_level,
        school_name: newChild.school_name,
        parent_id: user.id,
        is_active: true
      };
      
      console.log('새 자녀 프로필:', newChildProfile); // 디버깅용
      
      const { error } = await supabase
        .from('children')
        .insert([newChildProfile]);
      
      if (error) {
        console.error('Supabase 에러:', error); // 디버깅용
        throw error;
      }
      
      setIsAddingChild(false);
      setNewChild({ full_name: '', birth_date: '', grade_level: '', school_name: '' });
      setMessage({ type: 'success', text: '자녀가 성공적으로 등록되었습니다.' });
      loadChildren(); // 자녀 목록 새로고침
    } catch (error) {
      console.error('자녀 등록 오류:', error);
      setMessage({ type: 'error', text: `자녀 등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` });
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (window.confirm('정말로 이 자녀를 삭제하시겠습니까?')) {
      try {
        // Supabase에서 자녀 프로필 삭제
        const { error } = await supabase
          .from('children')
          .delete()
          .eq('id', childId);
        
        if (error) {
          throw error;
        }
        
        setMessage({ type: 'success', text: '자녀가 성공적으로 삭제되었습니다.' });
        loadChildren(); // 자녀 목록 새로고침
      } catch (error) {
        console.error('자녀 삭제 오류:', error);
        setMessage({ type: 'error', text: '자녀 삭제 중 오류가 발생했습니다.' });
      }
    }
  };

  if (!profile) {
    return <Typography>프로필을 불러오는 중...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        프로필 관리
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* 내 프로필 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
              {profile.full_name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{profile.full_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.user_type === 'parent' ? '학부모' : '학습자'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '취소' : '수정'}
            </Button>
          </Box>

          {isEditing ? (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <TextField
                  fullWidth
                  label="이름"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="생년월일"
                  type="date"
                  value={profile.birth_date || ''}
                  onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                  저장
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>이름:</strong> {profile.full_name}
              </Typography>
              {profile.birth_date && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>생년월일:</strong> {profile.birth_date}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 학부모 전용: 자녀 관리 */}
      {profile.user_type === 'parent' && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">자녀 관리</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddingChild(true)}
              >
                자녀 등록
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {children.length > 0 ? (
              <List>
                {children.map((child) => (
                  <ListItem key={child.id} divider>
                    <ListItemText
                      primary={child.full_name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {child.grade_level} • {child.school_name}
                          </Typography>
                          <Chip 
                            label={child.is_active ? '활성' : '비활성'} 
                            color={child.is_active ? 'success' : 'default'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteChild(child.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                등록된 자녀가 없습니다. 자녀 등록 버튼을 클릭하여 자녀를 추가해주세요.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* 자녀 전용: 학습 정보 */}
      {profile.user_type === 'child' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              학습 정보
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="학년"
                value={profile.grade_level || ''}
                onChange={(e) => setProfile({ ...profile, grade_level: e.target.value })}
                select
              >
                {gradeOptions.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="학교"
                value={profile.school_name || ''}
                onChange={(e) => setProfile({ ...profile, school_name: e.target.value })}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained">
                학습 정보 저장
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 자녀 등록 다이얼로그 */}
      <Dialog open={isAddingChild} onClose={() => setIsAddingChild(false)} maxWidth="sm" fullWidth>
        <DialogTitle>자녀 등록</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="자녀 이름"
                value={newChild.full_name}
                onChange={(e) => setNewChild({ ...newChild, full_name: e.target.value })}
                required
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                label="생년월일"
                type="date"
                value={newChild.birth_date}
                onChange={(e) => setNewChild({ ...newChild, birth_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="학년"
                value={newChild.grade_level}
                onChange={(e) => setNewChild({ ...newChild, grade_level: e.target.value })}
                select
                required
              >
                {gradeOptions.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="학교"
                value={newChild.school_name}
                onChange={(e) => setNewChild({ ...newChild, school_name: e.target.value })}
                required
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingChild(false)}>취소</Button>
          <Button onClick={handleAddChild} variant="contained">
            등록
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileManagement;
