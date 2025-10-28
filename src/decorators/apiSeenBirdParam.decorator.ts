import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';


export function SeenBirdOneParam() {
  return applyDecorators(
    ApiParam({
      name: 'profileId',
      type: 'number',
      description: 'ID of the profile',
      required: true,
    }),
  )
}

export function SeenParam() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID of the seenbird',
      required: true,
    }),
  )
}


