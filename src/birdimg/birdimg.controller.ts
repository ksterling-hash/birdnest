import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile } from '@nestjs/common';
import { BirdImgService } from './birdimg.service';
import { CreateBirdImgDto } from './dto/createBirdImg.dto';
import { BirdAddImgParams, BirdImgCreate, BirdImgOneParam, BirdImgParam } from '../decorators/apiBirdImgParam.decorator';

@Controller('birdimg')
export class BirdImgController {
  constructor(private readonly birdImgService: BirdImgService){}

  @Get()
  findAll(){
    return this.birdImgService.findAll()
  }

  @Get(':id')
  @BirdImgParam()
  findOne(@Param('id', ParseIntPipe) id: number){
    return this.birdImgService.findOne(id)
  }

  @Get('profile/:profileId/')
  @BirdImgOneParam()
  findAllProfile(@Param("profileId", ParseIntPipe) profileId: number){
    return this.birdImgService.findAllProfile(profileId)
  }

  @Post('profile/:profileId/:seenbirdId/')
  @BirdImgCreate()
  create(@Param("profileId") profileId, @Param("seenbirdId") seenbirdId, @UploadedFile() file: Express.Multer.File) {
    // console.log(file)
    return this.birdImgService.create(profileId, seenbirdId, {path: file.path})
  }

  @Patch(':id')
  @BirdImgParam()
  update(@Param('id') id, @Body() body: CreateBirdImgDto){
    return this.birdImgService.update(id, body)
  }

  @Delete(':id')
  @BirdImgParam()
  delete(@Param("id") id){
    return this.birdImgService.delete(id)
  }

  @Post(':seenbirdId/:imgId/')
  @BirdAddImgParams()
  addSeenbirdToImage(@Param("seenbirdId") seenbirdId, @Param("imgId") imgId){
    return this.birdImgService.addSeenbirdToImage(seenbirdId, imgId)
  }

}