import { PartialType } from "@nestjs/swagger";
import { CreateBirdImgDto } from "./createBirdImg.dto";


export class UpdateBirdImgDto extends PartialType(CreateBirdImgDto) {}