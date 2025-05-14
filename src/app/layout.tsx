'use client';

import React, { Suspense, lazy } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/hooks/useTheme';

// 动态导入 DevTools 组件
const DevTools = lazy(() => import('@/components/dev/DevTools'));

// DevTools包装器，处理客户端组件的渲染
const DevToolsWrapper = () => {
  return (
    <Suspense fallback={<div />}>
      <DevTools />
    </Suspense>
  );
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <title>Go-Chat</title>
        <meta name="description" content="A modern chat application" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          {process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && (
            <div className="dev-tools-container">
              {/* 开发工具组件 */}
              <DevToolsWrapper />
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
} 