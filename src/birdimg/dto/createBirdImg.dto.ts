import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateBirdImgDto {

  @ApiProperty()
  @IsString()
  path: string
  
}