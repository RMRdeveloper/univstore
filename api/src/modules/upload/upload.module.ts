import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';

@Module({
  imports: [PassportModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule { }
