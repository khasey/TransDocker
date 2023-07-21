import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity( { name: 'Channel' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  userId: number;

  @Column()
  owner: boolean

  @Column()
  isprivate: boolean



  // Autres relations et propriétés...

}