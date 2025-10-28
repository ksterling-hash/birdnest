import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { SeenBird } from "./seenBird.entity";
import { WishlistBird } from "./wishlistBird.entity";

@Entity()
// @TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Bird{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  sciName: string

  @Column()
  description: string

  @Column()
  region: string

  @OneToMany(() => SeenBird, (seenBird) => seenBird.bird)
  seenBirds: SeenBird[]

  @OneToMany(() => WishlistBird, (wishlistBird) => wishlistBird.bird)
  wishlistBird: WishlistBird[]
}