export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  goal_type: 'short_term' | 'medium_term' | 'long_term';
  target_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  goal_type: 'short_term' | 'medium_term' | 'long_term';
  target_date?: string;
}

export interface GoalStructureRequest {
  user_input: string;
}

export interface GoalStructureResponse {
  structured_goals: Array<{
    title: string;
    description: string;
    goal_type: 'short_term' | 'medium_term' | 'long_term';
    subject: string;
  }>;
  message: string;
}

