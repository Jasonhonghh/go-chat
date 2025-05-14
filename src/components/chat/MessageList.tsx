'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { RiRobot2Line } from 'react-icons/ri';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  highlighted?: boolean;
  theme?: Theme;
}

import { Theme } from '@/hooks/useTheme';

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUserId,
  highlighted = false,
  theme = 'dark'
}) => {
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === 'image') {
      return (
        <img 
          src={message.content} 
          alt="发送的图片" 
          className="max-w-xs rounded-lg shadow-sm"
        />
      );
    } else if (message.type === 'file') {
      const fileData = message.fileData;
      const fileSize = fileData ? `${(fileData.size / 1024 / 1024).toFixed(2)} MB` : '';
      const fileUrl = message.fileData?.url || '#';
      
      return (
        <a 
          href={fileUrl} 
          download={fileData?.name}
          className="flex items-center p-3 bg-gray-100 rounded-lg"
        >
          <svg className="w-8 h-8 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div className="text-sm font-medium">{fileData?.name}</div>
            <div className="text-xs text-gray-500">{fileSize}</div>
          </div>
        </a>
      );
    } else if (message.type === 'markdown') {
      return (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      );
    } else if (message.type === 'ai') {
      return (
        <div className="flex items-start">
          <div className="mr-2 text-blue-500 mt-1">
            <RiRobot2Line className="w-5 h-5" />
          </div>
          <div className="prose prose-sm max-w-none">
            {message.summary ? (
              <>
                <div className="text-blue-500 font-medium mb-1">聊天记录总结</div>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        </div>
      );
    } else {
      return <div>{message.content}</div>;
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        const isAI = message.isAI || message.type === 'ai';
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs sm:max-w-md p-3 rounded-lg ${
                isAI 
                  ? 'bg-blue-50 text-gray-800' 
                  : isCurrentUser
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800'
              }`}
            >
              {renderMessageContent(message)}
              <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList; 