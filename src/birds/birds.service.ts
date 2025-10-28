import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bird } from '../entities/bird.entity';
import { Repository } from 'typeorm';
import { CreateBirdDto } from './dto/createBird.dto';
import { UpdateBirdDto } from './dto/updateBird.dto';

@Injectable()
export class BirdsService {
  constructor(@InjectRepository(Bird) private birdRepo:Repository<Bird>){}

  async findOne(id: number){
    const bird = await this.birdRepo.createQueryBuilder('bird')
      .where('bird.id = :id', { id })
      .getOneOrFail().catch(err => {
        console.error('Error in finding bird:', err.message);
        throw new NotFoundException();
      });

    return bird
  }

  async findAll(){
    const wishlistBirds = await this.birdRepo.createQueryBuilder('bird').getMany()
    return wishlistBirds
  }

  async create(dto: CreateBirdDto){
    return await this.birdRepo.save(dto)
  }

  async update(id: number, dto: UpdateBirdDto){
    return await this.birdRepo.update({id}, dto)
  }

  async delete(id: number) {
    return await this.birdRepo.delete({id})
  }

  async getName(id: number) {
    return (await this.findOne(id)).name
  }

} 
