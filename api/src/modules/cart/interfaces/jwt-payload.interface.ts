import { Types } from 'mongoose';
import { UserRole } from '@/common/enums/index.js';

export interface JwtPayload {
  sub: Types.ObjectId;
  email: string;
  role: UserRole;
}
