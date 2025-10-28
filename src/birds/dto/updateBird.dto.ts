import { PartialType } from "@nestjs/swagger";
import { CreateBirdDto } from "./createBird.dto";


export class UpdateBirdDto extends PartialType(CreateBirdDto) {}