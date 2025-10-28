import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Unique } from "typeorm"
import { Profile } from "./profile.entity"


@Entity()
@Unique(['profile'])
export class User{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  firstName: string
  
  @Column()
  lastName: string

  @Column()
  password: string

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn({ name: 'profileId' })
  profile: Profile
}