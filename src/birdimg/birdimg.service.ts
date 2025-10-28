import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BirdImg } from '../entities/birdimg.entity';
import { Repository } from 'typeorm';
import { CreateBirdImgDto } from './dto/createBirdImg.dto';
import { UpdateBirdImgDto } from './dto/updateBirdImg.dto';
import { SeenBird } from '../entities/seenBird.entity';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class BirdImgService {
  constructor(@InjectRepository(BirdImg) private birdImgRepo: Repository<BirdImg>){}

  async findOne(id: number) {
    const birdimg = await this.birdImgRepo.createQueryBuilder('birdImg')
      .addSelect(['seenbird.id'])
      .leftJoin('birdImg.seenbird', 'seenbird')
      .where('birdImg.id = :id', { id })
      .getOne()

    if (!birdimg) {
      throw new NotFoundException(`Bird image with ID ${id} not found`)
    }
    return birdimg
  }

  async findAll() {
    const birdImgs = await this.birdImgRepo.createQueryBuilder('birdImg')
      .addSelect(['seenbird.id'])
      .leftJoin('birdImg.seenbird', 'seenbird')
      .addSelect(['profile.id'])
      .innerJoin('birdImg.profile', 'profile')
      .getMany()

    return birdImgs
  }

  async findAllProfile(profileId: number) {
    const birdImgs = await this.birdImgRepo.createQueryBuilder('birdImg')
      .addSelect(['seenbird.id'])
      .leftJoin('birdImg.seenbird', 'seenbird')
      .innerJoin('birdImg.profile', 'profile')
      .where('profile.id = :profileId', { profileId })
      .getMany()

    return birdImgs;
  }

  async create(profileId: number, seenbirdId: number, dto: CreateBirdImgDto){

    const newBirdImg = this.birdImgRepo.create(dto);
    newBirdImg.seenbird = [{ id: seenbirdId } as SeenBird];
    newBirdImg.profile = { id: profileId } as Profile
    return this.birdImgRepo.save(newBirdImg);

  }

  //an update method maybe not necessary.
  async update(id: number, dto: UpdateBirdImgDto) {
    const result = await this.birdImgRepo.createQueryBuilder()
      .update(BirdImg)
      .set(dto)        
      .where('id = :id', { id })
      .execute()

    if (result.affected === 0) {
      throw new NotFoundException(`Seen bird with ID ${id} not found`)
    }
    return result
  }

  async delete(id: number) {
    const result = await this.birdImgRepo.createQueryBuilder()
      .delete()
      .from(BirdImg)
      .where('id = :id', { id }) 
      .execute()

    if (result.affected === 0) {
      throw new NotFoundException(`Seen bird with ID ${id} not found`)
    }
    return result
  }

  
  async addSeenbirdToImage(seenbirdId: number, imgId: number) {
    const result = await this.birdImgRepo.createQueryBuilder()
      .relation(BirdImg, 'seenbird')
      .of(imgId) 
      .add(seenbirdId);

    return result
  }
}