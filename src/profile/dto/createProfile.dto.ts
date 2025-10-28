import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateProfileDto {

  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  region: string

  @ApiProperty()
  @IsString()
  favorite: string

}