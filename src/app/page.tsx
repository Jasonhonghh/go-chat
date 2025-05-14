'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ChatContainer from '@/components/chat/ChatContainer';
import BottomNav from '@/components/layout/BottomNav';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: '',
    name: '',
    avatar: ''
  });
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { chats, messages, setChats, setMessages } = useChatStore();
  
  // 添加测试数据
  useEffect(() => {
    // 模拟聊天数据
    const testChats = [
      {
        id: 'chat1',
        name: '技术讨论群',
        avatar: '/avatars/tech-group.png',
        lastMessage: {
          content: '大家有人用过 Next.js 14 吗？',
          timestamp: new Date().toISOString()
        },
        unreadCount: 3,
        isGroup: true
      },
      {
        id: 'chat2',
        name: '产品设计群',
        avatar: '/avatars/product-group.png',
        lastMessage: {
          content: '新的设计稿已经上传到共享文档了',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        unreadCount: 0,
        isGroup: true
      },
      {
        id: 'chat3',
        name: '张三',
        avatar: '/avatars/user1.png',
        lastMessage: {
          content: '晚上有时间开个会吗？',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        unreadCount: 1,
        isGroup: false
      }
    ];
    
    // 模拟消息数据
    const testMessages: Record<string, Message[]> = {
      'chat1': [
        {
          id: 'msg1',
          senderId: 'user2',
          content: '大家有人用过 Next.js 14 吗？',
          type: 'text',
          timestamp: new Date().toISOString()
        },
        {
          id: 'msg2',
          senderId: 'user3',
          content: '我用过，App Router 挺好用的',
          type: 'text',
          timestamp: new Date(Date.now() - 60000).toISOString()
        }
      ],
      'chat2': [
        {
          id: 'msg3',
          senderId: 'user4',
          content: '新的设计稿已经上传到共享文档了',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      'chat3': [
        {
          id: 'msg4',
          senderId: 'chat3',
          content: '晚上有时间开个会吗？',
          type: 'text',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    } as Record<string, Message[]>;
    
    setChats(testChats);
    Object.entries(testMessages).forEach(([chatId, msgs]) => {
      setMessages(chatId, msgs);
    });
  }, [setChats, setMessages]);
  
  const { chats: currentChats, messages: currentMessages } = useChatStore();
  
  // 测试模式：始终使用测试用户数据，绕过登录验证
  useEffect(() => {
    // 客户端环境检查
    if (typeof window !== "undefined") {
      // 设置一个测试用户，用于开发测试
      setUser({
        id: '1',
        name: '测试用户',
        avatar: '/avatars/default.png'
      });
      // 模拟登录成功
      localStorage.setItem('token', 'test-token-for-development');
      setLoading(false);
      
      // 注释掉正常的登录检查逻辑
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   router.push('/login');
      // } else {
      //   setLoading(false);
      // }
    }
  }, [router]);
  
  // 页面加载状态
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#36393f]">
        <div className="text-center">
          <Image src="/logo.png" alt="Go-Chat" width={100} height={100} className="mx-auto" />
          <p className="mt-4 text-white text-xl">加载中...</p>
        </div>
      </div>
    );
  }
  
  // 如果没有选中的聊天，显示欢迎界面
  const renderContent = () => {
    if (!activeChat) {
      return (
        <div className="flex-1 flex items-center justify-center bg-[#36393f] text-center p-4 relative overflow-hidden">
          <div className="z-10 max-w-md">
            <Image src="/logo.png" alt="Go-Chat" width={120} height={120} className="mx-auto" />
            <h1 className="mt-4 text-white text-2xl font-bold">欢迎使用 Go-Chat</h1>
            <p className="mt-2 text-gray-400">选择一个聊天开始，或创建一个新的聊天</p>
          </div>
        </div>
      );
    }
    
    return (
      <ChatContainer 
        user={user}
        chatId={activeChat}
        messages={currentMessages[activeChat] || []}
        onSendMessage={(message) => console.log('发送消息:', message)}
      />
    );
  };

  return (
    <main className="flex h-screen bg-[#36393f] text-white overflow-hidden">
      {/* 侧边栏：在桌面视图显示，在移动视图隐藏 */}
      <div className="hidden md:block w-60 min-w-[240px] bg-[#2f3136] h-full max-h-screen overflow-y-auto flex-shrink-0">
        <Sidebar 
          user={user}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>
      
      {/* 聊天主区域 */}
      <div className="flex flex-col flex-1 h-full max-h-screen overflow-hidden">
        <StatusBar user={user} />
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>
      
      {/* 移动端底部导航 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
        <BottomNav />
      </div>
    </main>
  );
}
