import React, { useState, useEffect } from 'react';
import { getMessageHistory } from '../../lib/api';
import { Message } from '../../types';

export interface HistoryMessagesLoaderProps {
  chatId: string;
  onLoadHistory: (messages: Message[]) => void;
  setLoadingHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

const HistoryMessagesLoader: React.FC<HistoryMessagesLoaderProps> = ({
  chatId,
  onLoadHistory,
  setLoadingHistory
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 初始加载
  useEffect(() => {
    if (chatId) {
      loadMessages(1);
    }
  }, [chatId]);

  // 加载消息
  const loadMessages = async (pageNum: number) => {
    if (!chatId || loading || !hasMore) return;
    
    try {
      setLoading(true);
      setLoadingHistory(true);
      
      const response = await getMessageHistory(chatId, pageNum);
      const { messages, hasMore: hasMoreMessages } = response.data;
      
      onLoadHistory(messages);
      setHasMore(hasMoreMessages);
      setPage(pageNum);
    } catch (error) {
      console.error('加载历史消息失败:', error);
    } finally {
      setLoading(false);
      setLoadingHistory(false);
    }
  };

  // 加载更多
  const loadMore = () => {
    loadMessages(page + 1);
  };

  if (!chatId) return null;

  return (
    <div className="py-3 text-center">
      {hasMore ? (
        <button
          onClick={loadMore}
          disabled={loading}
          className={`btn btn-sm btn-outline ${loading ? 'loading' : ''}`}
        >
          {loading ? '加载中...' : '加载更多消息'}
        </button>
      ) : (
        <div className="text-sm text-gray-500">没有更多历史消息</div>
      )}
    </div>
  );
};

export default HistoryMessagesLoader; 