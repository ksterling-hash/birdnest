import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
// import { Wishlist } from "./wishlist.entity";
import { SeenBird } from "./seenBird.entity";
import { WishlistBird } from "./wishlistBird.entity";
import { BirdImg } from "./birdimg.entity";
import { User } from "./user.entity";


@Entity()
@Unique(['username'])
export class Profile {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  region: string

  @Column()
  favorite: string

  @OneToMany(() => WishlistBird, (wishlist) => wishlist.profile)
  wishlist: WishlistBird[]

  @OneToMany(() => SeenBird, (seenBird) => seenBird.profile)
  seenBirds: SeenBird[]

  @OneToMany(() => BirdImg, (birdImg) => birdImg.profile)
  birdImg: BirdImg[]

  @OneToOne(() => User, (user) => user.profile)
  user: User

}
