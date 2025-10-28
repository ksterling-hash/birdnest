import { ConflictException, ForbiddenException, Injectable, NotFoundException, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistBird } from '../entities/wishlistBird.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateWishlistBirdDto } from './dto/createWishlistBird.dto';
import { UpdateWishlistBirdDto } from './dto/updateWishlistBird.dto';

@Injectable()
export class WishlistService {

  constructor(@InjectRepository(WishlistBird) private wishlistBirdRepo: Repository<WishlistBird>) { }

  async findOne(id: number) {
    const wishlistBird = await this.wishlistBirdRepo.createQueryBuilder('wishlistBird')
      // .addSelect(['bird.id', 'bird.name'])
      .leftJoinAndSelect('wishlistBird.bird', 'bird')
      .innerJoin('wishlistBird.profile', 'profile')
      .where('wishlistBird.id = :id', { id })
      .getOneOrFail()

    return wishlistBird
  }

  async findAllProfile(profileId: number) {
    const seenBirds = await this.wishlistBirdRepo.createQueryBuilder('wishlistBird')
      .addSelect(['bird.id', 'bird.name'])
      .leftJoin('wishlistBird.bird', 'bird')
      // .leftJoinAndSelect('seenBird.bird', 'bird') 
      .innerJoin('wishlistBird.profile', 'profile')
      .where('profile.id = :profileId', { profileId })
      .getMany()

    return seenBirds
  }


  async findAll() {
    const wishlistBirds = await this.wishlistBirdRepo.createQueryBuilder('wishlistBird')
      .addSelect(['bird.id', 'bird.name'])
      .leftJoin('wishlistBird.bird', 'bird')
      // .leftJoinAndSelect('seenBird.bird', 'bird') 
      .addSelect(['profile.id'])
      .innerJoin('wishlistBird.profile', 'profile')
      .getMany()

    return wishlistBirds
  }

  async create(profileId: number, dto: CreateWishlistBirdDto) {

    const birdId = dto.bird
    const wishlistBird = await this.findBird(profileId, birdId)

    // increasing wishlist bird count if it already exists.
    if (wishlistBird) {
      wishlistBird.count += 1
      console.log('Existing wishlist bird found, count incremented')
      return await this.wishlistBirdRepo.save(wishlistBird);
    }

    const insertResult = await this.wishlistBirdRepo.createQueryBuilder()
      .insert()
      .into(WishlistBird)
      .values({ ...dto, profile: { id: profileId } })
      .execute();

    const newId = insertResult.identifiers[0].id;
    return this.wishlistBirdRepo.findOneBy({ id: newId });
  }

  //an update method maybe not necessary.
  async update(id: number, dto: UpdateWishlistBirdDto) {
    const result = await this.wishlistBirdRepo.createQueryBuilder()
      .update(WishlistBird)
      .set(dto)
      .where('id = :id', { id })
      .execute()

    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist bird with ID ${id} not found`)
    }
    return result
  }

  async delete(id: number) {
    const result = await this.wishlistBirdRepo.createQueryBuilder()
      .delete()
      .from(WishlistBird)
      .where('id = :id', { id })
      .execute()

    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist bird with ID ${id} not found`)
    }
    return result
  }

  async updateCount(id: number, increase: boolean = true) {
    const result = await this.wishlistBirdRepo.createQueryBuilder()
      .update(WishlistBird)
      .set(increase ? { count: () => 'count + 1' } : { count: () => 'count - 1' })
      .where('id = :id', { id })
      .execute()

    return result
  }

  async findBird(profileId: number, birdId: number) {
    const foundBird = await this.wishlistBirdRepo.createQueryBuilder('wishlistBird')
      .where('wishlistBird.profileId = :profileId', { profileId })
      .andWhere('wishlistBird.birdId = :birdId', { birdId })
      .getOne()

    return foundBird;
  }
}
