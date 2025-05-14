import React from 'react';
import { CallType } from '../../types';
import { Theme } from '@/hooks/useTheme';

interface CallButtonsProps {
  onCall: (type: CallType) => void;
  isGroup?: boolean;
  theme?: Theme;
}

const CallButtons: React.FC<CallButtonsProps> = ({ onCall, isGroup = false, theme = 'dark' }) => {
  // 根据主题调整样式
  const buttonClass = theme === 'dark' 
    ? 'bg-[#2f3136] hover:bg-[#36393f] text-gray-300 hover:text-white' 
    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800';
    
  return (
    <div className="flex space-x-2">
      <button
        className={`p-2 rounded-full ${buttonClass}`}
        title="音频通话"
        onClick={() => onCall('audio')}
        disabled={isGroup} // 群组禁用通话功能
      >
        <img src="/icon_audio_call.svg" alt="音频通话" className="w-5 h-5" />
      </button>
      <button
        className={`p-2 rounded-full ${buttonClass}`}
        title="视频通话"
        onClick={() => onCall('video')}
        disabled={isGroup} // 群组禁用通话功能
      >
        <img src="/icon_video_call.svg" alt="视频通话" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CallButtons; 