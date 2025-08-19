import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from './services/authService'
import { supabase } from '../../supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // 앱 시작 시 인증 상태 초기화
    initializeAuth()
    
    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      // 1. 세션이 있는지 확인 (쿠키/로컬스토리지)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // 2. 세션이 있으면 사용자 정보 설정
        setUser(session.user)
      }
    } catch (error) {
      // 3. 에러가 발생해도 앱은 계속 실행 (로그인 페이지로 이동)
      if (process.env.NODE_ENV === 'development') {
        console.warn('Auth initialization warning:', error.message)
      }
    } finally {
      setLoading(false)
      setIsInitialized(true)
    }
  }

  const signUp = async (email, password, userType) => {
    const { user, error } = await authService.signUp(email, password, userType)
    if (!error) {
      setUser(user)
    }
    return { user, error }
  }

  const signIn = async (email, password) => {
    const { user, error } = await authService.signIn(email, password)
    if (!error) {
      setUser(user)
    }
    return { user, error }
  }

  const signOut = async () => {
    const { error } = await authService.signOut()
    if (!error) {
      setUser(null)
    }
    return { error }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    userType: user?.user_metadata?.user_type || null,
    isInitialized
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 