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
  type: 'text' | 'image' | 'file' | 'markdown';
  fileData?: {
    name: string;
    size: number;
    type: string;
  };
  timestamp: string;
}

// 聊天类型
export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    content: string;
    timestamp: string;
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