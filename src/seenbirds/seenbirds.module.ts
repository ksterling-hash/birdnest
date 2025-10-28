import { Module } from '@nestjs/common';
import { SeenbirdsService } from './seenbirds.service';
import { SeenbirdsController } from './seenbirds.controller';
import { SeenBird } from '../entities/seenBird.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { BirdsModule } from '../birds/birds.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeenBird]), WishlistModule, BirdsModule],
  providers: [SeenbirdsService],
  controllers: [SeenbirdsController],
  exports: [SeenbirdsService]
})
export class SeenbirdsModule {}
