import { Controller, Put, Post, Body, Get, BadRequestException, Param, NotFoundException, Logger } from '@nestjs/common';
import { CreateChannelDto, AddMembersDto, AddAdminsDto, AddOwnerDto , AddBanUserDto, UpdateChannelDto , AddKickUsersDto, AddMuteUsersDto} from './channel.dto';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { channel } from 'diagnostics_channel';

@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  private readonly logger = new Logger(ChannelController.name);
// ============ Créations de channels ============
  @Post()
  async createChannel(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    try {
      return this.channelService.createChannel(createChannelDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getAllChannels(): Promise<Channel[]> {
    return this.channelService.getAllChannels();
  }

// ============ Créations de channels ============
    @Get('/latest')
    async getLatestChannel(): Promise<Channel> {

    return this.channelService.getLatestChannel();
    }

// ============ Obtenir un canal par son nom ============
@Get(':name')
async getChannelByName(@Param('name') name: string) {
  const channel = await this.channelService.getChannelByName(name);
  if (!channel) {
    throw new NotFoundException('Channel does not exist');
  }
  return channel;
}

@Get(':name/admins')
async getChannelAdmins(@Param('name') name: string): Promise<number[]> {
const channel = await this.channelService.getChannelByName(name);
if (!channel) {
  throw new NotFoundException('Channel does not exist');
}
return channel.admins; // suppose que admins est un tableau d'IDs d'utilisateur
}

@Put(':name/members')
async updateChannelMembers(@Param('name') name: string, @Body() updateMembersDto: AddMembersDto): Promise<Channel> {
  return this.channelService.updateChannelMembers(name, updateMembersDto.members);
}

@Put(':name/admins')
async updateChannelAdmins(@Param('name') name: string, @Body() updateMembersDto: AddAdminsDto): Promise<Channel> {
  return this.channelService.updateChannelAdmins(name, updateMembersDto.admins);
}

@Put(':name/owner')
async updateChannelOwner(@Param('name') name: string, @Body() updateOwnerDto: AddOwnerDto): Promise<Channel> {
  return this.channelService.updateChannelOwner(name, updateOwnerDto.owner);
}
@Put(':name/ban')
async banUserFromChannel(@Param('name') name: string, @Body() banUserDto: AddBanUserDto): Promise<Channel> {
  this.logger.log(`Banning user with id ${banUserDto.banned} from channel ${name}`);
  try{
  return this.channelService.banUserFromChannel(name, banUserDto.banned, banUserDto.banneur);
  } catch (error) {
    this.logger.error(`Failed to ban user from channel: ${error.message}`);
    throw error;
  }

}

@Put(':name/kick')
async kickUserFromChannel(@Param('name') name: string, @Body() kickUsersDto: AddKickUsersDto): Promise<Channel> {
  this.logger.log(`Kicking user with id ${kickUsersDto.idToKick} from channel ${name}`);
  try {
    return this.channelService.kickUserFromChannel(name, kickUsersDto.idToKick);
  } catch (error) {
    this.logger.error(`Failed to kick user from channel: ${error.message}`);
    throw error;
  }
}

@Put(':name/mute')
async muteUserFromChannel(@Param('name') name: string, @Body() muteUsersDto: AddMuteUsersDto): Promise<Channel> {
	  this.logger.log(`Muting user with id ${muteUsersDto.muted} from channel ${name}`);
  try {
	return this.channelService.muteUserFromChannel(name, muteUsersDto.muted, muteUsersDto.muteur);
  } catch (error) {
	this.logger.error(`Failed to mute user from channel: ${error.message}`);
	throw error;
  }
}

@Put(':name')
async updateChannel(@Param('name') name: string, @Body() updateChannelDto: UpdateChannelDto): Promise<Channel> {
  return this.channelService.updateChannel(name, updateChannelDto.password, updateChannelDto.isprivate);
}
}
