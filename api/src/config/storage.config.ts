import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  path: process.env.STORAGE_PATH || './storage/uploads',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}));
