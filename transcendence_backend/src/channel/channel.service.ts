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
	const { name, password, userId, isprivate, members, admins, owner} = createChannelDto;

	const channel = new Channel();
	channel.name = name;
	channel.password = password;
	channel.userId = userId;
	channel.owner = owner;
	channel.isprivate = isprivate;
	channel.members = members;
	channel.admins = admins;


	console.log (channel.name);
	console.log (channel.password);
	console.log (channel.userId);
	console.log (channel.owner);
	console.log (channel.admins);
	console.log (channel.members);


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
// ============ Update des membres ============
  // Fonction pour mettre à jour un canal
  async updateChannelMembers(name: string, newMembers: number[]): Promise<Channel> {
    const channel = await this.getChannelByName(name);
    if (!channel) {
      throw new NotFoundException('Channel does not exist');
    }
    channel.members = newMembers;
    return this.channelRepository.save(channel);
  }

  async updateChannelAdmins(name: string, newAdmins: number[]): Promise<Channel> {
    const channel = await this.getChannelByName(name);
    if (!channel) {
      throw new NotFoundException('Channel does not exist');
    }
    console.log('newadmin ===>' + newAdmins);
    channel.admins = newAdmins;
    return this.channelRepository.save(channel);
  }

  async updateChannelOwner(name: string, newOwner: number[]): Promise<Channel> {
    const channel = await this.getChannelByName(name);
    if (!channel) {
      throw new NotFoundException('Channel does not exist');
    }
    channel.owner = newOwner;
    return this.channelRepository.save(channel);
  }

  // Fonction pour vérifier si l'utilisateur est l'owner du channel
  isUserOwner(channel: Channel, userId: number): boolean {
    return channel.owner.includes(userId);
  }


   // Fonction pour attribuer le rôle "admin" à un utilisateur dans un channel
   async setAdmin(channelName: string, ownerId: number, username: string): Promise<Channel> {
    // Récupère le channel à partir du nom
    const channel = await this.getChannelByName(channelName);

    if (!channel) {
      throw new NotFoundException('Channel does not exist');
    }

    // Vérifie si l'utilisateur est bien l'owner du channel
    if (!this.isUserOwner(channel, ownerId)) {
      throw new Error("Vous n'êtes pas autorisé à effectuer cette action. Seul l'owner peut attribuer le rôle d'admin.");
    }

    // Récupère l'ID de l'utilisateur à partir de l'username fourni
    const userId = await this.userService.getUserIdByUsername(username);

    if (!userId) {
      throw new NotFoundException(`L'utilisateur avec l'username "${username}" n'a pas été trouvé.`);
    }

    // Vérifie si l'utilisateur est déjà un admin
    if (channel.admins.includes(userId)) {
      throw new Error(`L'utilisateur avec l'ID "${userId}" est déjà un admin du channel.`);
    }

    // Ajoute l'ID de l'utilisateur au tableau "admin" du channel
    channel.admins.push(userId);

    // Enregistre les modifications dans la base de données (ou dans le stockage approprié)
    return this.channelRepository.save(channel);
  }
}