import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateWishlistBirdDto } from "./createWishlistBird.dto";


export class UpdateWishlistBirdDto extends PartialType(CreateWishlistBirdDto) {}