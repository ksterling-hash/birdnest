import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { MockType } from '../profile/profile.service.spec';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: MockType<UserService>;
  
  const mockUserService = {
    findOne: jest.fn()/*.mockResolvedValue({ id: 1, username: 'ksterling221' })*/,
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });


  ////
  it('should return user by ID', async () => {
    const user = { id: 1, email: 'kster@gmail.com' };
    userService.findOne?.mockResolvedValue(user);

    const result = await controller.findOne(1);

    expect(result).toEqual(user);
    expect(userService.findOne).toHaveBeenCalledWith(1);
  });


  ////
  it('should return all users', async () => {
    const users = [
      {id: 1, email: "kster@gmail.com"},
      {id: 3, email: "asterling@gmail.com"},
      {id: 4, email: "jsterling12@gmail.com"},
    ]

    userService.findAll?.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(result).toEqual(users);
    expect(userService.findAll).toHaveBeenCalledWith();
  });


  ////
  it('should create a profile', async () => {
    const user = { email:'kster@gmail.com', firstName: 'kyle', lastName: 'sterling', password: 'kfjei92923' };
    const created = { id: 1, email:'kster@gmail.com', firstName: 'kyle', lastName: 'sterling', password: 'kfjei92923' };
    userService.create?.mockResolvedValue(created);

    const result = await controller.create(user);

    expect(result).toEqual(created);
    expect(userService.create).toHaveBeenCalledWith(user);
  });


  ////
  it('should update an existing profile', async () => {
    const user = { email:'kster@gmail.com', firstName: 'kyle', lastName: 'sterling', password: 'kfjei92923' };
    const mockUpdate = {raw: [], affected: 1}

    userService.update?.mockResolvedValue(mockUpdate)

    const result = await controller.update(1, user)
    expect(result).toEqual(mockUpdate)
    expect(userService.update).toHaveBeenCalledWith(1, user);
  })


  ////
  it('should delete an existing profile', async () => {
    const mockUpdate = {raw: [], affected: 1}

    userService.delete?.mockResolvedValue(mockUpdate)

    const result = await controller.delete(1)
    expect(userService.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUpdate)
  })
});