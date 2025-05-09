'use client';

import { create } from 'zustand';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: string;
  fileData?: any;
  timestamp: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
  isGroup: boolean;
}

interface ChatStore {
  // 聊天列表
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  
  // 消息列表 - 按聊天ID组织
  messages: Record<string, Message[]>;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  
  // 未读消息处理
  markAsRead: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  messages: {},
  
  setChats: (chats) => set({ chats }),
  
  addChat: (chat) => set((state) => ({
    chats: [...state.chats, chat],
  })),
  
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map((chat) => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
  })),
  
  addMessage: (chatId, message) => set((state) => {
    // 更新消息列表
    const chatMessages = state.messages[chatId] || [];
    const updatedMessages = {
      ...state.messages,
      [chatId]: [...chatMessages, message],
    };
    
    // 更新聊天信息 - 最后一条消息和未读计数
    const updatedChats = state.chats.map((chat) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: {
            content: message.content,
            timestamp: message.timestamp,
          },
          // 如果是别人发送的消息，增加未读计数
          unreadCount: chat.unreadCount + (message.senderId !== 'currentUser' ? 1 : 0),
        };
      }
      return chat;
    });
    
    return {
      messages: updatedMessages,
      chats: updatedChats,
    };
  }),
  
  setMessages: (chatId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: messages,
    },
  })),
  
  markAsRead: (chatId) => set((state) => ({
    chats: state.chats.map((chat) => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ),
  })),
})); 