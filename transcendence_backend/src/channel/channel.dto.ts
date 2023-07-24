import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, isNotEmpty, IsArray } from 'class-validator';

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
	isprivate?: boolean;

	@IsOptional()
    admins?: number[]; // Array contenant les userID des admins

    @IsOptional()
    members?: number[]; // Array contenant les userID des membres

	@IsOptional()
    owner?: number[]; // Array contenant les userID des membres

	@IsOptional()
    banned?: number;

	@IsNotEmpty()
	@IsNumber()
    idToKick?: number;
}

export class AddMembersDto {
	@IsNotEmpty()
	@IsArray()
	members: number[]; // Array contenant les userID des membres à ajouter
  }

  export class AddAdminsDto {
	@IsNotEmpty()
	@IsArray()
	admins: number[]; // Array contenant les userID des membres à ajouter
  }

  export class AddOwnerDto {
	@IsNotEmpty()
	@IsArray()
	owner: number[]; // Array contenant les userID des membres à ajouter
  }

  export class AddBanUserDto {
	@IsNotEmpty()
	@IsNumber()
	banned: number;
  }
  
  export class AddKickUsersDto {
	@IsNotEmpty()
	@IsNumber()
	idToKick: number;
}	