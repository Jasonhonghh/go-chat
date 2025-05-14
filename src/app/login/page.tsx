'use client';

import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import SMSLoginForm from '../../components/auth/SMSLoginForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'password' | 'sms'>('password');
  const router = useRouter();
  
  // 添加测试模式直接登录功能
  const handleTestLogin = () => {
    localStorage.setItem('token', 'test-token-for-development');
    localStorage.setItem('userId', 'test-user-1');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#202225] flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full p-8 bg-[#36393f] rounded-lg shadow-lg">
        {/* 测试模式按钮 */}
        <div className="w-full mb-4">
          <button
            onClick={handleTestLogin}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-medium transition-colors"
          >
            快速测试登录（开发模式）
          </button>
        </div>
        
        <div className="w-full mb-6">
          <div className="flex rounded-md overflow-hidden">
            <button
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'password' 
                  ? 'bg-[#5865F2] text-white' 
                  : 'bg-[#2f3136] text-[#b9bbbe] hover:bg-[#36393f] hover:text-white'
              }`}
              onClick={() => setTab('password')}
            >
              账号密码登录
            </button>
            <button
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'sms' 
                  ? 'bg-[#5865F2] text-white' 
                  : 'bg-[#2f3136] text-[#b9bbbe] hover:bg-[#36393f] hover:text-white'
              }`}
              onClick={() => setTab('sms')}
            >
              短信登录
            </button>
          </div>
        </div>
        {tab === 'password' ? <LoginForm /> : <SMSLoginForm />}
      </div>
      
      <div className="mt-6 flex items-center text-[#b9bbbe] text-sm">
        <span>Powered by</span>
        <Image
          src="/images/discord-logo.png"
          alt="Discord-style Chat"
          width={80}
          height={24}
          className="ml-2"
        />
      </div>
    </div>
  );
};

export default LoginPage;