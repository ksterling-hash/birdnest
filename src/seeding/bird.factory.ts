import { Faker, fakerEN_CA } from "@faker-js/faker"
import { Profile } from "../entities/profile.entity"
import { setSeederFactory } from "typeorm-extension"
import { Bird } from "../entities/bird.entity"


export const BirdFactory = setSeederFactory(Bird, (faker:Faker) => {
  const bird = new Bird()
  bird.name = faker.animal.bird()
  bird.sciName = ''
  bird.description = ''
  bird.region = ''

  return bird
})