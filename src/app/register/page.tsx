'use client';

import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#202225] flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full p-8 bg-[#36393f] rounded-lg shadow-lg">
        <RegisterForm />
      </div>
      
      <div className="mt-6 flex items-center text-[#b9bbbe] text-sm">
        <span>Powered by</span>
        <Image
          src="/images/discord-logo.png"
          alt="Discord-style Chat"
          width={80}
          height={24}
          className="ml-2"
        />
      </div>
    </div>
  );
};

export default RegisterPage; 