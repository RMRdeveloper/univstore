import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface UploadResult {
  filename: string;
  path: string;
  originalName: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadService {
  private readonly storagePath: string;
  private readonly allowedMimeTypes: string[];
  private readonly maxFileSize: number;

  constructor(private readonly configService: ConfigService) {
    this.storagePath = this.configService.get<string>('storage.path') || './storage/uploads';
    this.allowedMimeTypes = this.configService.get<string[]>('storage.allowedMimeTypes') || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    this.maxFileSize = this.configService.get<number>('storage.maxFileSize') || 5 * 1024 * 1024;
  }

  async saveProductImage(file: Express.Multer.File): Promise<UploadResult> {
    return this.saveFile(file, 'products');
  }

  async saveAvatar(file: Express.Multer.File): Promise<UploadResult> {
    return this.saveFile(file, 'avatars');
  }

  private async saveFile(
    file: Express.Multer.File,
    subfolder: string,
  ): Promise<UploadResult> {
    this.validateFile(file);

    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const folderPath = path.join(this.storagePath, subfolder);
    const filePath = path.join(folderPath, filename);

    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      path: `/${subfolder}/${filename}`,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new Error(
        `File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.storagePath, filePath.replace(/^\//, ''));
    try {
      await fs.promises.unlink(fullPath);
    } catch {
      // File may not exist, ignore error
    }
  }
}
