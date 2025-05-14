'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaUsers, FaServer, FaCog } from 'react-icons/fa';

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    { icon: <FaHome size={20} />, label: '主页', href: '/' },
    { icon: <FaSearch size={20} />, label: '发现', href: '/discover' },
    { icon: <FaUsers size={20} />, label: '群组', href: '/groups' },
    { icon: <FaUsers size={20} />, label: '创建群组', href: '/groups/create' },
    { icon: <FaServer size={20} />, label: '服务器', href: '/servers' },
    { icon: <FaCog size={20} />, label: '个人', href: '/profile' },
    { icon: <FaCog size={20} />, label: '登录', href: '/login' },
    { icon: <FaCog size={20} />, label: '注册', href: '/register' }
  ];
  
  return (
    <div className="bg-[#202225] text-gray-400 px-2 py-1">
      <div className="grid grid-cols-5 overflow-x-auto whitespace-nowrap">
        {navItems.slice(0, 5).map((item, index) => (
          <Link 
            href={item.href} 
            key={index}
            className={`flex flex-col items-center justify-center p-2 ${
              pathname === item.href ? 'text-white' : 'hover:text-gray-200'
            }`}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
