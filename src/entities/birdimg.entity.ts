import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { SeenBird } from "./seenBird.entity";


@Entity()
export class BirdImg{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  path: string

  @ManyToOne(() => Profile, (profile) => profile.birdImg)
  profile: Profile

  @ManyToMany(() => SeenBird, (seenBird) => seenBird.birdimg)
  @JoinColumn({name: 'seenbirdId'})
  @JoinTable()
  seenbird: SeenBird[]
} 