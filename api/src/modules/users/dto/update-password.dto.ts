import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPassword!: string;
}
