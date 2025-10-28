import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SeenbirdsService } from './seenbirds.service';
import { CreateSeenBirdDto } from './dto/createSeenBird.dto';
import { SeenBirdOneParam, SeenParam } from '../decorators/apiSeenBirdParam.decorator';
import { UpdateSeenBirdDto } from './dto/updateSeenBird.dto';

@Controller('seenbirds')
export class SeenbirdsController {
  constructor(private seenBirdsService: SeenbirdsService){}

  @Get()
  findAll(){
    return this.seenBirdsService.findAll()
  }

  @Get('profile/:profileId/')
  @SeenBirdOneParam()
  findAllProfile(@Param("profileId", ParseIntPipe) profileId){
    return this.seenBirdsService.findAllProfile(profileId)
  }

  @Get(':id')
  @SeenParam()
  findOne(@Param('id', ParseIntPipe) id){
    return this.seenBirdsService.findOne(id)
  }

  // @Get('bird/:id/profile/:profileId/')
  // @SeenBirdTypeParam()
  // findBird(@Param("profileId", ParseIntPipe) profileId, @Param("id", ParseIntPipe) id){
  //   return this.seeBirdsService.findBird(profileId, id)
  // }

  @Post('profile/:profileId/')
  @SeenBirdOneParam()
  create(@Param('profileId') id, @Body() dto: CreateSeenBirdDto){
    return this.seenBirdsService.create(id, dto)
  }

  @Patch(':id')
  @SeenParam()
  update(@Param('id') id, @Body() body: UpdateSeenBirdDto){
    return this.seenBirdsService.update(id, body)
  }

  @Delete(':id')
  @SeenParam()
  delete(@Param("id") id){
    return this.seenBirdsService.delete(id)
  }
}