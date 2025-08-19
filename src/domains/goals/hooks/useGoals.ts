import { useState, useEffect } from 'react';
import { goalsService } from '../services/goalsService';
import { Goal, CreateGoalRequest, GoalStructureResponse } from '../types/goals';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로컬 스토리지에서 임시 목표 불러오기
  const loadTempGoals = () => {
    try {
      const tempGoals = localStorage.getItem('temp_goals');
      if (tempGoals) {
        return JSON.parse(tempGoals);
      }
    } catch (error) {
      console.error('임시 목표 로드 실패:', error);
    }
    return [];
  };

  // 임시 목표를 로컬 스토리지에 저장
  const saveTempGoals = (tempGoals: Goal[]) => {
    try {
      localStorage.setItem('temp_goals', JSON.stringify(tempGoals));
    } catch (error) {
      console.error('임시 목표 저장 실패:', error);
    }
  };

  // 목표 목록 조회
  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsService.getUserGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '목표 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 목표 생성
  const createGoal = async (goalData: CreateGoalRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newGoal = await goalsService.createGoal(goalData);
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : '목표 생성 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // AI 목표 구조화
  const structureGoals = async (userInput: string): Promise<GoalStructureResponse> => {
    try {
      setLoading(true);
      setError(null);
      return await goalsService.structureGoals(userInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : '목표 구조화 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 목표 목록 조회
  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    structureGoals
  };
};

