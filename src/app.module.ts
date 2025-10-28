import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirdsModule } from './birds/birds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { SeenbirdsModule } from './seenbirds/seenbirds.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { BirdImgModule } from './birdimg/birdimg.module';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => 
        AppDataSource.options,
      
      
      // (configService: ConfigService) => ({
      //   type: 'postgres',
      //   host: configService.get('DB_HOST'),
      //   port: +configService.get('DB_PORT'),
      //   username: configService.get('DB_USER'),
      //   password: configService.get('DB_PASS'),
      //   database: configService.get('DB_NAME'),
      //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //   synchronize: true
      // }),


        inject: [ConfigService]
    }),
    ProfileModule,
    SeenbirdsModule,
    BirdsModule,
    WishlistModule,
    BirdImgModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

