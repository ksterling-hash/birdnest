import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistService } from './wishlist.service';
import { WishlistBird } from '../entities/wishlistBird.entity';
import { Bird } from '../entities/bird.entity';
import { mockQueryBuilder } from '../../test/testMocks';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

const mockWishlistRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
}


describe('WishlistService', () => {
  let service: WishlistService;
  let wishlistRepository: MockType<Repository<WishlistBird>>

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getRepositoryToken(WishlistBird),
          useValue: mockWishlistRepository
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    wishlistRepository = module.get(getRepositoryToken(WishlistBird))
  });


  ////////
  it('returns a wishlist bird by id', async () => {
    const wishlistBird = {id: 1, bird: {} as Bird }
    mockQueryBuilder.getOneOrFail.mockResolvedValue(wishlistBird)

    const result = await service.findOne(1)
    expect(result).toEqual(wishlistBird)
    expect(mockWishlistRepository.createQueryBuilder).toHaveBeenCalledWith('wishlistBird')
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('wishlistBird.id = :id', { id: 1 })
  });


  it('tests finding all seenbirds in a profile', async () => {
    const mockWishlist = [
      { id: 1, bird: { id: 21, name: 'American Crow' } },
    ];

    mockQueryBuilder.getMany.mockResolvedValue(mockWishlist)

    const result = await service.findAllProfile(1)
    
    expect(result).toEqual(mockWishlist)
    expect(mockWishlistRepository.createQueryBuilder).toHaveBeenCalledWith('wishlistBird')
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('wishlistBird.bird', 'bird')
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('wishlistBird.profile', 'profile')
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('profile.id = :profileId', { profileId: 1 })
    expect(mockQueryBuilder.getMany).toHaveBeenCalledWith()
    });


  ///////
  it('returns all wishlist birds', async () => {
    const wishlistBirds = [
      {id: 1, bird: {} as Bird},
    ]

    mockQueryBuilder.getMany.mockResolvedValue(wishlistBirds); 

    const result = await service.findAll();
    
    expect(result).toEqual(wishlistBirds);
    expect(mockWishlistRepository.createQueryBuilder).toHaveBeenCalledWith('wishlistBird')
    expect(mockQueryBuilder.getMany).toHaveBeenCalledWith();
  });


  /////////
  it('creates a new wishlist bird', async () => {
    const profileId = 4
    const birdDto = { bird: 10 }
    const createdWishlist = { id: 1, profile: { id: profileId }, bird: birdDto.bird, count: 1 }    
    const mockInsertResult = { raw: [], affected: 1, identifiers: [{ id: 1 }] };

    mockWishlistRepository.findOne.mockResolvedValue(null)
    mockWishlistRepository.findOneBy.mockResolvedValue(createdWishlist);
    mockQueryBuilder.execute.mockResolvedValue(mockInsertResult)

    const result = await service.create(profileId, birdDto);

    expect(result).toEqual(createdWishlist);
    expect(mockWishlistRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });

  });

  /////////
  it('updates a wishlist bird', async () => {
    const wishlistId = 1
    const dto = { bird: 12 }

    const mockUpdateResult = {raw: [], affected: 1};

    mockQueryBuilder.execute.mockResolvedValue(mockUpdateResult);

    const result = await service.update(wishlistId, dto);
    expect(result).toEqual(mockUpdateResult);
    expect(mockWishlistRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.update).toHaveBeenCalledWith(WishlistBird);
    expect(mockQueryBuilder.set).toHaveBeenCalledWith(dto);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: wishlistId });       
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
  })


  /////////
  it('deletes a wishlist bird', async () => {
    const wishlistId = 1;
    const dto = { bird: 10 };
    const deleteResult = { raw: [], affected: 1 };

    mockQueryBuilder.execute.mockResolvedValue(deleteResult);
   
    const result = await service.delete(wishlistId);

    expect(result).toEqual(deleteResult);
    expect(mockWishlistRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.delete).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalledWith(WishlistBird);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: wishlistId });       
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
  })

});