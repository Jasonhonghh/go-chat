import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string, formatStr: string = 'PP') => {
  return format(new Date(date), formatStr, { locale: zhCN });
};

/**
 * 获取用户默认头像URL
 */
export const getDefaultAvatar = (name: string) => {
  return `https://placehold.co/100x100/4f46e5/ffffff?text=${name[0].toUpperCase()}`;
};

/**
 * 截断文本
 */
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 生成唯一ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}; 