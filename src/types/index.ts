// 用户类型
export interface User {
  id: string;
  name: string;
  avatar: string;
}

// 消息类型
export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'markdown' | 'ai';
  fileData?: {
    name: string;
    size: number;
    type: string;
    url?: string; // 下载URL
  };
  timestamp: string;
  isAI?: boolean; // 是否是AI消息
  summary?: string; // AI总结内容
}

// 聊天类型
export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName?: string; // Added senderName property
  };
  unreadCount: number;
  isGroup: boolean;
  members?: User[];
}

// WebSocket消息类型
export interface WSMessage {
  type: 'message' | 'status' | 'typing' | 'read';
  chatId?: string;
  userId?: string;
  message?: Message;
  status?: 'online' | 'offline';
  typing?: boolean;
}

// 音视频通话类型
export type CallType = 'audio' | 'video';

export interface CallSignal {
  type: 'call:offer' | 'call:answer' | 'call:candidate' | 'call:hangup';
  from: string; // 发起方 userId
  to: string;   // 接收方 userId
  callType?: CallType;
  sdp?: any;
  candidate?: any;
}

export interface CallState {
  inCall: boolean;
  callType: CallType | null;
  remoteUserId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCaller: boolean;
}

// AI助手类型
export interface AIAssistant {
  id: string;
  name: string;
  avatar: string;
  description: string; 
}