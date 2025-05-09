'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaInfoCircle } from 'react-icons/fa';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: string;
  fileData?: any;
  timestamp: string;
}

interface ChatContainerProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  chatId: string | null;
  messages: Message[];
  onSendMessage: (content: string, type?: string, fileData?: any) => void;
}

export default function ChatContainer({ user, chatId, messages, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700">选择一个会话开始聊天</h3>
          <p className="text-gray-500 mt-1">或者创建一个新的会话</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* 聊天头部 */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="https://placehold.co/100x100/4f46e5/ffffff?text=群组"
              alt="Chat Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">技术讨论组</h3>
            <p className="text-xs text-gray-500">5 人在线</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <FaInfoCircle className="w-5 h-5" />
        </button>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <MessageList messages={messages} currentUserId={user.id} />
        <div ref={messagesEndRef} />
      </div>

      {/* 消息输入 */}
      <div className="p-4 border-t border-gray-200">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
} 