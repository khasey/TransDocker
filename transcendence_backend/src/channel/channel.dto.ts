import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password?: string;
}