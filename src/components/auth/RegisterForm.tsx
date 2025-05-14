import React, { useState } from 'react';
import { sendSMSCode, register } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaMobileAlt, FaSms, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!phone) return;
    setCodeLoading(true);
    setError('');
    try {
      await sendSMSCode(phone, 'register');
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
      const res = await register(username, password, phone, smsCode);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败');
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
      <h2 className="text-2xl font-bold text-center text-white mb-6">创建账号</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#b9bbbe]">
            用户名
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-[#b9bbbe]" />
            </div>
            <input
              type="text"
              placeholder="输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="pl-10 w-full py-2.5 bg-[#36393f] text-white border border-[#202225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
              required
            />
          </div>
        </div>

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
              className={`px-4 py-2.5 rounded-md font-medium transition-colors whitespace-nowrap ${
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#b9bbbe]">
            密码
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-[#b9bbbe]" />
            </div>
            <input
              type="password"
              placeholder="设置密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-10 w-full py-2.5 bg-[#36393f] text-white border border-[#202225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
              required
            />
          </div>
          <p className="text-xs text-[#b9bbbe]">密码长度至少8位，包含字母和数字</p>
        </div>
        
        {error && <div className="text-red-500 text-sm bg-[#36393f] p-2 rounded border border-red-500">{error}</div>}
        
        <button 
          type="submit" 
          className={`w-full py-2.5 rounded-md font-medium transition-colors ${
            loading ? 'bg-[#4e5acb] text-[#b9bbbe]' : 'bg-[#5865F2] text-white hover:bg-[#4752c4]'
          }`}
          disabled={loading}
        >
          {loading ? '注册中...' : '注册'}
        </button>
        
        <div className="text-sm text-[#b9bbbe] text-center">
          已有账号? <Link href="/login" className="text-[#00aff4] hover:underline">登录</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 