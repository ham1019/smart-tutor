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

  useEffect(() => {
    // 앱 시작 시 현재 사용자 확인
    checkCurrentUser()
    
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

  const checkCurrentUser = async () => {
    try {
      const { user, error } = await authService.getCurrentUser()
      if (error) {
        console.error('Error getting current user:', error)
      }
      setUser(user)
    } catch (error) {
      console.error('Error checking current user:', error)
    } finally {
      setLoading(false)
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
    userType: user?.user_metadata?.user_type || null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 