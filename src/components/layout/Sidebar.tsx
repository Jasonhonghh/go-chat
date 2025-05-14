'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlus, FaSearch, FaSignOutAlt, FaDiscord, FaCompass, FaUsers, FaSun, FaMoon, FaServer } from 'react-icons/fa';
import { useChatStore } from '@/store/chatStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
}

// 默认头像的占位符
const getDefaultAvatar = (name: string) => {
  // 创建一个简单的颜色哈希值
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const intToRGB = (i: number) => {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  };

  const color = '#' + intToRGB(hashCode(name));
  const initial = name.charAt(0).toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${initial}&background=${color.substring(1)}&color=fff&size=200`;
};

export default function Sidebar({ user, activeChat, setActiveChat }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, setChats } = useChatStore();
  const [filteredChats, setFilteredChats] = useState(chats);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // 模拟从API获取聊天列表
    // 实际应用中，这里应该调用API获取数据
    const fetchChats = async () => {
      // 模拟数据
      const mockChats = [
        {
          id: '1',
          name: '技术讨论组',
          avatar: '/avatars/tech-group.png',
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
          avatar: '/avatars/user1.png',
          lastMessage: {
            content: '下午3点开会，别忘了',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          unreadCount: 0,
          isGroup: false,
        },
        {
          id: '3',
          name: '李四',
          avatar: '/avatars/user2.png',
          lastMessage: {
            content: '项目进展如何？',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          },
          unreadCount: 3,
          isGroup: false,
        },
        {
          id: '4',
          name: '产品研发组',
          avatar: '/avatars/product-group.png',
          lastMessage: {
            content: '新版本已经发布',
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          },
          unreadCount: 0,
          isGroup: true,
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

  const navigateToServers = () => {
    router.push('/servers');
  };

  const bgColors = {
    serverList: theme === 'dark' ? 'bg-[#202225]' : 'bg-gray-200',
    channelList: theme === 'dark' ? 'bg-[#2f3136]' : 'bg-gray-100',
    iconBg: theme === 'dark' ? 'bg-[#36393f]' : 'bg-white',
    iconHover: theme === 'dark' ? 'hover:bg-[#5865F2]' : 'hover:bg-blue-500',
    textColor: theme === 'dark' ? 'text-[#dcddde]' : 'text-gray-700',
    textColorDim: theme === 'dark' ? 'text-[#b9bbbe]' : 'text-gray-500',
    textColorHeader: theme === 'dark' ? 'text-[#8e9297]' : 'text-gray-600',
    activeItem: theme === 'dark' ? 'bg-[#393c43]' : 'bg-gray-200',
    hoverItem: theme === 'dark' ? 'hover:bg-[#36393f]' : 'hover:bg-gray-50',
    divider: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    statusIndicator: 'bg-green-500'
  };

  return (
    <div className="flex h-full">
      {/* 服务器列表侧边栏 - Discord 风格 */}
      <div className={`w-[72px] ${bgColors.serverList} h-full flex flex-col items-center py-3 space-y-2`}>
        <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white cursor-pointer hover:rounded-2xl transition-all duration-200">
          <FaDiscord className="w-6 h-6" />
        </div>
        
        <div className={`w-8 border-b ${bgColors.divider} my-1`}></div>
        
        <div 
          className={`w-12 h-12 rounded-full ${bgColors.iconBg} ${bgColors.iconHover} flex items-center justify-center ${bgColors.textColor} hover:text-white cursor-pointer hover:rounded-2xl transition-all duration-200`}
          onClick={navigateToServers}
        >
          <FaServer className="w-5 h-5" />
        </div>
        
        <div className={`w-12 h-12 rounded-full ${bgColors.iconBg} ${bgColors.iconHover} flex items-center justify-center ${bgColors.textColor} hover:text-white cursor-pointer hover:rounded-2xl transition-all duration-200`}>
          <FaUsers className="w-5 h-5" />
        </div>
        
        <div className={`w-12 h-12 rounded-full ${bgColors.iconBg} ${bgColors.iconHover} flex items-center justify-center ${bgColors.textColor} hover:text-white cursor-pointer hover:rounded-2xl transition-all duration-200`}>
          <FaCompass className="w-5 h-5" />
        </div>

        <div 
          className={`w-12 h-12 rounded-full ${bgColors.iconBg} ${bgColors.iconHover} flex items-center justify-center ${bgColors.textColor} hover:text-white cursor-pointer hover:rounded-2xl transition-all duration-200`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </div>
      </div>
      
      {/* 频道和私聊列表 */}
      <div className={`w-[240px] ${bgColors.channelList} flex flex-col`}>
        {/* 搜索栏 */}
        <div className="p-3">
          <div className={`relative ${theme === 'dark' ? 'bg-[#202225]' : 'bg-gray-200'} rounded-md`}>
            <input
              type="text"
              placeholder="搜索聊天..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-1 px-3 bg-transparent ${bgColors.textColor} text-sm rounded-md focus:outline-none`}
            />
            <FaSearch className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${bgColors.textColorDim} w-3 h-3`} />
          </div>
        </div>
        
        {/* 私信区域 */}
        <div className="flex-1 overflow-y-auto scrollbar-discord">
          <div className="px-3 pt-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-xs uppercase font-semibold ${bgColors.textColorHeader}`}>私信</h3>
              <FaPlus className={`${bgColors.textColorHeader} w-3 h-3 cursor-pointer`} />
            </div>
            
            {/* 过滤后的私人聊天列表 */}
            {filteredChats.filter(chat => !chat.isGroup).map(chat => (
              <div 
                key={chat.id}
                className={`flex items-center px-2 py-2 rounded my-1 cursor-pointer ${activeChat === chat.id ? bgColors.activeItem : bgColors.hoverItem}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={chat.avatar || getDefaultAvatar(chat.name)}
                      alt={chat.name}
                      width={32}
                      height={32}
                      className="object-cover"
                      unoptimized={!chat.avatar}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#2f3136]"></div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium truncate ${bgColors.textColor}`}>{chat.name}</span>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { locale: zhCN, addSuffix: false })}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className={`text-xs truncate ${bgColors.textColorDim}`}>{chat.lastMessage.content}</p>
                  )}
                </div>
                {chat.unreadCount > 0 && (
                  <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* 群组区域 */}
          <div className="px-3 pt-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-xs uppercase font-semibold ${bgColors.textColorHeader}`}>群组</h3>
              <FaPlus className={`${bgColors.textColorHeader} w-3 h-3 cursor-pointer`} />
            </div>
            
            {/* 过滤后的群组聊天 */}
            {filteredChats.filter(chat => chat.isGroup).map(chat => (
              <div 
                key={chat.id}
                className={`flex items-center px-2 py-2 rounded my-1 cursor-pointer ${activeChat === chat.id ? bgColors.activeItem : bgColors.hoverItem}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white">
                  <span className="text-xs font-bold">{chat.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium truncate ${bgColors.textColor}`}>{chat.name}</span>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { locale: zhCN, addSuffix: false })}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className={`text-xs truncate ${bgColors.textColorDim}`}>
                      <span className="font-medium">{chat.lastMessage.senderName || 'User'}: </span>
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                {chat.unreadCount > 0 && (
                  <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部用户信息 */}
        <div className={`p-2 border-t ${bgColors.divider}`}>
          <div className={`flex items-center justify-between py-1.5 px-2 ${bgColors.hoverItem} rounded cursor-pointer relative group`}>
            <div className="flex items-center">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar || getDefaultAvatar(user.name)}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="object-cover"
                    unoptimized={!user.avatar}
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#2f3136]"></div>
              </div>
              <div className="ml-2 min-w-0">
                <span className={`text-sm font-medium truncate block ${bgColors.textColor}`}>{user.name}</span>
                <span className="text-xs text-green-500">在线</span>
              </div>
            </div>
            <div className="flex">
              <button 
                onClick={handleLogout}
                className="text-red-500 p-1.5 rounded hover:bg-red-500 hover:bg-opacity-20 group-hover:opacity-100 opacity-0 transition-opacity"
              >
                <FaSignOutAlt className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 