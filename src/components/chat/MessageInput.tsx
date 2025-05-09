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

interface MessageInputProps {
  onSendMessage: (content: string, type?: string, fileData?: any) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 对于图片，我们创建一个预览URL
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSendMessage(
            event.target.result as string,
            'image',
            { name: file.name, size: file.size, type: file.type }
          );
        }
      };
      reader.readAsDataURL(file);
    } else {
      // 对于文件，我们只传递文件信息
      onSendMessage(
        `文件: ${file.name}`,
        'file',
        { name: file.name, size: file.size, type: file.type }
      );
    }

    // 清除input的值，以便同一文件可以再次选择
    e.target.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex items-center space-x-1 px-3">
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
          disabled={!message.trim()}
          className={`px-4 py-3 ${
            message.trim() ? 'text-primary hover:bg-blue-50' : 'text-gray-400'
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