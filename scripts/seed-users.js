const { createClient } = require('@supabase/supabase-js')

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testUsers = [
  {
    email: 'parent@test.com',
    password: 'testpassword123',
    user_type: 'parent',
    name: '테스트 학부모'
  },
  {
    email: 'child@test.com', 
    password: 'testpassword123',
    user_type: 'child',
    name: '테스트 자녀'
  }
]

async function seedUsers() {
  console.log('테스트 사용자 생성 시작...')

  for (const userData of testUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          user_type: userData.user_type,
          name: userData.name
        }
      })

      if (error) {
        console.error(`사용자 생성 실패 (${userData.email}):`, error.message)
      } else {
        console.log(`✅ 사용자 생성 성공: ${userData.email} (${userData.user_type})`)
      }
    } catch (error) {
      console.error(`사용자 생성 중 오류 (${userData.email}):`, error.message)
    }
  }

  console.log('테스트 사용자 생성 완료!')
  console.log('\n테스트 계정:')
  console.log('- 학부모: parent@test.com / testpassword123')
  console.log('- 자녀: child@test.com / testpassword123')
}

// 스크립트 실행
seedUsers().catch(console.error)
