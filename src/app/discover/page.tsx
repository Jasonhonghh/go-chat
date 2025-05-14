'use client';

import React from 'react';
import { FaSearch, FaUsers, FaHashtag } from 'react-icons/fa';
import { useChatStore } from '@/store/chatStore';
import Link from 'next/link';

export default function DiscoverPage() {
  // 测试数据
  const discoverItems = [
    { 
      id: 'group1', 
      name: '前端技术交流群', 
      description: 'React, Vue, Angular 等前端技术讨论',
      memberCount: 1289,
      tags: ['技术', '前端', 'JavaScript']
    },
    { 
      id: 'group2', 
      name: 'Go 语言爱好者', 
      description: '探讨 Go 语言开发技巧与最佳实践',
      memberCount: 843,
      tags: ['Go', '后端', '编程语言']
    },
    { 
      id: 'group3', 
      name: 'AI 与机器学习', 
      description: '分享 AI 领域的最新进展与应用案例',
      memberCount: 1576,
      tags: ['AI', '机器学习', '深度学习']
    },
    { 
      id: 'group4', 
      name: '产品设计交流', 
      description: 'UI/UX 设计方法论与工具使用技巧',
      memberCount: 967,
      tags: ['设计', 'UI', 'UX']
    },
    { 
      id: 'group5', 
      name: '创业与职场', 
      description: '分享创业经验与职场发展心得',
      memberCount: 2104,
      tags: ['创业', '职场', '发展']
    }
  ];

  const categories = [
    { id: 'tech', name: '技术', icon: <FaHashtag /> },
    { id: 'design', name: '设计', icon: <FaHashtag /> },
    { id: 'business', name: '商业', icon: <FaHashtag /> },
    { id: 'gaming', name: '游戏', icon: <FaHashtag /> },
    { id: 'education', name: '教育', icon: <FaHashtag /> },
    { id: 'entertainment', name: '娱乐', icon: <FaHashtag /> }
  ];
  
  return (
    <div className="min-h-screen bg-[#36393f] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">发现社区</h1>
          <p className="text-gray-400">探索并加入有趣的话题讨论</p>
          
          <div className="mt-4 flex">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="搜索群组..." 
                className="w-full bg-[#2f3136] text-white rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <Link href="/groups/create">
              <button className="ml-3 bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded flex items-center">
                <FaUsers className="mr-2" />
                创建群组
              </button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-wrap -mx-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              className="m-2 bg-[#2f3136] hover:bg-[#36393f] text-gray-300 hover:text-white px-3 py-1 rounded-full flex items-center text-sm"
            >
              {category.icon}
              <span className="ml-1">{category.name}</span>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoverItems.map(item => (
            <div key={item.id} className="bg-[#2f3136] rounded-lg p-4 hover:bg-[#36393f] transition-colors">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{item.description}</p>
              <div className="flex flex-wrap mb-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="bg-[#36393f] text-xs text-gray-300 px-2 py-1 rounded mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center">
                  <FaUsers className="mr-1" />
                  {item.memberCount} 成员
                </span>
                <button className="bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm px-3 py-1 rounded">
                  加入
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
