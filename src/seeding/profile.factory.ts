import { Faker, fakerEN_CA } from "@faker-js/faker"
import { Profile } from "../entities/profile.entity"
import { setSeederFactory } from "typeorm-extension"
import { Bird } from "../entities/bird.entity"
import { datasource } from "./seed"

export const ProfileFactory = setSeederFactory(Profile, async (faker: Faker) => {

  const profile = new Profile()
  profile.username = faker.internet.displayName()
  profile.region = Math.random() < 0.85 ? faker.location.state() : fakerEN_CA.location.state()
  profile.favorite = (await getFavorite()).toString()

  return profile


  async function getFavorite() {
    const dataSource = datasource;
    const birdRepo = dataSource.getRepository(Bird);
    const randomBird = await birdRepo.createQueryBuilder('bird')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne()

    const favorite = randomBird?.name || faker.animal.bird();

    return favorite
  }

})


