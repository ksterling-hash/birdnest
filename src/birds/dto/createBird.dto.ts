import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateBirdDto {

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  sciName: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsString()
  region: string

}