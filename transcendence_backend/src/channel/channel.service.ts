import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './channel.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ChannelService {
	userRepository: any;
	userService: any;
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}


  // ============ Créations de channels ============
  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
	const { name, password, userId, isprivate} = createChannelDto;

	const channel = new Channel();
	channel.name = name;
	channel.password = password;
	channel.userId = userId;
	channel.owner = true;
	channel.isprivate = isprivate;


	console.log (channel.name);
	console.log (channel.password);
	console.log (channel.userId);
	console.log (channel.owner);


	return this.channelRepository.save(channel);
  }

// ============ Créations de channels ============

// ============ Lister les channels ============
  async getAllChannels(): Promise<Channel[]> {
    return this.channelRepository.find();
  }
// ============ Lister les channels ============
	async getLatestChannel(): Promise<Channel> {
		return this.channelRepository
	  	.createQueryBuilder("channel")
	  	.orderBy("channel.id", "DESC") // Nous nous basons maintenant sur l'ID
	  	.getOne(); // retourne le dernier canal créé
  }

// ============ Obtenir un canal par son nom ============ 
async getChannelByName(name: string): Promise<Channel | null> {
	try {
	  const channel = await this.channelRepository.findOne({ where: { name: name } });
	  if (!channel) {
		console.log(`No channel found with name: ${name}`);
	  }
	  return channel;
	} catch (error) {
	  console.error(`Error while trying to find channel with name: ${name}`, error);
	  throw error;
	}
  }
}
