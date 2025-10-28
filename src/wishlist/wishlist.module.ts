import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistBird } from '../entities/wishlistBird.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistBird])],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService]
})
export class WishlistModule {}
