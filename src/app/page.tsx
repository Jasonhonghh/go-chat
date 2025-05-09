'use client';

import { useEffect, useState } from 'react';
import ChatLayout from '@/components/layout/ChatLayout';
import Login from '@/components/auth/Login';

export default function Home() {
  const [user, setUser] = useState<{ id: string; name: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const storedUser = localStorage.getItem('chat-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: { id: string; name: string; avatar: string }) => {
    setUser(userData);
    localStorage.setItem('chat-user', JSON.stringify(userData));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <ChatLayout user={user} />;
} 