'use client';

import { useRef, useCallback, useEffect } from 'react';

interface WebSocketHookOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export default function useWebSocket(options: WebSocketHookOptions = {}) {
  const { onMessage, onConnect, onDisconnect, onError } = options;
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 seconds

  const connect = useCallback((url: string) => {
    // 如果已经存在连接，先关闭
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log('WebSocket连接已建立');
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket连接已关闭: ${event.code} ${event.reason}`);
        onDisconnect?.();

        // 如果不是手动关闭，尝试重连
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(`尝试重连... (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect(url);
          }, reconnectInterval);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket错误:', error);
        onError?.(error);
      };

      socketRef.current = socket;
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
    }
  }, [onConnect, onMessage, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const send = useCallback((data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket未连接，无法发送消息');
    }
  }, []);

  // 组件卸载时清理连接
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    send,
    socketRef,
  };
} 