import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>){}

  async findOne(id: number) {
    const profile = await this.userRepo.createQueryBuilder('user')
    .where('user.id = :id', { id })
    .getOne()

    return profile
  }

  async findAll(){
    return await this.userRepo.find()
  }

  async create(dto: CreateUserDto){
    return await this.userRepo.save(dto)
  }

  async update(id: number, dto: UpdateUserDto){
    return await this.userRepo.update(id, dto)
  }

  async delete(id: number) {
    return await this.userRepo.delete(id)
  }


  // helpers
  async hasProfile(userId: number) {
    const exists = await this.userRepo.createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.profileId IS NOT NULL')
      .getCount()

    return exists > 0
  }

  async linkProfile(userId: number, profile: Profile) {
    const updateResult = await this.userRepo.createQueryBuilder()
      .update(User)
      .set({ 
        profile: profile
      })
      .where("id = :id", { id: userId })
      .execute()

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found or no rows updated.`)
    }
  }

async unlinkProfile(profile: Profile) {
  const updateResult = await this.userRepo.createQueryBuilder()
    .update(User)
    .set({
      profile: () => 'NULL',
    })
    .where('profileId = :id', { id: profile.id })
    .execute();

  if (updateResult.affected === 0) {
    throw new NotFoundException(`No user found linked to profile ID ${profile.id}`);
  }

  return updateResult;
}

  async exists(userId: number) {
    const exists = await this.userRepo.createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getCount()
      
    return exists > 0
  }


}