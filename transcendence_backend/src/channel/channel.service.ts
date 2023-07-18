import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const { name, password } = createChannelDto;

    const channel = new Channel();
    channel.name = name;
    channel.password = password;
    // Assigner le rôle "owner" au créateur du channel

    return this.channelRepository.save(channel);
  }


  async getAllChannels(): Promise<Channel[]> {
    return this.channelRepository.find();
  }


  // Autres méthodes pour rejoindre un channel, muter un utilisateur, retirer un utilisateur du groupe, donner le rôle d'admin, etc.
}