import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Profile } from "./profile.entity";
import { Bird } from "./bird.entity";


@Entity()
export class WishlistBird{

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  date: Date

  @Column({default: 1})
  count: number

  @ManyToOne(() => Bird, (bird) => bird.seenBirds)
  @JoinColumn({name: 'birdId'})
  bird: number

  @ManyToOne(() => Profile, (profile) => profile.wishlist)
  @JoinColumn()
  profile: Profile

}