'use client';

import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSignOutAlt, FaBell, FaShieldAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState({
    id: 'test-user-1',
    name: '测试用户',
    email: 'test@example.com',
    phone: '13800138000',
    avatar: '/avatars/default.png',
    bio: '这是一个测试账户，用于展示 Go-Chat 应用的个人资料页面。'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  
  const handleLogout = () => {
    // 清除本地存储中的认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // 重定向到登录页
    router.push('/login');
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // 在真实应用中，这里会调用 API 保存用户信息
    setUser(editForm);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="min-h-screen bg-[#36393f] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">个人资料</h1>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              退出登录
            </button>
          </div>
          
          <div className="bg-[#2f3136] rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="mb-6 md:mb-0 md:mr-6 flex flex-col items-center">
                <div className="relative">
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    width={128} 
                    height={128} 
                    className="rounded-full"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-[#5865F2] text-white rounded-full p-2">
                      <FaEdit />
                    </button>
                  )}
                </div>
                {!isEditing ? (
                  <button 
                    onClick={handleEdit}
                    className="mt-4 bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded flex items-center"
                  >
                    <FaEdit className="mr-2" />
                    编辑资料
                  </button>
                ) : (
                  <div className="mt-4 flex">
                    <button 
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      保存
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">用户名</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name"
                      value={editForm.name} 
                      onChange={handleChange}
                      className="w-full bg-[#40444b] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                    />
                  ) : (
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">电子邮箱</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email"
                      value={editForm.email} 
                      onChange={handleChange}
                      className="w-full bg-[#40444b] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                    />
                  ) : (
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-1">手机号码</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      name="phone"
                      value={editForm.phone} 
                      onChange={handleChange}
                      className="w-full bg-[#40444b] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                    />
                  ) : (
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">个人简介</label>
                  {isEditing ? (
                    <textarea 
                      name="bio"
                      value={editForm.bio} 
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-[#40444b] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                    />
                  ) : (
                    <p className="text-gray-300">{user.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2f3136] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">设置</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaBell className="text-gray-400 mr-3" />
                  <span>通知提醒</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5865F2]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaShieldAlt className="text-gray-400 mr-3" />
                  <span>双因素认证</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5865F2]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <FaMoon className="text-gray-400 mr-3" />
                  ) : (
                    <FaSun className="text-gray-400 mr-3" />
                  )}
                  <span>暗黑模式</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'} 
                    onChange={toggleTheme}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5865F2]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
