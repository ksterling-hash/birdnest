import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Profile } from "../entities/profile.entity";
import { Bird } from "../entities/bird.entity";
import { birdsData } from "./birds.data";
import { User } from "../entities/user.entity";
import { faker } from "@faker-js/faker";


export class MainSeeder implements Seeder {

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {

    const birdRepository = dataSource.getRepository(Bird)
    console.log("Seeding Birds...")
    const birds = await birdRepository.save(birdsData as Bird[]);

    const userFactory = factoryManager.get(User)
    console.log("Seeding Users...")
    const users = await userFactory.saveMany(20)

    // const imgFactory = factoryManager.get(BirdImg)
    // console.log("Seeding Images...")
    // const birdImgs = await imgFactory.saveMany(20)

    const profileFactory = factoryManager.get(Profile)
    // console.log("Seeding Profiles...")
    // const profiles = await profileFactory.saveMany(20)

    console.log("Seeding Profiles...")
    const profiles = await Promise.all(
      users.map(async (user, favorite) => {
        const profile = await profileFactory.make({
          user: user,
        });
        return profile
      })
    )

    const profileRepo = dataSource.getRepository(Profile)
    await profileRepo.save(profiles)


    // const seenBirdFactory = factoryManager.get(SeenBird)
    // console.log("Seeding SeenBirds...")
    // const seenBird = await seenBirdFactory.saveMany(20)

    // const propertyFactory = factoryManager.get(Property)
    // const propertyFeatureFactory = factoryManager.get(PropertyFeature)

    // console.log("Seeding Properties...")
    // const properties = await Promise.all(
    //   Array(50).fill("").map(async () => {
    //     const property = await propertyFactory.make({
    //       user: faker.helpers.arrayElement(users),
    //       type: faker.helpers.arrayElement(propertyType),
    //       propertyFeature: await propertyFeatureFactory.save()
    //     });
    //     return property
    //   })
    // )
    // const propertyRepo = dataSource.getRepository(Property)
    // await propertyRepo.save(properties)
  }
}