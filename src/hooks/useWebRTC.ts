import { useRef, useState, useCallback } from 'react';
import { CallType, CallSignal, CallState } from '../types';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // 可根据需要添加 TURN 服务器
  ],
};

export default function useWebRTC({
  onSignal,
  onRemoteStream,
  onCallEnd,
}: {
  onSignal: (signal: CallSignal) => void;
  onRemoteStream: (stream: MediaStream) => void;
  onCallEnd: () => void;
}) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>({
    inCall: false,
    callType: null,
    remoteUserId: null,
    localStream: null,
    remoteStream: null,
    isCaller: false,
  });

  // 获取本地媒体流
  const getLocalStream = useCallback(async (callType: CallType) => {
    const constraints = callType === 'video'
      ? { audio: true, video: true }
      : { audio: true, video: false };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamRef.current = stream;
    setCallState((s) => ({ ...s, localStream: stream }));
    return stream;
  }, []);

  // 发起通话
  const startCall = useCallback(async (remoteUserId: string, callType: CallType) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    setCallState({
      inCall: true,
      callType,
      remoteUserId,
      localStream: null,
      remoteStream: null,
      isCaller: true,
    });
    const localStream = await getLocalStream(callType);
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        onSignal({
          type: 'call:candidate',
          from: '', // 由外部补充 userId
          to: remoteUserId,
          candidate: e.candidate,
        });
      }
    };
    pc.ontrack = (e) => {
      const remoteStream = e.streams[0];
      setCallState((s) => ({ ...s, remoteStream }));
      onRemoteStream(remoteStream);
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    onSignal({
      type: 'call:offer',
      from: '', // 由外部补充 userId
      to: remoteUserId,
      callType,
      sdp: offer,
    });
  }, [getLocalStream, onSignal, onRemoteStream]);

  // 接收通话
  const answerCall = useCallback(async (remoteUserId: string, callType: CallType, offer: any) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    setCallState({
      inCall: true,
      callType,
      remoteUserId,
      localStream: null,
      remoteStream: null,
      isCaller: false,
    });
    const localStream = await getLocalStream(callType);
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        onSignal({
          type: 'call:candidate',
          from: '',
          to: remoteUserId,
          candidate: e.candidate,
        });
      }
    };
    pc.ontrack = (e) => {
      const remoteStream = e.streams[0];
      setCallState((s) => ({ ...s, remoteStream }));
      onRemoteStream(remoteStream);
    };
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    onSignal({
      type: 'call:answer',
      from: '',
      to: remoteUserId,
      sdp: answer,
    });
  }, [getLocalStream, onSignal, onRemoteStream]);

  // 处理信令消息
  const handleSignal = useCallback(async (signal: CallSignal) => {
    const pc = pcRef.current;
    if (!pc) return;
    if (signal.type === 'call:answer' && signal.sdp) {
      await pc.setRemoteDescription(signal.sdp);
    } else if (signal.type === 'call:candidate' && signal.candidate) {
      await pc.addIceCandidate(signal.candidate);
    }
  }, []);

  // 挂断通话
  const hangup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setCallState({
      inCall: false,
      callType: null,
      remoteUserId: null,
      localStream: null,
      remoteStream: null,
      isCaller: false,
    });
    onCallEnd();
  }, [onCallEnd]);

  return {
    callState,
    startCall,
    answerCall,
    handleSignal,
    hangup,
  };
} 