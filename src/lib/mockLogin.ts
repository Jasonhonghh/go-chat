// 这是一个用于测试的模拟登录实用工具
// 开发环境使用，生产环境请删除

import { useState, useEffect } from 'react';

export const setupMockUser = () => {
  // 创建一个模拟用户
  const mockUser = {
    id: 'test-user-1',
    name: '测试用户',
    avatar: '/avatars/default.png'
  };

  // 存储到本地存储中
  localStorage.setItem('token', 'mock-jwt-token-for-testing');
  localStorage.setItem('userId', mockUser.id);
  
  // 返回用户数据
  return mockUser;
};

export const useMockAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 检查是否已有测试令牌
    const token = localStorage.getItem('token');
    if (token) {
      const mockUser = {
        id: localStorage.getItem('userId') || 'test-user-1',
        name: '测试用户',
        avatar: '/avatars/default.png'
      };
      setUser(mockUser);
      setIsLoggedIn(true);
    } else {
      // 如果没有，则创建测试用户
      const mockUser = setupMockUser();
      setUser(mockUser);
      setIsLoggedIn(true);
    }
  }, []);
  
  return { isLoggedIn, user };
};

// 直接登录方法
export const directLogin = () => {
  setupMockUser();
  return true;
};

// 直接登出方法
export const directLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  return true;
};
