import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { BirdImgService } from './birdimg.service';
import { MockType } from '../profile/profile.service.spec';
import { BirdImg } from '../entities/birdimg.entity';
import { mockQueryBuilder } from '../../test/testMocks';


const mockBirdImgRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  addSeenbirdToImage: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
}


describe('BirdImgService', () => {
  let service: BirdImgService;
  let birdImgRepository: MockType<Repository<Profile>>

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdImgService,
        {
          provide: getRepositoryToken(BirdImg),
          useValue: mockBirdImgRepository
        },
      ],
    }).compile();

    service = module.get<BirdImgService>(BirdImgService);
    birdImgRepository = module.get(getRepositoryToken(BirdImg))
  });


  ////////
  it('returns an image by id', async () => {
    const img = { id: 1, filename: "birdnest.png" }
    mockQueryBuilder.getOne.mockResolvedValue(img)

    const result = await service.findOne(1)
    expect(result).toEqual(img)
    expect(mockBirdImgRepository.createQueryBuilder).toHaveBeenCalledWith('birdImg')
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('birdImg.id = :id', { id: 1 })
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(['seenbird.id'])
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('birdImg.seenbird', 'seenbird')
    expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1)
  });

  it('returns all image ids', async () => {
    const imgs = [
      { id: 1, filename: 'birdnest.png' }
    ]

    mockQueryBuilder.getMany.mockResolvedValue(imgs); 

    const result = await service.findAll();
    
    expect(result).toEqual(imgs);
    expect(mockBirdImgRepository.createQueryBuilder).toHaveBeenCalled()
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(['seenbird.id']);
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('birdImg.seenbird', 'seenbird');
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(['profile.id']);
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('birdImg.profile', 'profile');
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
  });


  it('tests finding all birds images in a profile', async () => {
  const mockSeenBirds = [
    { id: 1, filename: 'birdnest.png' } 
  ]

  mockQueryBuilder.getMany.mockResolvedValue(mockSeenBirds)

  const result = await service.findAllProfile(1)
  expect(result).toEqual(mockSeenBirds)

  expect(mockBirdImgRepository.createQueryBuilder).toHaveBeenCalledWith('birdImg');
  expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('birdImg.seenbird', 'seenbird');
  expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('birdImg.profile', 'profile');
  expect(mockQueryBuilder.where).toHaveBeenCalledWith('profile.id = :profileId', { profileId: 1 });
  expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
});


  it('creates a new user', async () => {
    const path = 'uploads\\bird-images\\file-1761241653510-515368235.png'
    const mockImg = { path: path }
    const created = { id: 1, path: path, profile: { id: 1 }, seenbird: [{ id: 1 }] }

    mockBirdImgRepository.create.mockReturnValue(mockImg)
    mockBirdImgRepository.save.mockResolvedValue(created)
  
    const result = await service.create(1, 1, mockImg)

    expect(result).toEqual(created)
    expect(mockBirdImgRepository.create).toHaveBeenCalledWith(mockImg);
    expect(mockBirdImgRepository.save).toHaveBeenCalledWith({ path: path, seenbird: [{ id: 1 }], profile: { id: 1 } })
  });

  it('tests updating a bird image', async () => {
    const path = 'uploads\\bird-images\\file-1761241653510-515368235.png'
    const updateDto = { id: 1, path: path }
    const mockUpdateResult = { raw: [], affected: 1 }

    mockQueryBuilder.execute.mockResolvedValue(mockUpdateResult)

    const result = await service.update(1, updateDto)

    expect(result).toEqual(mockUpdateResult)
    expect(mockBirdImgRepository.createQueryBuilder).toHaveBeenCalled()
    expect(mockQueryBuilder.update).toHaveBeenCalledWith(BirdImg)
    expect(mockQueryBuilder.set).toHaveBeenCalledWith(updateDto)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: 1 })     
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1)
  });


  it('tests deleting a seenbird', async () => {
    const id = 1        
    const mockUpdateResult = { raw: [], affected: 1 }

    mockQueryBuilder.execute.mockResolvedValue(mockUpdateResult)

    const result = await service.delete(id)

    expect(result).toEqual(mockUpdateResult)
    expect(mockBirdImgRepository.createQueryBuilder).toHaveBeenCalled()
    expect(mockQueryBuilder.delete).toHaveBeenCalled()
    expect(mockQueryBuilder.from).toHaveBeenCalledWith(BirdImg)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id }) 
    expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1)
  });


  it('tests adding a seen bird to an image', async () => {
    mockQueryBuilder.add.mockResolvedValue(undefined)
    const result = await service.addSeenbirdToImage(1, 2)
    
    expect(result).toBeUndefined()
    expect(mockBirdImgRepository.createQueryBuilder).toHaveBeenCalled()
    expect(mockQueryBuilder.relation).toHaveBeenCalledWith(BirdImg, 'seenbird')
    expect(mockQueryBuilder.of).toHaveBeenCalledWith(2)
    expect(mockQueryBuilder.add).toHaveBeenCalledWith(1)
  });
});