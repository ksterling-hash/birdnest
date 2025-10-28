import { PartialType } from "@nestjs/swagger";
import { CreateSeenBirdDto } from "./createSeenBird.dto";


export class UpdateSeenBirdDto extends PartialType(CreateSeenBirdDto) {}