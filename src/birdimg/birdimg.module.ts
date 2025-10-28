import { Module } from '@nestjs/common';
import { BirdImgService } from './birdimg.service';
import { BirdImg } from '../entities/birdimg.entity';
import { BirdImgController } from './birdimg.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BirdImg])],
  providers: [BirdImgService],
  controllers: [BirdImgController]
})
export class BirdImgModule {}
