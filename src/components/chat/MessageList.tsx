'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: string;
  fileData?: any;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: zhCN });
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'text':
        return <p className="text-gray-800 break-words">{message.content}</p>;
      
      case 'markdown':
        return (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        );
      
      case 'image':
        return (
          <div className="relative w-48 h-48 rounded-lg overflow-hidden">
            <Image
              src={message.content}
              alt="消息图片"
              fill
              className="object-cover"
            />
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center p-3 bg-gray-100 rounded-lg">
            <div className="mr-3 text-blue-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{message.fileData?.name || '文件'}</p>
              <p className="text-xs text-gray-500">{message.fileData?.size ? `${(message.fileData.size / 1024).toFixed(2)} KB` : ''}</p>
            </div>
          </div>
        );
      
      default:
        return <p className="text-gray-800">{message.content}</p>;
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isCurrentUser = message.senderId === currentUserId;
    
    return (
      <div 
        key={message.id}
        className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="https://placehold.co/100x100/4f46e5/ffffff?text=用户"
                alt="用户头像"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        
        <div className={`max-w-xs md:max-w-md ${isCurrentUser ? 'order-1' : 'order-2'}`}>
          <div 
            className={`px-4 py-2 rounded-lg ${
              isCurrentUser 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            {renderMessageContent(message)}
          </div>
          <span className={`text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'} block mt-1`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        {isCurrentUser && (
          <div className="flex-shrink-0 ml-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="https://placehold.co/100x100/4f46e5/ffffff?text=我"
                alt="我的头像"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">没有消息，开始聊天吧！</p>
        </div>
      ) : (
        messages.map((message, index) => renderMessage(message, index))
      )}
    </div>
  );
} 