import React from 'react'
import { useAuth } from '../AuthContext'

const PrivateRoute = ({ children, requiredUserType = null }) => {
  const { user, loading, userType } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        로딩 중...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>로그인이 필요합니다</h2>
        <p>이 페이지에 접근하려면 로그인해주세요.</p>
      </div>
    )
  }

  // 특정 사용자 타입이 요구되는 경우
  if (requiredUserType && userType !== requiredUserType) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>접근 권한이 없습니다</h2>
        <p>이 페이지에 접근할 권한이 없습니다.</p>
      </div>
    )
  }

  return children
}

export default PrivateRoute 