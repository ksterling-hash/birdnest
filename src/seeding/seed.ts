import { DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { DataSource } from "typeorm";
import { ProfileFactory } from "./profile.factory";
import { MainSeeder } from "./main.seeder";
import { seederConfig } from "./seederConfig";
import { ImgFactory } from "./img.factory";
import { UserFactory } from "./user.factory";

const options: DataSourceOptions & SeederOptions = {
  ...seederConfig,
  factories: [ProfileFactory, UserFactory, ImgFactory],
  seeds: [MainSeeder]
}

export const datasource = new DataSource(options)
datasource.initialize().then(async () => {
  await datasource.synchronize(true)
  await runSeeders(datasource)
  process.exit()
})