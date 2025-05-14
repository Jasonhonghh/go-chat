import React, { useState } from 'react';
import { sendSMSCode, smsLogin } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { FaMobileAlt, FaSms, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

const SMSLoginForm: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!phone) return;
    setCodeLoading(true);
    setError('');
    try {
      await sendSMSCode(phone, 'login');
      setCodeSent(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || '验证码发送失败');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await smsLogin(phone, smsCode);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#5865F2] flex items-center justify-center text-white">
          <FaDiscord className="w-10 h-10" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-white mb-6">手机验证码登录</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#b9bbbe]">
            手机号
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMobileAlt className="h-5 w-5 text-[#b9bbbe]" />
            </div>
            <input
              type="tel"
              placeholder="输入手机号"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="pl-10 w-full py-2.5 bg-[#36393f] text-white border border-[#202225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#b9bbbe]">
            验证码
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSms className="h-5 w-5 text-[#b9bbbe]" />
              </div>
              <input
                type="text"
                placeholder="输入验证码"
                value={smsCode}
                onChange={e => setSmsCode(e.target.value)}
                className="pl-10 w-full py-2.5 bg-[#36393f] text-white border border-[#202225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
                required
              />
            </div>
            <button
              type="button"
              className={`px-4 py-2.5 rounded-md font-medium transition-colors ${
                codeLoading || countdown > 0
                  ? 'bg-[#4e5acb] text-[#b9bbbe] cursor-not-allowed'
                  : 'bg-[#5865F2] text-white hover:bg-[#4752c4]'
              }`}
              disabled={codeLoading || countdown > 0}
              onClick={handleSendCode}
            >
              {countdown > 0 ? `${countdown}秒` : '获取验证码'}
            </button>
          </div>
        </div>
        
        {error && <div className="text-red-500 text-sm bg-[#36393f] p-2 rounded border border-red-500">{error}</div>}
        
        <button 
          type="submit" 
          className={`w-full py-2.5 rounded-md font-medium transition-colors ${
            loading ? 'bg-[#4e5acb] text-[#b9bbbe]' : 'bg-[#5865F2] text-white hover:bg-[#4752c4]'
          }`}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        
        <div className="flex justify-between text-sm text-[#b9bbbe]">
          <Link href="/login" className="text-[#00aff4] hover:underline">
            账号密码登录
          </Link>
          <Link href="/register" className="text-[#00aff4] hover:underline">
            注册账号
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SMSLoginForm; 