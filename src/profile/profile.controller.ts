import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/createProfile.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @Get()
  findAll() {
    return this.profileService.findAll()
  }

  @Get(":id")
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the profile',
    required: true,
  })
  findOne(@Param("id", ParseIntPipe) id) {
    return this.profileService.findOne(id)
  }

  @Post(':userId')
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'ID of the User',
    required: true,
  })
  create(@Param('userId') userId: number, @Body() dto: CreateProfileDto) {
    return this.profileService.create(userId, dto)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the profile',
    required: true,
  })
  update(@Param('id') id, @Body() body: CreateProfileDto) {
    return this.profileService.update(id, body)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the profile',
    required: true,
  })
  delete(@Param("id") id: number) {
    return this.profileService.delete(id)
  }

}
