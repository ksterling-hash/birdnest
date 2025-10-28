import { ConflictException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/createProfile.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profileRepo: Repository<Profile>,
              private readonly userService: UserService){}

  async findOne(id: number) {
    const profile = await this.profileRepo.createQueryBuilder('profile')
    .where('profile.id = :id', { id })
    .getOne()

    return profile
  }
  

  async findAll(){
    return await this.profileRepo.find()
  }

  async create(userId: number, dto: CreateProfileDto) {
    const userExists = await this.userService.exists(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found. Profile creation aborted.`)
    }

    const userHasProfile = await this.userService.hasProfile(userId)
    if (userHasProfile) {
      throw new ConflictException('Profile already exists for this user.')
    }

    const newProfile = this.profileRepo.create(dto);
    const savedProfile: Profile = await this.profileRepo.save(newProfile);

    try {
      await this.userService.linkProfile(userId, savedProfile)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with ID ${userId} not found.`)
      }
      throw error;
    }

    return savedProfile;
  }

  async update(id: number, dto: UpdateProfileDto){
    return await this.profileRepo.update({id}, dto)
  }

  async delete(id: number) {
    const profile = await this.findOne(id)
    if(profile){
      await this.userService.unlinkProfile(profile)
      return await this.profileRepo.delete(id)
    }
    
  }

}