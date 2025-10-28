import { Test } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { MockType } from './profile.service.spec';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController						
  let profileService: MockType<ProfileService>;
	
  const mockProfileService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile()

    controller = module.get<ProfileController>(ProfileController)
    profileService = module.get(ProfileService)
  });

  it('should return profile by ID', async () => {
    const profile = { id: 1, username: 'ksterling221' }
    profileService.findOne?.mockResolvedValue(profile)

    const result = await controller.findOne(1)

    expect(result).toEqual(profile)
    expect(profileService.findOne).toHaveBeenCalledWith(1)
  });


  ////
  it('should return all profiles', async () => {
    const profiles = [
      {id: 1, username: "ksterling221"},
      {id: 3, username: "alyssasbirds"},
      {id: 4, username: "jojo2000"},
    ]

    profileService.findAll?.mockResolvedValue(profiles)

    const result = await controller.findAll()

    expect(result).toEqual(profiles)
    expect(profileService.findAll).toHaveBeenCalledWith()
  });


  ////
  it('should create a profile', async () => {
    const profile = { username: 'ksterling221', region: 'Massachusetts', favorite: 'Grey Catbird' }
    const created = { id: 1, username: 'ksterling221', region: 'Massachusetts', favorite: 'Grey Catbird' }
    profileService.create?.mockResolvedValue(created)

    const result = await controller.create(1, profile)

    expect(result).toEqual(created)
    expect(profileService.create).toHaveBeenCalledWith(1, profile)
  });


  ////
  it('should update an existing profile', async () => {
    const profile = { username: 'ksterling221', region: 'Massachusetts', favorite: 'Grey Catbird' }
    const mockUpdate = {raw: [], affected: 1}

    profileService.update?.mockResolvedValue(mockUpdate)

    const result = await controller.update(1, profile)
    expect(result).toEqual(mockUpdate)
    expect(profileService.update).toHaveBeenCalledWith(1, profile)
  })


  ////
  it('should delete an existing profile', async () => {
    const mockUpdate = {raw: [], affected: 1}

    profileService.delete?.mockResolvedValue(mockUpdate)

    const result = await controller.delete(1)
    expect(profileService.delete).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockUpdate)
  })


});


