import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { searchMessages } from '../../lib/api';
import { Message } from '../../types';
import { Theme } from '@/hooks/useTheme';

export interface MessageSearchBarProps {
  chatId: string;
  onSearch: (messages: Message[]) => void;
  onClear: () => void;
  searchActive: boolean;
  theme?: Theme;
}

const MessageSearchBar: React.FC<MessageSearchBarProps> = ({ 
  chatId, 
  onSearch, 
  onClear,
  searchActive,
  theme = 'dark'
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatId || !query.trim()) return;
    
    try {
      setLoading(true);
      const response = await searchMessages(chatId, query);
      onSearch(response.data.messages);
    } catch (error) {
      console.error('搜索消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  // 适配主题的样式
  const buttonClass = theme === 'dark' 
    ? 'text-gray-400 hover:bg-[#2f3136] hover:text-white' 
    : 'text-gray-500 hover:bg-gray-100';
    
  const inputClass = theme === 'dark'
    ? 'bg-[#40444b] border-[#40444b] text-white placeholder-gray-400 focus:ring-[#5865f2]'
    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary';

  // 紧凑模式 - 如果不在搜索状态
  if (!expanded && !searchActive) {
    return (
      <button 
        onClick={() => setExpanded(true)} 
        className={`p-2 rounded-full ${buttonClass}`}
      >
        <FaSearch className="w-5 h-5" />
      </button>
    );
  }

  // 展开模式或搜索结果显示中
  return (
    <form onSubmit={handleSearch} className="w-full flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="搜索消息..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full py-2 px-4 pr-10 rounded-lg border ${inputClass}`}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${buttonClass}`}
        >
          <FaSearch className="w-5 h-5" />
        </button>
      </div>
      
      {searchActive ? (
        <button
          type="button"
          onClick={handleClear}
          className={`p-2 rounded-full ${buttonClass}`}
          title="清除搜索结果"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className={`p-2 text-sm ${buttonClass}`}
        >
          取消
        </button>
      )}
    </form>
  );
};

export default MessageSearchBar; 