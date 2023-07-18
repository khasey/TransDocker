import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Channel' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;
}