import { Task } from '../tasks/task.entiy';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, ({ user }) => user, { eager: true })
  tasks: Task[];
}
