import { Faker } from "@faker-js/faker"
import { BirdImg } from "../entities/birdimg.entity"
import { setSeederFactory } from "typeorm-extension"



export const ImgFactory = setSeederFactory(BirdImg, (faker:Faker) => {
  const img = new BirdImg()
  // img.url = faker.image.urlPicsumPhotos({blur: 5, width: 640, height: 480})

  return img
})