import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { ApiConsumes } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { imageStorage } from '../../config/multer.config';

export function BirdImgTwoParams() {
  return applyDecorators(
    BirdImgOneParam(),
    ApiParam({
      name: 'seenbirdId',
      type: 'number',
      description: 'ID of the seen bird',
      required: true,
    }),
  )
}

export function BirdImgOneParam() {
  return applyDecorators(
    ApiParam({
      name: 'profileId',
      type: 'number',
      description: 'ID of the profile',
      required: true,
    }),
  )
}

export function BirdImgParam() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID of the bird image',
      required: true,
    }),
  )
}

export function BirdImgSeenParam() {
  return applyDecorators(
    ApiParam({
      name: 'seenbirdId',
      type: 'number',
      description: 'ID of the seen bird',
      required: true,
    }),
  )
}

export function BirdAddImgParams() {
  return applyDecorators(
    ApiParam({
      name: 'seenbirdId',
      type: 'number',
      description: 'ID of the seen bird',
      required: true,
    }),
    ApiParam({
      name: 'imgId',
      type: 'number',
      description: 'ID of the image',
      required: true,
    }),
  )
}

export function BirdImgCreate() {
  return applyDecorators(
    BirdImgTwoParams(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary'
          },
        },
      },
    }),
    UseInterceptors(FileInterceptor('file', imageStorage))
  )
}


