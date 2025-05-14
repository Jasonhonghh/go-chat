'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaInfoCircle, FaHashtag, FaTimes, FaUserFriends, FaPaperclip, FaGift, FaImage, FaDiscord } from 'react-icons/fa';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearchBar from './MessageSearchBar';
import HistoryMessagesLoader from './HistoryMessagesLoader';
import CallButtons from './CallButtons';
import CallModal from './CallModal';
import useWebRTC from '../../hooks/useWebRTC';
import useWebSocket from '../../hooks/useWebSocket';
import { CallType, CallSignal, Message } from '../../types';
import { useTheme } from '@/hooks/useTheme';
import { useChatStore } from '@/store/chatStore';

interface ChatContainerProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  chatId: string | null;
  messages: Message[];
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'markdown' | 'ai', fileData?: any) => void;
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

export default function ChatContainer({ user, chatId, messages: initialMessages, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchResults, setSearchResults] = useState<Message[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const { theme } = useTheme();
  
  // 音视频通话相关状态
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<CallType>('audio');
  const [callRemoteUserId, setCallRemoteUserId] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<null | { from: string; callType: CallType; sdp: any }>(null);

  // WebRTC hook
  const {
    callState,
    startCall,
    answerCall,
    handleSignal,
    hangup,
  } = useWebRTC({
    onSignal: (signal: CallSignal) => {
      // 通过 WebSocket 发送信令
      if (signal.to) {
        send({ ...signal, from: user.id });
      }
    },
    onRemoteStream: () => {}, // 已在 CallModal 处理
    onCallEnd: () => {
      setCallModalOpen(false);
      setCallRemoteUserId(null);
      setIncomingCall(null);
    },
  });

  const { localStream, remoteStream } = callState;

  // WebSocket hook
  const { connect, disconnect, send } = useWebSocket({
    onMessage: (data) => {
      // 处理信令消息
      if (data.type && data.type.startsWith('call:')) {
        if (data.type === 'call:offer' && data.to === user.id) {
          // 收到呼叫
          setIncomingCall({ from: data.from, callType: data.callType, sdp: data.sdp });
        } else if (data.type === 'call:answer' && data.to === user.id) {
          handleSignal(data);
        } else if (data.type === 'call:candidate' && data.to === user.id) {
          handleSignal(data);
        } else if (data.type === 'call:hangup' && data.to === user.id) {
          hangup();
        }
      }
      // 其他消息处理可以在这里添加
    },
  });

  // 当 initialMessages 变化时更新本地消息状态
  useEffect(() => {
    if (!searchResults) {
      setMessages(initialMessages);
    }
  }, [initialMessages, searchResults]);

  // 处理历史消息加载
  const handleLoadHistory = (historyMessages: Message[]) => {
    if (searchResults) {
      setSearchResults(null);
    }
    setMessages(prev => [...historyMessages, ...prev]);
  };

  // 处理消息搜索
  const handleSearchResults = (results: Message[]) => {
    setSearchResults(results);
  };

  // 清除搜索结果
  const clearSearchResults = () => {
    setSearchResults(null);
  };

  // 获取实际显示的消息
  const displayMessages = searchResults || messages;

  // 连接 WebSocket
  useEffect(() => {
    if (user.id) {
      connect(`ws://localhost:8080/ws?userId=${user.id}`);
      return () => disconnect();
    }
  }, [user.id, connect, disconnect]);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发起通话
  const handleCall = useCallback((type: CallType) => {
    if (!chatId) return;
    setCallType(type);
    setCallRemoteUserId(chatId);
    setCallModalOpen(true);
    startCall(chatId, type);
  }, [chatId, startCall]);

  // 接听通话
  const handleAcceptCall = useCallback(() => {
    if (incomingCall) {
      setCallType(incomingCall.callType);
      setCallRemoteUserId(incomingCall.from);
      setCallModalOpen(true);
      answerCall(incomingCall.from, incomingCall.callType, incomingCall.sdp);
      setIncomingCall(null);
    }
  }, [incomingCall, answerCall]);

  // 拒绝/挂断通话
  const handleHangup = useCallback(() => {
    if (callRemoteUserId) {
      send({ type: 'call:hangup', from: user.id, to: callRemoteUserId });
    }
    hangup();
    setCallModalOpen(false);
    setCallRemoteUserId(null);
  }, [callRemoteUserId, user.id, send, hangup]);

  // 切换用户列表显示
  const toggleUserList = () => {
    setShowUserList(!showUserList);
  };

  // 主题相关样式
  const bgColors = {
    main: theme === 'dark' ? 'bg-[#36393f]' : 'bg-white',
    secondary: theme === 'dark' ? 'bg-[#2f3136]' : 'bg-gray-100',
    header: theme === 'dark' ? 'bg-[#36393f]' : 'bg-white',
    input: theme === 'dark' ? 'bg-[#40444b]' : 'bg-gray-100',
    textColor: theme === 'dark' ? 'text-[#dcddde]' : 'text-gray-800',
    textColorDim: theme === 'dark' ? 'text-[#b9bbbe]' : 'text-gray-500',
    textColorHeader: theme === 'dark' ? 'text-[#8e9297]' : 'text-gray-600',
    border: theme === 'dark' ? 'border-[#2d2f33]' : 'border-gray-200',
    divider: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    hoverBg: theme === 'dark' ? 'hover:bg-[#32353a]' : 'hover:bg-gray-100',
    focusBg: theme === 'dark' ? 'focus:bg-[#40444b]' : 'focus:bg-white',
    card: theme === 'dark' ? 'bg-[#2f3136]' : 'bg-white',
  };

  const headerHeight = '48px';
  const footerHeight = '68px';

  // 如果没有活动聊天，显示欢迎界面
  if (!chatId) {
    return (
      <div className={`flex-1 ${bgColors.main} flex flex-col items-center justify-center`}>
        <div className="text-center p-8 rounded-lg max-w-lg">
          <FaDiscord className={`w-20 h-20 mx-auto mb-6 ${theme === 'dark' ? 'text-[#5865F2]' : 'text-[#5865F2]'}`} />
          <h2 className={`text-2xl font-bold mb-3 ${bgColors.textColor}`}>欢迎使用 Go-Chat</h2>
          <p className={`mb-4 ${bgColors.textColorDim}`}>
            选择一个聊天或开始一个新的对话。
          </p>
        </div>
      </div>
    );
  }

  // 从 store 获取聊天列表
  const { chats } = useChatStore();
  
  // 查找当前聊天对象信息
  const currentChat = chats.find(chat => chat.id === chatId);

  return (
    <div className={`flex-1 flex flex-col ${bgColors.main} overflow-hidden h-full max-h-full relative`}>
      {/* 聊天头部 */}
      <div 
        className={`flex items-center px-4 ${bgColors.header} ${bgColors.border} border-b flex-shrink-0`}
        style={{ height: headerHeight }}
      >
        <div className="flex items-center">
          {currentChat?.isGroup ? (
            <div className={`w-6 h-6 rounded-md ${bgColors.secondary} flex items-center justify-center mr-2 ${bgColors.textColor}`}>
              <FaHashtag className="w-3 h-3" />
            </div>
          ) : (
            <div className="relative w-7 h-7 rounded-full overflow-hidden mr-2">
              <Image
                src={currentChat?.avatar || getDefaultAvatar(currentChat?.name || 'User')}
                alt={currentChat?.name || 'User'}
                width={28}
                height={28}
                className="object-cover"
                unoptimized={!currentChat?.avatar}
              />
            </div>
          )}
          <h2 className={`font-semibold text-base ${bgColors.textColor}`}>
            {currentChat?.name || 'Chat'}
          </h2>
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <CallButtons 
            onCall={handleCall} 
            isGroup={currentChat?.isGroup || false}
            theme={theme}
          />
          <button 
            onClick={toggleUserList}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${bgColors.hoverBg}`}
          >
            <FaUserFriends className={bgColors.textColor} size={16} />
          </button>
          <button className={`w-8 h-8 rounded-md flex items-center justify-center ${bgColors.hoverBg}`}>
            <FaInfoCircle className={bgColors.textColor} size={16} />
          </button>
        </div>
      </div>

      {/* 搜索栏（如果需要的话） */}
      <MessageSearchBar 
        onSearch={handleSearchResults} 
        onClear={clearSearchResults} 
        chatId={chatId} 
        searchActive={!!searchResults}
        theme={theme}
      />

      {/* 聊天区域 */}
      <div className="relative flex-1 overflow-hidden max-h-[calc(100%-96px)]">
        <div className={`flex h-full max-h-full`}>
          {/* 主聊天区域 */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* 历史消息加载器 */}
            {loadingHistory && (
              <div className={`py-2 text-center ${bgColors.textColorDim}`}>
                正在加载历史消息...
              </div>
            )}
            
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto scrollbar-discord pb-2 px-4 max-h-[calc(100%-70px)]">
              <HistoryMessagesLoader onLoadHistory={handleLoadHistory} setLoadingHistory={setLoadingHistory} chatId={chatId} />
              
              {displayMessages && displayMessages.length > 0 ? (
                <MessageList 
                  messages={displayMessages} 
                  currentUserId={user.id} 
                  highlighted={searchResults !== null}
                  theme={theme}
                />
              ) : (
                <div className={`flex items-center justify-center h-full ${bgColors.textColorDim}`}>
                  {searchResults ? '没有找到匹配的消息' : '没有消息'}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 消息输入框 */}
            <div 
              className={`px-4 py-3 ${bgColors.main} ${bgColors.border} border-t`}
              style={{ minHeight: footerHeight }}
            >
              <MessageInput onSendMessage={onSendMessage} theme={theme} />
            </div>
          </div>

          {/* 用户列表侧边栏 */}
          {showUserList && (
            <div 
              className={`w-60 ${bgColors.secondary} border-l ${bgColors.border} flex flex-col`}
            >
              <div className={`p-3 border-b ${bgColors.border} font-medium ${bgColors.textColor}`}>
                成员 - 3
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className={`p-2 ${bgColors.hoverBg} cursor-pointer`}>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={user.avatar || getDefaultAvatar(user.name)}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                        unoptimized={!user.avatar}
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#2f3136]"></div>
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${bgColors.textColor}`}>{user.name} <span className="text-green-500 ml-1">•</span></div>
                      <div className={`text-xs ${bgColors.textColorDim}`}>在线</div>
                    </div>
                  </div>
                </div>
                {/* 模拟其他用户 */}
                <div className={`p-2 ${bgColors.hoverBg} cursor-pointer`}>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={getDefaultAvatar('李四')}
                        alt="李四"
                        width={32}
                        height={32}
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#2f3136]"></div>
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${bgColors.textColor}`}>李四 <span className="text-green-500 ml-1">•</span></div>
                      <div className={`text-xs ${bgColors.textColorDim}`}>在线</div>
                    </div>
                  </div>
                </div>
                <div className={`p-2 ${bgColors.hoverBg} cursor-pointer`}>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={getDefaultAvatar('张三')}
                        alt="张三"
                        width={32}
                        height={32}
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-[#2f3136]"></div>
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${bgColors.textColor}`}>张三 <span className="text-yellow-500 ml-1">•</span></div>
                      <div className={`text-xs ${bgColors.textColorDim}`}>闲置</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 通话模态框 */}
      {callModalOpen && (
        <CallModal
          open={callModalOpen}
          callState={callState}
          callType={callType}
          remoteUserId={callRemoteUserId}
          localStream={callState.localStream}
          remoteStream={callState.remoteStream}
          onHangup={handleHangup}
          theme={theme}
        />
      )}

      {/* 收到来电提醒 */}
      {incomingCall && (
        <div className={`fixed bottom-4 right-4 ${bgColors.card} p-4 rounded-lg shadow-lg border ${bgColors.border} z-50`}>
          <h3 className={`font-semibold mb-2 ${bgColors.textColor}`}>
            来电 ({incomingCall.callType === 'video' ? '视频' : '语音'})
          </h3>
          <p className={`text-sm mb-3 ${bgColors.textColorDim}`}>
            用户 ID: {incomingCall.from}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleAcceptCall}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
            >
              接听
            </button>
            <button
              onClick={() => setIncomingCall(null)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              拒绝
            </button>
          </div>
        </div>
      )}
    </div>
  );
}