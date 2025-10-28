import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateSeenBirdDto } from 'src/seenbirds/dto/createSeenBird.dto';
import { SeenbirdsService } from 'src/seenbirds/seenbirds.service';
import { WishlistService } from './wishlist.service';
import { WishlistBirdOneParam, WishlistBirdParam, WishlistBirdTwoParams } from '../decorators/apiWishlistBirdParam.decorator';
import { CreateWishlistBirdDto } from './dto/createWishlistBird.dto';
import { UpdateWishlistBirdDto } from './dto/updateWishlistBird.dto';
import { profile } from 'console';

@Controller('wishlist')
export class WishlistController {

  constructor(private wishlistService: WishlistService){}
  
  @Get()
  findAll(){
    return this.wishlistService.findAll()
  }

  @Get('profile/:profileId/')
  @WishlistBirdOneParam()
  findAllProfile(@Param("profileId", ParseIntPipe) profileId){
    return this.wishlistService.findAllProfile(profileId)
  }

  @Get(':id')
  @WishlistBirdParam()
  findOne(@Param("id", ParseIntPipe) id){
    return this.wishlistService.findOne(id)
  }

  @Post('profile/:profileId/')
  @WishlistBirdOneParam()
  create(@Param('profileId') id, @Body() dto: CreateWishlistBirdDto){
    return this.wishlistService.create(id, dto)
  }

  @Patch(':id')
  @WishlistBirdParam()
  update(@Param('id') id, @Body() body: UpdateWishlistBirdDto){
    return this.wishlistService.update(id, body)
  }

  // @Patch(':id/increment')
  // @WishlistBirdParam()
  // updateCount(@Param('id') id){
  //   return this.wishlistService.updateCount(id)
  // }

  @Delete(':id')
  @WishlistBirdParam()
  delete(@Param("id") id){
    return this.wishlistService.delete(id)
  }
}
