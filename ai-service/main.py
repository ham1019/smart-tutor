from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import re

app = FastAPI(title="AI 과외선생님 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 모델
class GoalStructureRequest(BaseModel):
    user_input: str
    user_type: str = "parent"

class GoalStructureResponse(BaseModel):
    structured_goals: List[dict]
    message: str

class RoadmapRequest(BaseModel):
    goal_id: str
    goal_title: str
    goal_description: str
    goal_type: str
    target_date: Optional[str] = None

class RoadmapResponse(BaseModel):
    roadmap: List[dict]
    message: str

# AI 목표 구조화 함수 (현재는 규칙 기반)
def structure_goals_ai(user_input: str) -> List[dict]:
    """사용자 입력을 분석하여 구조화된 목표로 변환"""
    
    goals = []
    
    # 키워드 기반 목표 분류
    keywords = {
        "수학": ["수학", "계산", "문제", "공식"],
        "영어": ["영어", "단어", "문법", "회화"],
        "국어": ["국어", "독서", "작문", "문학"],
        "과학": ["과학", "실험", "물리", "화학", "생물"],
        "사회": ["사회", "역사", "지리", "정치"],
        "예체능": ["음악", "미술", "체육", "운동"]
    }
    
    # 목표 유형 분류
    goal_types = {
        "단기": ["일주일", "1주", "단기", "빠른"],
        "중기": ["한달", "1개월", "중기", "보통"],
        "장기": ["학기", "학년", "장기", "오래"]
    }
    
    # 사용자 입력에서 목표 추출
    lines = user_input.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # 목표 유형 판단
        goal_type = "medium_term"  # 기본값
        for type_key, type_keywords in goal_types.items():
            if any(keyword in line for keyword in type_keywords):
                if type_key == "단기":
                    goal_type = "short_term"
                elif type_key == "중기":
                    goal_type = "medium_term"
                elif type_key == "장기":
                    goal_type = "long_term"
                break
        
        # 과목 분류
        subject = "기타"
        for subject_name, subject_keywords in keywords.items():
            if any(keyword in line for keyword in subject_keywords):
                subject = subject_name
                break
        
        # 목표 제목 생성
        title = line
        if len(title) > 50:
            title = title[:47] + "..."
        
        goals.append({
            "title": title,
            "description": f"{subject} 관련 학습 목표",
            "goal_type": goal_type,
            "subject": subject
        })
    
    # 목표가 없으면 기본 목표 생성
    if not goals:
        goals.append({
            "title": "학습 목표 설정",
            "description": "구체적인 학습 목표를 설정해주세요",
            "goal_type": "medium_term",
            "subject": "기타"
        })
    
    return goals

# AI 로드맵 생성 함수 (현재는 규칙 기반)
def generate_roadmap_ai(goal_data: dict) -> List[dict]:
    """목표를 기반으로 로드맵 생성"""
    
    roadmap = []
    
    # 목표 유형에 따른 단계 수 결정
    steps_count = {
        "short_term": 3,
        "medium_term": 5,
        "long_term": 8
    }
    
    steps = steps_count.get(goal_data["goal_type"], 5)
    
    # 과목별 기본 로드맵 템플릿
    templates = {
        "수학": [
            "기초 개념 학습",
            "문제 풀이 연습",
            "실전 문제 도전",
            "오답 노트 정리",
            "심화 문제 풀이"
        ],
        "영어": [
            "단어 학습",
            "문법 이해",
            "독해 연습",
            "회화 연습",
            "실전 테스트"
        ],
        "국어": [
            "독서 활동",
            "문학 작품 감상",
            "작문 연습",
            "문법 학습",
            "독해력 향상"
        ],
        "과학": [
            "개념 이해",
            "실험 관찰",
            "이론 정리",
            "문제 풀이",
            "심화 학습"
        ],
        "사회": [
            "개념 학습",
            "사례 분석",
            "지도 학습",
            "문제 풀이",
            "심화 탐구"
        ],
        "예체능": [
            "기초 연습",
            "기술 향상",
            "창작 활동",
            "표현력 개발",
            "완성도 향상"
        ]
    }
    
    subject = goal_data.get("subject", "기타")
    template = templates.get(subject, [
        "1단계 학습",
        "2단계 연습",
        "3단계 적용",
        "4단계 심화",
        "5단계 완성"
    ])
    
    # 로드맵 단계 생성
    for i in range(min(steps, len(template))):
        roadmap.append({
            "step": i + 1,
            "title": template[i],
            "description": f"{goal_data['title']}의 {i + 1}단계",
            "duration": "1주",
            "status": "pending"
        })
    
    return roadmap

@app.get("/")
async def root():
    return {"message": "AI 과외선생님 API 서버가 실행 중입니다."}

@app.post("/api/structure-goals", response_model=GoalStructureResponse)
async def structure_goals(request: GoalStructureRequest):
    """사용자 입력을 분석하여 구조화된 목표로 변환"""
    try:
        structured_goals = structure_goals_ai(request.user_input)
        
        return GoalStructureResponse(
            structured_goals=structured_goals,
            message="목표가 성공적으로 구조화되었습니다."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"목표 구조화 중 오류가 발생했습니다: {str(e)}")

@app.post("/api/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    """목표를 기반으로 로드맵 생성"""
    try:
        goal_data = {
            "title": request.goal_title,
            "description": request.goal_description,
            "goal_type": request.goal_type,
            "target_date": request.target_date
        }
        
        roadmap = generate_roadmap_ai(goal_data)
        
        return RoadmapResponse(
            roadmap=roadmap,
            message="로드맵이 성공적으로 생성되었습니다."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"로드맵 생성 중 오류가 발생했습니다: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)





