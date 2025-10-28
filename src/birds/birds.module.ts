import { Module, ValidationPipe } from '@nestjs/common';
import { BirdsController } from './birds.controller';
import { BirdsService } from './birds.service';
import { Bird } from '../entities/bird.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Bird])],
  controllers: [BirdsController],
  providers: [BirdsService],
  exports: [BirdsService]
})
export class BirdsModule {}
