import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, isNotEmpty } from 'class-validator';

export class CreateChannelDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	password?: string;

	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsOptional() // Assurez-vous que "owner" est marqué comme facultatif
	@IsBoolean()
	owner?: boolean;

  @IsOptional() // Assurez-vous que "owner" est marqué comme facultatif
	@IsBoolean()
	isprivate?: boolean;

}
