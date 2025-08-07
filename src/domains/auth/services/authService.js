import { supabase } from '../../../supabase'

export const authService = {
  /**
   * 회원가입 함수
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @param {string} userType - 사용자 타입 ('parent' | 'child')
   * @returns {Promise<{user: User | null, error: Error | null}>}
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
        return { user: null, error }
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error }
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
        return { user: null, error }
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  },

  /**
   * 로그아웃 함수
   * @returns {Promise<{error: Error | null}>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  /**
   * 현재 사용자 가져오기
   * @returns {Promise<{user: User | null, error: Error | null}>}
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error }
    }
  }
} 