import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { MockType } from '../profile/profile.service.spec';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { profile } from 'console';
import { mockQueryBuilder } from '../../test/testMocks';

export const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  exists: jest.fn().mockResolvedValue(true),
  hasProfile: jest.fn().mockResolvedValue(false),
  linkProfile: jest.fn().mockResolvedValue(undefined),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};


describe('UserService', () => {
  let service: UserService;
  let userRepository: MockType<Repository<User>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User))
  });

  it('returns a user by id', async () => {
    const profile = {id: 1, username: "ksterling221", region: "Massachusetts", favorite: "American Crow", user: 2}
    mockQueryBuilder.getOne.mockResolvedValue(profile)

    const result = await service.findOne(1)
    expect(result).toEqual(profile)
    expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user')
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :id', { id: 1 })
  });

  it('returns all users', async () => {
    const users = [
      {id: 1, email: "kster@gmail.com"},
      {id: 3, email: "asterling@gmail.com"},
      {id: 4, email: "jsterling12@gmail.com"},
    ]

    userRepository.find?.mockResolvedValue(users); 

    const result = await service.findAll();
    
    expect(result).toEqual(users);
    expect(userRepository.find).toHaveBeenCalledWith();
  })

  
  it('should create a profile', async () => {
    const user = { email:'kster@gmail.com', firstName: 'kyle', lastName: 'sterling', password: 'kfjei92923' };
    const created = { id: 1, ...user };
    userRepository.save?.mockResolvedValue(created);

    const result = await service.create(user);

    expect(result).toEqual(created);
    expect(userRepository.save).toHaveBeenCalledWith(user);
    expect(userRepository.save).toHaveBeenCalledTimes(1)
  });


  ////
  it('should update an existing profile', async () => {
    const user = { email:'kster@gmail.com', firstName: 'kyle', lastName: 'sterling', password: 'kfjei92923' };
    const mockUpdate = {raw: [], affected: 1}

    userRepository.update?.mockResolvedValue(mockUpdate)

    const result = await service.update(1, user)
    expect(result).toEqual(mockUpdate)
    expect(userRepository.update).toHaveBeenCalledWith(1, user);
  })


  ////
  it('should delete an existing profile', async () => {
    const mockUpdate = {raw: [], affected: 1}

    userRepository.delete?.mockResolvedValue(mockUpdate)

    const result = await service.delete(1)
    expect(userRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUpdate)
  })


});
