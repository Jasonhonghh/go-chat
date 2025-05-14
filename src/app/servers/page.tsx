'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSun, FaMoon, FaDiscord } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';

interface Server {
  id: string;
  name: string;
  avatar: string;
  members: number;
  owner: boolean;
}

export default function ServersPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  // 模拟服务器数据
  const [servers] = useState<Server[]>([
    {
      id: '1',
      name: '技术讨论社区',
      avatar: '/avatars/tech-group.png',
      members: 120,
      owner: true
    },
    {
      id: '2',
      name: '产品研发小组',
      avatar: '/avatars/product-group.png',
      members: 45,
      owner: false
    },
    {
      id: '3',
      name: '前端开发交流',
      avatar: '/avatars/user2.png',
      members: 78,
      owner: true
    },
    {
      id: '4',
      name: '设计师俱乐部',
      avatar: '/avatars/user1.png',
      members: 32,
      owner: false
    }
  ]);

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    // 实际应用中应调用API创建服务器
    setShowCreateModal(false);
    setNewServerName('');
  };

  const handleJoinServer = (e: React.FormEvent) => {
    e.preventDefault();
    // 实际应用中应调用API加入服务器
    setShowJoinModal(false);
    setInviteCode('');
  };

  const goBack = () => {
    router.push('/');
  };

  // 根据主题生成样式
  const styles = {
    bgMain: theme === 'dark' ? 'bg-[#36393f]' : 'bg-gray-100',
    bgCard: theme === 'dark' ? 'bg-[#2f3136]' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-[#b9bbbe]' : 'text-gray-500',
    border: theme === 'dark' ? 'border-[#202225]' : 'border-gray-200',
    button: {
      primary: 'bg-[#5865F2] hover:bg-[#4752c4] text-white',
      secondary: theme === 'dark' ? 'bg-[#4f545c] hover:bg-[#686d73] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      danger: 'bg-[#ed4245] hover:bg-[#c93a3d] text-white'
    },
    hover: theme === 'dark' ? 'hover:bg-[#36393f]' : 'hover:bg-gray-50'
  };

  return (
    <div className={`min-h-screen ${styles.bgMain}`}>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={goBack}
              className={`mr-4 ${styles.textPrimary} hover:${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-2xl font-bold ${styles.textPrimary}`}>服务器管理</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${styles.bgCard} ${styles.textPrimary}`}
            >
              {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`px-4 py-2 rounded ${styles.button.primary} flex items-center`}
            >
              <FaPlus className="mr-2" /> 创建服务器
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className={`px-4 py-2 rounded ${styles.button.secondary} flex items-center`}
            >
              加入服务器
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servers.map(server => (
            <div 
              key={server.id}
              className={`${styles.bgCard} rounded-lg shadow-md overflow-hidden border ${styles.border} transition-transform transform hover:scale-105`}
            >
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={server.avatar}
                      alt={server.name}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className={`font-bold ${styles.textPrimary}`}>{server.name}</h3>
                    <p className={`text-sm ${styles.textSecondary}`}>{server.members} 名成员</p>
                    {server.owner && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">拥有者</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button 
                    className={`flex-1 py-2 px-3 rounded ${styles.button.primary} text-sm flex items-center justify-center`}
                    onClick={() => router.push('/')}
                  >
                    进入
                  </button>
                  {server.owner ? (
                    <button className={`p-2 rounded ${styles.button.secondary}`}>
                      <FaEdit />
                    </button>
                  ) : null}
                  {server.owner ? (
                    <button className={`p-2 rounded ${styles.button.danger}`}>
                      <FaTrash />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 创建服务器模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${styles.bgCard} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${styles.textPrimary}`}>创建新服务器</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className={styles.textSecondary}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateServer}>
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${styles.textPrimary}`}>
                  服务器名称
                </label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-[#40444b] text-white border-[#202225]' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
                  placeholder="输入服务器名称"
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${styles.textPrimary}`}>
                  服务器头像
                </label>
                <div className={`border-2 border-dashed ${styles.border} rounded-lg p-4 flex flex-col items-center cursor-pointer ${styles.hover}`}>
                  <FaDiscord className={`w-12 h-12 mb-2 ${styles.textSecondary}`} />
                  <p className={`text-sm ${styles.textSecondary}`}>点击上传图片</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded ${styles.button.secondary}`}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded ${styles.button.primary}`}
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 加入服务器模态框 */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${styles.bgCard} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${styles.textPrimary}`}>加入服务器</h2>
              <button 
                onClick={() => setShowJoinModal(false)}
                className={styles.textSecondary}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleJoinServer}>
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${styles.textPrimary}`}>
                  邀请链接或代码
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-[#40444b] text-white border-[#202225]' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
                  placeholder="例如: ENf6YweS 或 https://chat.domain.com/invite/ENf6YweS"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className={`px-4 py-2 rounded ${styles.button.secondary}`}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded ${styles.button.primary}`}
                >
                  加入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 