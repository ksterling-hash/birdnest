import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';


export function WishlistBirdTwoParams() {
  return applyDecorators(
    WishlistBirdOneParam(),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID of the wishlist bird',
      required: true,
    }),
  )
}

export function WishlistBirdTypeParam() {
  return applyDecorators(
    WishlistBirdOneParam(),
    ApiParam({
      name: 'birdId',
      type: 'number',
      description: 'ID of the bird',
      required: true,
    }),
  )
}

export function WishlistBirdOneParam() {
  return applyDecorators(
    ApiParam({
      name: 'profileId',
      type: 'number',
      description: 'ID of the profile',
      required: true,
    }),
  )
}

export function WishlistBirdParam() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID of the wishlist bird',
      required: true,
    }),
  )
}
