import React, { useState } from 'react';
import { login } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(username, password);
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
      <h2 className="text-2xl font-bold text-center text-white mb-6">欢迎回来!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#b9bbbe]">
            用户名或邮箱
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-[#b9bbbe]" />
            </div>
            <input
              type="text"
              placeholder="输入用户名或邮箱"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="pl-10 w-full py-2.5 bg-[#36393f] text-white border border-[#202225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-[#b9bbbe]">
              密码
            </label>
            <Link href="/forgot-password" className="text-xs text-[#00aff4] hover:underline">
              忘记密码?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-[#b9bbbe]" />
            </div>
            <input
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-10 w-full py-2.5 bg-[#36393f] text-white border border-[#202225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
              required
            />
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
        
        <div className="text-sm text-[#b9bbbe] text-center">
          没有账号? <Link href="/register" className="text-[#00aff4] hover:underline">注册</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 