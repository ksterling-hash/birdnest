import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService){}

  @Get()
  findAll(){
    return this.userService.findAll()
  }

  @Get(":id")
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the user',
    required: true,
  })
  findOne(@Param("id", ParseIntPipe) id){
    return this.userService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateUserDto){
    return this.userService.create(dto)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the user',
    required: true,
  })
  update(@Param('id') id, @Body() body: UpdateUserDto){
    return this.userService.update(id, body)
  }

  @Delete(":id")
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the user',
    required: true,
  })
  delete(@Param("id") id){
    return this.userService.delete(id)
  }

}
