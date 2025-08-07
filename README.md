# AI 과외선생님 (스마트과외)

학부모와 자녀가 함께 사용하는 AI 기반 학습 관리 플랫폼입니다.

## 프로젝트 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```
# Supabase 설정
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 개발용 Supabase 서비스 키 (시드 스크립트용)
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 테스트 사용자 생성 (선택사항)
```bash
node scripts/seed-users.js
```

## 프로젝트 구조

```
src/
├── components/                   # 공통 컴포넌트
│   └── Layout.tsx              # Material-UI 레이아웃
├── domains/
│   └── auth/                    # 인증 도메인
│       ├── components/          # 인증 관련 컴포넌트
│       │   └── PrivateRoute.jsx
│       ├── services/            # 인증 서비스
│       │   └── authService.js
│       └── AuthContext.jsx      # 인증 컨텍스트
├── supabase.js                  # Supabase 클라이언트
└── App.tsx                      # 메인 앱 컴포넌트
```

## 주요 기능

- **인증 시스템**: Supabase Auth를 이용한 JWT 기반 인증
- **사용자 관리**: 학부모/자녀 역할 구분
- **권한 관리**: PrivateRoute를 통한 접근 제어
- **실시간 상태**: 인증 상태 실시간 업데이트
- **UI 프레임워크**: Material-UI 기반 반응형 디자인
- **CI/CD**: GitHub Actions를 통한 자동화된 배포

## 개발 명령어

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix
```

## 배포

### Vercel 배포
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### GitHub Actions
- main 브랜치에 푸시 시 자동 배포
- lint, test, build 단계 포함

## 테스트 계정

시드 스크립트 실행 후 사용 가능한 테스트 계정:
- **학부모**: parent@test.com / testpassword123
- **자녀**: child@test.com / testpassword123
