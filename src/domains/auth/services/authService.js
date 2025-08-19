import { supabase } from '../../../supabase'

// 에러 메시지 변환 헬퍼 함수
const getErrorMessage = (error) => {
  if (!error) return null
  
  // Supabase 에러 메시지 처리
  if (error.message) {
    // 사용자 친화적인 메시지로 변환
    const messageMap = {
      'User already registered': '이미 등록된 이메일입니다.',
      'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'Email not confirmed': '이메일 인증이 필요합니다.',
      'Password should be at least 6 characters': '비밀번호는 6자 이상이어야 합니다.'
    }
    
    return messageMap[error.message] || error.message
  }
  
  // 일반 에러 객체 처리
  if (typeof error === 'string') {
    return error
  }
  
  return '알 수 없는 오류가 발생했습니다.'
}

export const authService = {
  /**
   * 회원가입 함수
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @param {string} userType - 사용자 타입 ('parent' | 'child')
   * @returns {Promise<{user: User | null, error: string | null}>}
   */
  async signUp(email, password, userType) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      })

      if (error) {
        // 개발 환경에서만 상세 에러 로깅
        if (process.env.NODE_ENV === 'development') {
          console.warn('SignUp error:', error)
        }
        return { user: null, error: getErrorMessage(error) }
      }

      return { user: data.user, error: null }
    } catch (error) {
      // 개발 환경에서만 상세 에러 로깅
      if (process.env.NODE_ENV === 'development') {
        console.warn('SignUp exception:', error)
      }
      return { user: null, error: getErrorMessage(error) }
    }
  },

  /**
   * 로그인 함수
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<{user: User | null, error: Error | null}>}
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, error: error.message || '로그인 중 오류가 발생했습니다.' }
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message || '로그인 중 오류가 발생했습니다.' }
    }
  },

  /**
   * 로그아웃 함수
   * @returns {Promise<{error: Error | null}>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error ? error.message || '로그아웃 중 오류가 발생했습니다.' : null }
    } catch (error) {
      return { error: error.message || '로그아웃 중 오류가 발생했습니다.' }
    }
  },

  /**
   * 현재 사용자 가져오기 (필요한 경우에만 사용)
   * @returns {Promise<{user: User | null, error: Error | null}>}
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error: error ? error.message || '사용자 정보를 가져오는 중 오류가 발생했습니다.' : null }
    } catch (error) {
      return { user: null, error: error.message || '사용자 정보를 가져오는 중 오류가 발생했습니다.' }
    }
  }
} 