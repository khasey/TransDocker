import { Controller, Post, Body, Get, BadRequestException, Param, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './channel.dto';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';

@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
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
}