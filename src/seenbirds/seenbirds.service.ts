import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeenBird } from '../entities/seenBird.entity';
import { CreateSeenBirdDto } from './dto/createSeenBird.dto';
import { UpdateSeenBirdDto } from './dto/updateSeenBird.dto';
import { WishlistService } from '../wishlist/wishlist.service';
import { BirdsService } from '../birds/birds.service';

@Injectable()
export class SeenbirdsService {
  constructor(@InjectRepository(SeenBird) private seenBirdRepo: Repository<SeenBird>,
    private readonly wishlistService: WishlistService,
    private readonly birdService: BirdsService
    /*@InjectRepository(WishlistBird) private wishlistRepo: Repository<WishlistBird>*/) { }

  async findOne(id: number) {
    const seenBird = await this.seenBirdRepo.createQueryBuilder('seenBird')
      .addSelect(['bird.id', 'bird.name'])
      .leftJoin('seenBird.bird', 'bird')
      // .leftJoinAndSelect('seenBird.bird', 'bird') 
      .innerJoin('seenBird.profile', 'profile')
      .where('seenBird.id = :id', { id })
      .getOne()

    if (!seenBird) throw new NotFoundException(`Seen bird with ID ${id} doesn't exist`)

    return seenBird
  }

  // async findBird(profileId: number, birdId: number) {
  //   const seenBirds = await this.seenBirdRepo.createQueryBuilder('seenBird')
  //     .addSelect(['bird.id', 'bird.name'])
  //     .leftJoin('seenBird.bird', 'bird')
  //     // .leftJoinAndSelect('seenBird.bird', 'bird')
  //     .innerJoin('seenBird.profile', 'profile')
  //     .where('seenBird.birdId = :birdId', { birdId })
  //     .andWhere('profile.id = :profileId', { profileId })
  //     .getMany()

  //   return seenBirds
  // } 

  async findAllProfile(profileId: number) {
    const seenBirds = await this.seenBirdRepo.createQueryBuilder('seenBird')
      .addSelect(['bird.id', 'bird.name'])
      .leftJoin('seenBird.bird', 'bird')
      // .leftJoinAndSelect('seenBird.bird', 'bird') 
      .innerJoin('seenBird.profile', 'profile')
      .where('profile.id = :profileId', { profileId })
      .getMany()

    if (!seenBirds) throw new NotFoundException(`Profile with ID ${profileId} has no seen birds`)

    const birdCounts = this.mapBirdCounts(seenBirds)
    return { seenBirds, birdCounts }
  }

  async findAll() {
    const seenBirds = await this.seenBirdRepo.createQueryBuilder('seenBird')
      .addSelect(['bird.id', 'bird.name', 'profile.id'])
      .leftJoin('seenBird.bird', 'bird')
      .innerJoin('seenBird.profile', 'profile')
      .getMany()

    return seenBirds
  }


  async create(profileId: number, dto: CreateSeenBirdDto) {

    const birdId = dto.bird
    const wishlistBird = await this.wishlistService.findBird(profileId, birdId)

    let wishlistUpdate: Promise<any> = Promise.resolve()

    // checks if bird exists in the wishlist, then removes or decrements count if it does.
    if (wishlistBird) {
      const saveDate = wishlistBird.date
      if (wishlistBird.count === 1) {
        wishlistUpdate = this.wishlistService.delete(wishlistBird.id)

      } else if (wishlistBird.count > 1) {
        wishlistUpdate = this.wishlistService.updateCount(wishlistBird.id, false)
      }

      let findPromise: Promise<any> = this.findAllProfile(profileId)
      // grabs the first element of the returned array. wishlistUpdate isn't needed
      const [seenBirdResult] = await Promise.all([
        findPromise,
        wishlistUpdate
      ])

      // if bird not already in seenbirds, it stores the date when it was originally wishlisted.
      if (!(seenBirdResult.seenBirds.find(bird => bird.id === birdId))) {
        const newDto = { ...dto, wishlistedDate: saveDate }

        const newSeenBird = this.seenBirdRepo.createQueryBuilder()
          .insert()
          .into(SeenBird)
          .values({ ...newDto, profile: { id: profileId } })
          .execute()

        return newSeenBird
      }
    }

    const newSeenBird = this.seenBirdRepo.createQueryBuilder()
      .insert()
      .into(SeenBird)
      .values({ ...dto, profile: { id: profileId } })
      .execute()

    return newSeenBird;
  }

  async update(id: number, dto: UpdateSeenBirdDto) {
    const result = await this.seenBirdRepo.createQueryBuilder()
      .update(SeenBird)
      .set(dto)
      .where('id = :id', { id: id })
      .execute()

    if (result.affected === 0) {
      throw new NotFoundException(`Seen bird with ID ${id} not found`)
    }
    return result
  }

  async delete(id: number) {
    const result = await this.seenBirdRepo.createQueryBuilder()
      .delete()
      .from(SeenBird)
      .where('id = :id', { id })
      .execute()

    if (result.affected === 0) {
      throw new NotFoundException(`Seen bird with ID ${id} not found`)
    }
    return result
  }

  // helper function to display bird counts when getting all seenbirds for a profile.
  private mapBirdCounts(birds: SeenBird[]) {

    const birdCounts: Record<string, number> = {};

    for (const bird of birds) {
      // workaround to get name, bird is known after a query
      const birdName: string = (bird.bird as unknown as { name: string }).name
      birdCounts[birdName] = (birdCounts[birdName] || 0) + 1
    }

    return Object.entries(birdCounts).map(([name, count]) => ({
      name,
      count,
    }))
  }
}
