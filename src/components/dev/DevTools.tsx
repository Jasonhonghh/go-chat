'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const pages = [
    { name: '主页', path: '/' },
    { name: '登录', path: '/login' },
    { name: '注册', path: '/register' },
    { name: '发现', path: '/discover' },
    { name: '群组', path: '/groups' },
    { name: '创建群组', path: '/groups/create' },
    { name: '服务器', path: '/servers' },
    { name: '个人资料', path: '/profile' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-20 right-5 bg-purple-600 text-white p-2 rounded-full shadow-md z-50"
        onClick={() => setIsOpen(true)}
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#36393f] p-5 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-bold">开发者工具</h3>
          <button className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <h4 className="text-white text-md mb-2">页面导航</h4>
          <div className="grid grid-cols-2 gap-2">
            {pages.map((page) => (
              <button
                key={page.path}
                className="py-2 px-3 bg-[#2f3136] hover:bg-[#5865F2] text-white rounded transition-colors text-left"
                onClick={() => handleNavigate(page.path)}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-white text-md mb-2">认证操作</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              onClick={() => {
                localStorage.setItem('token', 'test-token');
                localStorage.setItem('userId', 'test-user-1');
                window.location.reload();
              }}
            >
              模拟登录
            </button>
            <button
              className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                router.push('/login');
              }}
            >
              退出登录
            </button>
          </div>
        </div>
        
        <div>
          <p className="text-gray-400 text-xs">
            开发模式工具 - 用于测试页面与功能，生产环境请删除
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
