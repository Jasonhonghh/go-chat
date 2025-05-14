import React, { useRef, useEffect } from 'react';
import { CallType, CallState } from '../../types';
import { Theme } from '@/hooks/useTheme';

interface CallModalProps {
  open: boolean;
  callType: CallType;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onHangup: () => void;
  callState?: CallState;
  remoteUserId?: string | null;
  theme?: Theme;
}

const CallModal: React.FC<CallModalProps> = ({ 
  open, 
  callType, 
  localStream, 
  remoteStream, 
  onHangup,
  callState,
  remoteUserId,
  theme = 'dark'
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
        <h3 className="text-lg font-bold mb-4">{callType === 'video' ? '视频通话' : '音频通话'}</h3>
        <div className="relative w-64 h-40 bg-black rounded mb-4 flex items-center justify-center">
          {callType === 'video' && (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded" />
          )}
          {callType === 'audio' && (
            <img src="/call_bg.jpg" alt="音频通话" className="w-full h-full object-cover rounded" />
          )}
        </div>
        <div className="absolute bottom-24 right-6 w-20 h-14 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          {callType === 'video' && (
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}
          {callType === 'audio' && (
            <img src="/avatar_default.png" alt="我的头像" className="w-10 h-10 rounded-full" />
          )}
        </div>
        <button
          className="mt-6 btn btn-error flex items-center"
          onClick={onHangup}
        >
          <img src="/icon_hangup.svg" alt="挂断" className="w-6 h-6 mr-2" /> 挂断
        </button>
      </div>
    </div>
  );
};

export default CallModal; 