import { Faker, fakerEN_CA } from "@faker-js/faker"
import { setSeederFactory } from "typeorm-extension"
import { User } from "../entities/user.entity"

export const UserFactory = setSeederFactory(User, async (faker:Faker) => {
  
  const user = new User()
  user.email = faker.internet.email()
  user.firstName = faker.person.firstName()
  user.lastName = faker.person.lastName()
  user.password = faker.internet.password()

  return user
})


