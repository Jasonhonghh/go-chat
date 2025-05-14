'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaCamera, FaUsers, FaLock, FaGlobe, FaTags } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';

export default function CreateGroupPage() {
  const router = useRouter();
  const { theme } = useTheme();

  // 定义主题相关样式
  const bgColors = {
    main: theme === 'dark' ? 'bg-[#36393f]' : 'bg-white',
    secondary: theme === 'dark' ? 'bg-[#2f3136]' : 'bg-gray-100',
    input: theme === 'dark' ? 'bg-[#40444b]' : 'bg-gray-100',
    textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textColorDim: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    border: theme === 'dark' ? 'border-[#23272a]' : 'border-gray-200',
  };

  // 表单状态
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    avatar: null as File | null,
    avatarPreview: '',
    privacy: 'public', // 'public' | 'private'
    tags: ''
  });

  // 验证表单
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  // 处理表单字段更改
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroupData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应的错误
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 处理头像上传
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setGroupData(prev => ({
            ...prev,
            avatar: file,
            avatarPreview: e.target!.result as string
          }));
        }
      };
      
      fileReader.readAsDataURL(file);
    }
  };

  // 表单验证
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', description: '' };
    
    if (!groupData.name.trim()) {
      newErrors.name = '群组名称不能为空';
      valid = false;
    }
    
    if (!groupData.description.trim()) {
      newErrors.description = '群组描述不能为空';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  // 提交创建群组
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 模拟创建群组的API调用
      console.log('创建群组:', groupData);
      
      // 提示成功并返回
      alert('群组创建成功!');
      router.push('/discover');
    }
  };

  return (
    <div className={`min-h-screen ${bgColors.main} ${bgColors.textColor}`}>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className={`p-2 rounded-full ${bgColors.textColorDim} hover:${bgColors.textColor}`}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold ml-2">创建新群组</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 群组头像 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-28 h-28 rounded-full overflow-hidden ${bgColors.secondary} flex items-center justify-center`}>
                {groupData.avatarPreview ? (
                  <Image 
                    src={groupData.avatarPreview}
                    alt="群组头像预览" 
                    width={112} 
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaUsers className="text-6xl opacity-30" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#5865F2] text-white rounded-full p-2.5 cursor-pointer">
                <FaCamera size={16} />
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {/* 群组名称 */}
          <div>
            <label className="block mb-2 font-medium">群组名称</label>
            <input 
              type="text"
              name="name"
              value={groupData.name}
              onChange={handleChange}
              placeholder="输入群组名称"
              className={`w-full ${bgColors.input} rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          {/* 群组描述 */}
          <div>
            <label className="block mb-2 font-medium">群组描述</label>
            <textarea 
              name="description"
              value={groupData.description}
              onChange={handleChange}
              placeholder="描述一下这个群组的目的和内容"
              rows={4}
              className={`w-full ${bgColors.input} rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
            />
            {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
          </div>
          
          {/* 群组隐私设置 */}
          <div>
            <label className="block mb-2 font-medium">隐私设置</label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center p-3 ${bgColors.input} rounded border ${groupData.privacy === 'public' ? 'border-[#5865F2]' : 'border-transparent'} cursor-pointer`}>
                <input 
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={groupData.privacy === 'public'}
                  onChange={() => setGroupData(prev => ({ ...prev, privacy: 'public' }))}
                  className="sr-only"
                />
                <FaGlobe className={`mr-2 ${groupData.privacy === 'public' ? 'text-[#5865F2]' : ''}`} />
                <div>
                  <div className="font-medium">公开群组</div>
                  <div className={`text-xs ${bgColors.textColorDim}`}>所有人可见并可申请加入</div>
                </div>
              </label>
              <label className={`flex-1 flex items-center p-3 ${bgColors.input} rounded border ${groupData.privacy === 'private' ? 'border-[#5865F2]' : 'border-transparent'} cursor-pointer`}>
                <input 
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={groupData.privacy === 'private'}
                  onChange={() => setGroupData(prev => ({ ...prev, privacy: 'private' }))}
                  className="sr-only"
                />
                <FaLock className={`mr-2 ${groupData.privacy === 'private' ? 'text-[#5865F2]' : ''}`} />
                <div>
                  <div className="font-medium">私密群组</div>
                  <div className={`text-xs ${bgColors.textColorDim}`}>仅通过邀请链接加入</div>
                </div>
              </label>
            </div>
          </div>
          
          {/* 群组标签 */}
          <div>
            <label className="block mb-2 font-medium">添加标签</label>
            <div className="relative">
              <FaTags className={`absolute left-3 top-3 ${bgColors.textColorDim}`} />
              <input 
                type="text"
                name="tags"
                value={groupData.tags}
                onChange={handleChange}
                placeholder="技术,设计,产品... (使用逗号分隔)"
                className={`w-full ${bgColors.input} rounded pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
              />
            </div>
            <p className={`mt-1 text-xs ${bgColors.textColorDim}`}>添加标签可以让更多志同道合的人找到你的群组</p>
          </div>
          
          {/* 创建按钮 */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white py-3 rounded font-medium transition-colors"
            >
              创建群组
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
