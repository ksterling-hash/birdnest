import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { ApiParam, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { CreateBirdDto } from './dto/createBird.dto';

@Controller('birds')
export class BirdsController {
  constructor(private birdService: BirdsService){}

  @Get()
  findAll(){
    return this.birdService.findAll()
  }

  @Get(":id")
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the bird',
    required: true,
  })
  findOne(@Param("id", ParseIntPipe) id){
    return this.birdService.findOne(id)
  }

  // @Post()
  create(@Body() dto: CreateBirdDto){
    return this.birdService.create(dto)
  }

  // @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the bird',
    required: true,
  })
  update(@Param('id') id, @Body() body: CreateBirdDto){
    return this.birdService.update(id, body)
  }

  // @Delete(":id")
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the bird',
    required: true,
  })
  delete(@Param("id") id){
    return this.birdService.delete(id)
  }
}
