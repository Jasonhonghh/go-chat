import React from 'react';
import { RiAiGenerate, RiRobot2Line } from 'react-icons/ri';

interface AIAssistantButtonProps {
  onAIAssistantClick: () => void;
  onAISummarizeClick: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ 
  onAIAssistantClick,
  onAISummarizeClick
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onAIAssistantClick}
        className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition"
        title="AI助手"
      >
        <RiRobot2Line className="w-5 h-5" />
      </button>
      <button
        onClick={onAISummarizeClick}
        className="p-2 rounded-full text-green-500 hover:bg-green-100 transition"
        title="AI总结聊天记录"
      >
        <RiAiGenerate className="w-5 h-5" />
      </button>
    </div>
  );
};

export default AIAssistantButton; 