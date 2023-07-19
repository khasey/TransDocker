import { Controller, Post, Body, Get, BadRequestException, Param } from '@nestjs/common';
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
}