import { supabase } from '../../../supabase';
import { Goal, CreateGoalRequest, GoalStructureRequest, GoalStructureResponse } from '../types/goals';

export const goalsService = {
  // 목표 생성
  async createGoal(goalData: CreateGoalRequest): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 로그인하지 않은 사용자를 위한 임시 목표 생성
      return {
        id: `temp_${Date.now()}`,
        user_id: 'anonymous',
        title: goalData.title,
        description: goalData.description,
        goal_type: goalData.goal_type,
        target_date: goalData.target_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        ...goalData
      })
      .select()
      .single();

    if (error) {
      throw new Error(`목표 생성 실패: ${error.message}`);
    }

    return data;
  },

  // 사용자의 목표 목록 조회
  async getUserGoals(): Promise<Goal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 로그인하지 않은 사용자는 빈 배열 반환
      return [];
    }

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`목표 조회 실패: ${error.message}`);
    }

    return data || [];
  },

  // AI 목표 구조화 API 호출
  async structureGoals(userInput: string): Promise<GoalStructureResponse> {
    try {
      const response = await fetch('http://localhost:8000/api/structure-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userInput,
          user_type: 'parent'
        })
      });

      if (!response.ok) {
        throw new Error(`AI 서비스 오류: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI 서비스 호출 오류:', error);
      // 폴백: 기본 응답 반환
      return {
        structured_goals: [
          {
            title: "학습 목표 설정",
            description: "구체적인 학습 목표를 설정해주세요",
            goal_type: "medium_term",
            subject: "기타"
          }
        ],
        message: "AI 서비스 연결 실패. 기본 목표가 생성되었습니다."
      };
    }
  }
};

