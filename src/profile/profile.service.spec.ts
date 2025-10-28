import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { profile } from 'console';
import { mockQueryBuilder } from '../../test/testMocks';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

const mockProfileRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
}

const mockUserService = {
  exists: jest.fn().mockResolvedValue(true),
  hasProfile: jest.fn().mockResolvedValue(false),
  linkProfile: jest.fn().mockResolvedValue(undefined),
  unlinkProfile: jest.fn().mockResolvedValue(undefined),
}


describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: MockType<Repository<Profile>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository
        },
        {
          provide: UserService,
          useValue: mockUserService
        }
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(getRepositoryToken(Profile))
  });


  //////////
  it('returns a user by id', async () => {
    const profile = {id: 1, username: "ksterling221", region: "Massachusetts", favorite: "American Crow", user: 2}
    mockQueryBuilder.getOne.mockResolvedValue(profile)

    const result = await service.findOne(1)
    expect(result).toEqual(profile)
    expect(mockProfileRepository.createQueryBuilder).toHaveBeenCalledWith('profile')
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('profile.id = :id', { id: 1 })
  });


  /////////
  it('returns all user ids', async () => {
    const profiles = [
      {id: 1, username: "ksterling221", region: "Massachusetts", favorite: "American Crow"},
      {id: 3, username: "alyssasbirds", region: "New York", favorite: "Mourning Dove"},
      {id: 4, username: "jojo2000", region: "Mississippi", favorite: "Great Horned Owl"},
    ]

    profileRepository.find?.mockResolvedValue(profiles); 

    const result = await service.findAll();
    
    expect(result).toEqual(profiles);
    expect(profileRepository.find).toHaveBeenCalledWith();
  });


  /////////
  it('creates a new user', async () => {
    const userId = 4
    const userDto = {username: "gsterling42", region: "Massachusetts", favorite: "Common Loon"}
    const savedProfile = {id: 10, ...userDto, user: { id: userId }};

    profileRepository.save?.mockResolvedValue(savedProfile)

    const result = await service.create(userId, userDto);

    expect(result).toEqual(savedProfile);
    expect(mockUserService.exists).toHaveBeenCalledWith(userId);
    expect(mockUserService.hasProfile).toHaveBeenCalledWith(userId);
    expect(profileRepository.create).toHaveBeenCalledWith(userDto); 
    expect(profileRepository.save).toHaveBeenCalledTimes(1); 
    expect(mockUserService.linkProfile).toHaveBeenCalledWith(userId, savedProfile);
  });

  /////////
  it('updates a profile', async () => {
    const profileId = 4
    const dto = {username: "gsterling42"}
    // profileRepository.update?.mockResolvedValue({...dto, region: "New Hampshire"})

    const mockUpdateResult = {raw: [], affected: 1};

    profileRepository.update?.mockResolvedValue(mockUpdateResult)

    const result = await service.update(profileId, dto);
    expect(result).toEqual(mockUpdateResult); 
    expect(profileRepository.update).toHaveBeenCalledWith({ id: profileId }, dto);
  })


  /////////
  it('deletes a profile', async () => {
    const profileId = 1;
    const mockProfile = {id: 1, username: "gsterling42", region: "Massachusetts", favorite: "Common Loon"};
    const deleteResult = { raw: [], affected: 1 };

    mockQueryBuilder.getOne.mockResolvedValue(mockProfile);
    profileRepository.delete?.mockResolvedValue(deleteResult);

    const result = await service.delete(profileId);

    expect(mockProfileRepository.createQueryBuilder).toHaveBeenCalledWith('profile');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('profile.id = :id', { id: 1 });
    expect(mockUserService.unlinkProfile).toHaveBeenCalledWith(mockProfile);
    expect(profileRepository.delete).toHaveBeenCalledWith(profileId);
    expect(result).toEqual(deleteResult);

  })
});