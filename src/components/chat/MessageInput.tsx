'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { 
  FaPaperPlane, 
  FaSmile, 
  FaImage, 
  FaPaperclip, 
  FaMarkdown 
} from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import AIAssistantButton from './AIAssistantButton';
import { chatWithAI, summarizeMessages, uploadFile } from '../../lib/api';

import { Theme } from '@/hooks/useTheme';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'markdown' | 'ai', fileData?: any) => void;
  chatId?: string | null;
  theme?: Theme;
}

export default function MessageInput({ onSendMessage, chatId, theme = 'dark' }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message, isMarkdown ? 'markdown' : 'text');
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    // 对于图片，我们创建一个预览URL并上传
    if (type === 'image') {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            // 显示预览
            const previewUrl = event.target.result as string;
            
            // 上传文件并获取URL
            const response = await uploadFile(file, chatId);
            const fileUrl = response.data.url;
            
            // 发送消息
            onSendMessage(
              previewUrl,
              'image',
              { 
                name: file.name, 
                size: file.size, 
                type: file.type,
                url: fileUrl 
              }
            );
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('上传图片失败:', error);
      }
    } else {
      // 对于文件，我们上传并获取URL
      try {
        const response = await uploadFile(file, chatId);
        const fileUrl = response.data.url;
        
        onSendMessage(
          `文件: ${file.name}`,
          'file',
          { 
            name: file.name, 
            size: file.size, 
            type: file.type,
            url: fileUrl 
          }
        );
      } catch (error) {
        console.error('上传文件失败:', error);
      }
    }

    // 清除input的值，以便同一文件可以再次选择
    e.target.value = '';
  };

  // AI助手交互
  const handleAIAssistant = async () => {
    if (!message.trim() || !chatId) return;
    
    try {
      setAiLoading(true);
      // 先发送用户消息
      onSendMessage(message, 'text');
      
      // 请求AI回复
      const response = await chatWithAI(message, chatId);
      
      // 发送AI回复
      onSendMessage(response.data.content, 'ai', { isAI: true });
    } catch (error) {
      console.error('AI助手回复失败:', error);
    } finally {
      setAiLoading(false);
      setMessage('');
    }
  };

  // AI总结聊天记录
  const handleAISummarize = async () => {
    if (!chatId) return;
    
    try {
      setAiLoading(true);
      const response = await summarizeMessages(chatId);
      
      // 发送AI总结
      onSendMessage(response.data.summary, 'ai', { 
        isAI: true, 
        summary: true 
      });
    } catch (error) {
      console.error('总结聊天记录失败:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex items-center space-x-1 px-3">
          <AIAssistantButton 
            onAIAssistantClick={handleAIAssistant}
            onAISummarizeClick={handleAISummarize}
          />
          
          <button 
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaSmile className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaImage className="w-5 h-5" />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'image')}
            />
          </button>
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaPaperclip className="w-5 h-5" />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'file')}
            />
          </button>
          
          <button 
            type="button"
            onClick={() => setIsMarkdown(!isMarkdown)}
            className={`${isMarkdown ? 'text-primary' : 'text-gray-500'} hover:text-gray-700`}
          >
            <FaMarkdown className="w-5 h-5" />
          </button>
        </div>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isMarkdown ? "输入Markdown消息..." : "输入消息..."}
          className="flex-1 px-3 py-2 outline-none resize-none h-12 max-h-24"
          rows={1}
        />
        
        <button 
          type="submit"
          disabled={!message.trim() || aiLoading}
          className={`px-4 py-3 ${
            message.trim() && !aiLoading ? 'text-primary hover:bg-blue-50' : 'text-gray-400'
          }`}
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
      
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 right-0 z-10">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </form>
  );
}