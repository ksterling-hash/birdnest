import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Bird } from "./bird.entity";
import { BirdImg } from "./birdimg.entity";


@Entity()
export class SeenBird{

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  date: Date

  @Column({nullable: true})
  wishlistedDate: Date

  @ManyToOne(() => Profile, (profile) => profile.seenBirds)
  profile: Profile

  @ManyToOne(() => Bird, (bird) => bird.seenBirds)
  @JoinColumn({name: 'birdId'})
  bird: number

  @ManyToMany(() => BirdImg, (birdImg) => birdImg.seenbird)
  birdimg: BirdImg[]
} 