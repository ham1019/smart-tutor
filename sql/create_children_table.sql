-- Children 테이블 생성
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  birth_date DATE,
  grade_level TEXT,
  school_name TEXT,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 부모 ID로 검색하기 위한 인덱스
CREATE INDEX idx_children_parent_id ON children(parent_id);

-- updated_at 자동 업데이트를 위한 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- 부모만 자신의 자녀 데이터에 접근 가능
CREATE POLICY "Parents can view own children" ON children
    FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own children" ON children
    FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own children" ON children
    FOR UPDATE USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete own children" ON children
    FOR DELETE USING (auth.uid() = parent_id);