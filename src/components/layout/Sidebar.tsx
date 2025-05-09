'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlus, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useChatStore } from '@/store/chatStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface SidebarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
}

export default function Sidebar({ user, activeChat, setActiveChat }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, setChats } = useChatStore();
  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    // 模拟从API获取聊天列表
    // 实际应用中，这里应该调用API获取数据
    const fetchChats = async () => {
      // 模拟数据
      const mockChats = [
        {
          id: '1',
          name: '技术讨论组',
          avatar: 'https://placehold.co/100x100/4f46e5/ffffff?text=技术',
          lastMessage: {
            content: '大家好，有人在线吗？',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          },
          unreadCount: 2,
          isGroup: true,
        },
        {
          id: '2',
          name: '张三',
          avatar: 'https://placehold.co/100x100/4f46e5/ffffff?text=张三',
          lastMessage: {
            content: '下午3点开会，别忘了',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          unreadCount: 0,
          isGroup: false,
        },
      ];
      
      setChats(mockChats);
    };

    fetchChats();
  }, [setChats]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredChats(
        chats.filter(chat => 
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredChats(chats);
    }
  }, [searchTerm, chats]);

  const handleLogout = () => {
    localStorage.removeItem('chat-user');
    window.location.reload();
  };

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* 用户信息区域 */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={user.avatar || `https://placehold.co/100x100/4f46e5/ffffff?text=${user.name[0]}`}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-xs text-gray-500">在线</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaSignOutAlt className="w-5 h-5" />
        </button>
      </div>

      {/* 搜索框 */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天或消息"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4 flex justify-between items-center">
          <h3 className="font-medium text-gray-700">对话</h3>
          <button className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white hover:bg-blue-600">
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
        <div className="px-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeChat === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  fill
                  className="object-cover"
                />
                {chat.isGroup && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-900">{chat.name}</h4>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { 
                        addSuffix: true,
                        locale: zhCN
                      })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 truncate w-44">
                      {chat.lastMessage.content}
                    </p>
                  )}
                  {chat.unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 