'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { FaWifi, FaMicrophone, FaHeadphones, FaCog, FaUser, FaCircle, FaSlash } from 'react-icons/fa';
import Image from 'next/image';

interface StatusBarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

// 默认头像的占位符
const getDefaultAvatar = (name: string) => {
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

export default function StatusBar({ user }: StatusBarProps) {
  const { theme } = useTheme();
  const [ping, setPing] = useState(32); // ms
  const [micEnabled, setMicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 模拟ping更新
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 50) + 20);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleMic = () => setMicEnabled(!micEnabled);
  const toggleSound = () => setSoundEnabled(!soundEnabled);

  // 根据主题生成样式
  const styles = {
    bg: theme === 'dark' ? 'bg-[#292b2f]' : 'bg-gray-200',
    text: theme === 'dark' ? 'text-[#b9bbbe]' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-[#72767d]' : 'text-gray-500',
    hoverBg: theme === 'dark' ? 'hover:bg-[#36393f]' : 'hover:bg-gray-300',
    border: theme === 'dark' ? 'border-[#202225]' : 'border-gray-300',
    iconBg: {
      online: 'text-green-500',
      mic: micEnabled ? (theme === 'dark' ? 'text-white' : 'text-gray-800') : 'text-red-500',
      sound: soundEnabled ? (theme === 'dark' ? 'text-white' : 'text-gray-800') : 'text-red-500',
    },
    ping: ping < 50 ? 'text-green-500' : ping < 100 ? 'text-yellow-500' : 'text-red-500',
  };

  return (
    <div className={`h-10 ${styles.bg} border-t ${styles.border} flex items-center justify-between px-2`}>
      {/* 用户信息部分 */}
      <div className="flex items-center p-1 rounded hover:bg-[#3f4248] cursor-pointer">
        <div className="relative mr-2">
          {user.avatar ? (
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={user.avatar}
                alt={user.name}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={getDefaultAvatar(user.name)}
                alt={user.name}
                width={24}
                height={24}
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="absolute bottom-0 right-0">
            <FaCircle className={`w-2 h-2 ${styles.iconBg.online}`} />
          </div>
        </div>
        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {user.name}
        </span>
      </div>

      {/* 中间显示控制按钮 */}
      <div className="flex items-center space-x-1">
        <button
          onClick={toggleMic}
          className={`w-7 h-7 rounded-md flex items-center justify-center ${styles.hoverBg} relative group`}
          title={micEnabled ? "静音" : "取消静音"}
        >
          <FaMicrophone className={styles.iconBg.mic} />
          {!micEnabled && (
            <FaSlash className="absolute text-red-500 text-lg" />
          )}
          <span className="absolute bottom-full mb-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {micEnabled ? "静音" : "取消静音"}
          </span>
        </button>
        
        <button
          onClick={toggleSound}
          className={`w-7 h-7 rounded-md flex items-center justify-center ${styles.hoverBg} relative group`}
          title={soundEnabled ? "关闭声音" : "开启声音"}
        >
          <FaHeadphones className={styles.iconBg.sound} />
          {!soundEnabled && (
            <FaSlash className="absolute text-red-500 text-lg" />
          )}
          <span className="absolute bottom-full mb-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {soundEnabled ? "关闭声音" : "开启声音"}
          </span>
        </button>
        
        <button
          className={`w-7 h-7 rounded-md flex items-center justify-center ${styles.hoverBg} relative group`}
          title="设置"
        >
          <FaCog className={theme === 'dark' ? 'text-white' : 'text-gray-800'} size={14} />
          <span className="absolute bottom-full mb-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            设置
          </span>
        </button>
      </div>

      {/* 网络状态 */}
      <div className="flex items-center">
        <FaWifi className={`${styles.ping} text-xs`} />
        <span className={`ml-1 text-[10px] ${styles.ping}`}>{ping} ms</span>
      </div>
    </div>
  );
} 