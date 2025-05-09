'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatContainer from '../chat/ChatContainer';
import { useChatStore } from '@/store/chatStore';
import useWebSocket from '@/hooks/useWebSocket';

interface ChatLayoutProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function ChatLayout({ user }: ChatLayoutProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { messages, addMessage } = useChatStore();
  const { connect, disconnect, send } = useWebSocket({
    onMessage: (data) => {
      // 处理接收到的消息
      if (data.type === 'message') {
        addMessage(data.chatId, data.message);
      }
    },
    onConnect: () => {
      console.log('WebSocket连接成功');
    },
    onDisconnect: () => {
      console.log('WebSocket连接断开');
    }
  });

  useEffect(() => {
    // 连接WebSocket
    connect(`ws://localhost:8080/ws?userId=${user.id}`);

    return () => {
      // 组件卸载时断开连接
      disconnect();
    };
  }, [user.id, connect, disconnect]);

  const handleSendMessage = (content: string, type = 'text', fileData?: any) => {
    if (!activeChat) return;
    
    const message = {
      id: Date.now().toString(),
      senderId: user.id,
      content,
      type,
      fileData,
      timestamp: new Date().toISOString(),
    };

    // 发送消息到WebSocket
    send({
      type: 'message',
      chatId: activeChat,
      message
    });

    // 将消息添加到本地状态
    addMessage(activeChat, message);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} activeChat={activeChat} setActiveChat={setActiveChat} />
      <ChatContainer 
        user={user} 
        chatId={activeChat} 
        messages={activeChat ? messages[activeChat] || [] : []} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
} 