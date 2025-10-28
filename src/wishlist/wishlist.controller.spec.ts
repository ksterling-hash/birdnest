import { Test } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { MockType } from './wishlist.service.spec';
import { mock } from 'node:test';

describe('WishlistBirdController', () => {
  let controller: WishlistController;									
  let wishlistService: MockType<WishlistService>;
  
  const mockWishlistService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findAllProfile: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: mockWishlistService,
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    wishlistService = module.get(WishlistService);
  });

  it('should return wishlist bird by ID', async () => {
    const wishlistBird = { id: 1, bird: 'American Crow' };
    mockWishlistService.findOne.mockResolvedValue(wishlistBird);

    const result = await controller.findOne(1);

    expect(result).toEqual(wishlistBird);
    expect(mockWishlistService.findOne).toHaveBeenCalledWith(1);
  });


  //
  it('should return all wishlist birds on a profile', async () => {
    const seenBirds = [
      {id: 1, bird: {id: 10, name: "European Starling"}},
    ]

    mockWishlistService.findAllProfile.mockResolvedValue(seenBirds);

    const result = await controller.findAllProfile(1);

    expect(result).toEqual(seenBirds);
    expect(mockWishlistService.findAllProfile).toHaveBeenCalled();
  });


  //
  it('should return all wishlist birds', async () => {
    const wishlistBirds = [
      {id: 1, bird: {id: 10, name: "European Starling"}},
    ]

    mockWishlistService.findAll.mockResolvedValue(wishlistBirds);

    const result = await controller.findAllProfile(1);

    expect(result).toEqual(wishlistBirds);
    expect(mockWishlistService.findAllProfile).toHaveBeenCalled();
  });


  ////
  it('should create a wishlist bird', async () => {
    const wishlistBirds = { bird: 21 };
    const created = { id: 1, bird: 21 };
    mockWishlistService.create.mockResolvedValue(created);

    const result = await controller.create(1, wishlistBirds);

    expect(result).toEqual(created);
    expect(mockWishlistService.create).toHaveBeenCalledWith(1, wishlistBirds);
  });


  ////
  it('should update an existing wishlist bird', async () => {
    const seenBird = { bird: 21 };
    const mockUpdate = {raw: [], affected: 1}

    mockWishlistService.update.mockResolvedValue(mockUpdate)

    const result = await controller.update(1, seenBird)
    expect(result).toEqual(mockUpdate)
    expect(mockWishlistService.update).toHaveBeenCalledWith(1, seenBird);
  })


  ////
  it('should delete an existing wishlist bird', async () => {
    const mockUpdate = {raw: [], affected: 1}

    mockWishlistService.delete.mockResolvedValue(mockUpdate)

    const result = await controller.delete(1)
    expect(mockWishlistService.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUpdate)
  })


});