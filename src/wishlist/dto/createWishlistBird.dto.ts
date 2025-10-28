import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Bird } from "../../entities/bird.entity";


export class CreateWishlistBirdDto {
  @ApiProperty()
  bird: number
}