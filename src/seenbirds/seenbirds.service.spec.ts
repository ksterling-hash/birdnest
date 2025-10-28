import { Test, TestingModule } from '@nestjs/testing';
import { SeenbirdsService } from './seenbirds.service';
import { SeenBird } from '../entities/seenBird.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { MockType } from '../profile/profile.service.spec';
import { Repository } from 'typeorm';
import { WishlistService } from '../wishlist/wishlist.service';
import { BirdsService } from '../birds/birds.service';
import { mockQueryBuilder } from '../../test/testMocks';
import { NotFoundException } from '@nestjs/common';

describe('SeenbirdsService', () => {
  let service: SeenbirdsService;
  let seenbirdsRepository: MockType<Repository<Profile>>

  const mockSeenBirdsRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    findAllProfile: jest.fn(),
    mapBirdsToCount: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  }

  const mockWishlistService = {
    findBird: jest.fn(),
    updateCount: jest.fn(),
    delete: jest.fn(),
  }

  const mockBirdService = {
    getName: jest.fn()
  }


  beforeEach(async () => {
    // clear mock call counts/state between tests so assertions on call counts are reliable
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeenbirdsService,
        {
          provide: getRepositoryToken(SeenBird),
          useValue: mockSeenBirdsRepository
        },
        {
          provide: WishlistService,
          useValue: mockWishlistService
        },
        {
          provide: BirdsService,
          useValue: mockBirdService
        }
      ],
    }).compile();

    service = module.get<SeenbirdsService>(SeenbirdsService);
    seenbirdsRepository = module.get(getRepositoryToken(SeenBird))
  });


  it('tests finding a single seenbird by id', async () => {
    const seenBird = { id: 1, bird: 21 }
    mockQueryBuilder.getOne.mockResolvedValue(seenBird)

    const result = await service.findOne(1)
    expect(result).toEqual(seenBird)

    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalledWith('seenBird')
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(['bird.id', 'bird.name'])
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('seenBird.bird', 'bird')
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('seenBird.profile', 'profile')
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('seenBird.id = :id', { id: 1 })
    expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
  });


  it('tests failing to find a single seenbird by id', async () => {
    mockQueryBuilder.getOne.mockRejectedValue(new NotFoundException)

    await expect(service.findOne(1))
      .rejects.toThrow(NotFoundException);
  });


  it('tests finding all seenbirds in a profile', async () => {
    const mockSeenBirds = [
      { id: 1, bird: { id: 21, name: 'American Crow' } },
      { id: 2, bird: { id: 10, name: 'European Starling' } },
      { id: 3, bird: { id: 21, name: 'American Crow' } },
    ];

    const expectedBirdCounts = [
      { name: 'American Crow', count: 2 },
      { name: 'European Starling', count: 1 },
    ];

    const expectedResult = {
      seenBirds: mockSeenBirds,
      birdCounts: expectedBirdCounts,
    };

    mockQueryBuilder.getMany.mockResolvedValue(mockSeenBirds)

    const result = await service.findAllProfile(1)
    expect(result).toEqual(expectedResult)

    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalledWith('seenBird');
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(['bird.id', 'bird.name']);
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('seenBird.bird', 'bird');
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('seenBird.profile', 'profile');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('profile.id = :profileId', { profileId: 1 });
    expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
  });

  it('tests failing to find all seenbirds on a profile', async () => {
    mockQueryBuilder.getMany.mockRejectedValue(new NotFoundException)

    await expect(service.findAllProfile(1))
      .rejects.toThrow(NotFoundException);
  });


  it('tests finding all seenbirds', async () => {
    const seenBirds = [
      { id: 1, bird: { id: 21 } },
      { id: 2, bird: { id: 10 } },
      { id: 3, bird: { id: 21 } },
    ]
    mockQueryBuilder.getMany.mockResolvedValue(seenBirds)

    const result = await service.findAll()
    expect(result).toEqual(seenBirds)

    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalledWith('seenBird')
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(['bird.id', 'bird.name', 'profile.id'])
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('seenBird.bird', 'bird')
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('seenBird.profile', 'profile')
    expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
  });


  it('tests creating seenbirds after removal from wishlist', async () => {
    const profileId = 1;
    const createDto = { bird: 21, date: new Date() };
    const wishlistedDate = new Date();
    const wishlistBird = {
      id: 1,
      count: 1,
      date: wishlistedDate,
      bird: 21
    };
    mockWishlistService.findBird.mockResolvedValueOnce(wishlistBird);

    const mockInsertResult = { raw: [], affected: 1 };
    mockQueryBuilder.execute.mockResolvedValue(mockInsertResult);

    const expectedInsertValues = {
      bird: 21,
      date: createDto.date,
      wishlistedDate: wishlistedDate,
      profile: { id: profileId }
    };

    mockSeenBirdsRepository.findAllProfile.mockResolvedValue({ seenBirds: [] })

    const result = await service.create(profileId, createDto);

    expect(result).toEqual(mockInsertResult);
    expect(mockWishlistService.findBird).toHaveBeenCalledWith(profileId, 21);
    expect(mockQueryBuilder.values).toHaveBeenCalledWith(expectedInsertValues);
    expect(mockWishlistService.delete).toHaveBeenCalledWith(wishlistBird.id);
    expect(mockWishlistService.updateCount).not.toHaveBeenCalled();
  });


  it('tests updating a seenbird', async () => {
    const id = 1
    const updateDto = { id: 1, bird: 21 };

    const mockUpdateResult = { raw: [], affected: 1 };

    mockQueryBuilder.execute.mockResolvedValue(mockUpdateResult);

    const result = await service.update(id, updateDto);

    expect(result).toEqual(mockUpdateResult);
    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.update).toHaveBeenCalledWith(SeenBird);
    expect(mockQueryBuilder.set).toHaveBeenCalledWith(updateDto);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
  });

  it('tests failing to find a seenbird id while updating a seenbird', async () => {
    const id = 999;
    const updateDto = { bird: 21 }

    const mockFailedUpdateResult = { raw: [], affected: 0 }

    mockQueryBuilder.execute.mockResolvedValue(mockFailedUpdateResult)

    await expect(service.update(id, updateDto))
      .rejects.toThrow(NotFoundException)

    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.update).toHaveBeenCalledWith(SeenBird);
    expect(mockQueryBuilder.set).toHaveBeenCalledWith(updateDto);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
  });


  it('tests deleting a seenbird', async () => {
    const id = 1
    const mockUpdateResult = { raw: [], affected: 1 };

    mockQueryBuilder.execute.mockResolvedValue(mockUpdateResult);

    const result = await service.delete(id);

    expect(result).toEqual(mockUpdateResult);
    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.delete).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalledWith(SeenBird);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
  });


  it('tests failing to find a seenbird id while updating a seenbird', async () => {
    const id = 99;

    const mockFailedDelete = { raw: [], affected: 0 }

    mockQueryBuilder.execute.mockResolvedValue(mockFailedDelete)

    await expect(service.delete(id))
      .rejects.toThrow(NotFoundException)

    expect(mockSeenBirdsRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.delete).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalledWith(SeenBird);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
  })
});
