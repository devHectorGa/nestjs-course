import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entiy';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks({ search, status }: GetTaskFilterDto): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('status = :status', { status });
    }
    if (search) {
      query.andWhere(
        new Brackets((builder) => {
          builder
            .where(`LOWER(task.title) LIKE LOWER(:search)`, {
              search: `%${search}%`,
            })
            .orWhere(`LOWER(task.description) LIKE LOWER(:search)`, {
              search: `%${search}%`,
            });
        }),
      );
    }

    const tasks = query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });
    if (!found) throw new NotFoundException();
    return found;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task: Task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }
  async deleteTask(id: string): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected) throw new NotFoundException();
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
    await this.taskRepository.update(id, { status });
  }
}
