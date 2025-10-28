import { Test, TestingModule } from '@nestjs/testing';
import { SeenbirdsController } from './seenbirds.controller';
import { ProfileService } from '../profile/profile.service';
import { MockType } from '../profile/profile.service.spec';
import { SeenbirdsService } from './seenbirds.service';
import { SeenBird } from 'src/entities/seenBird.entity';
import { Bird } from 'src/entities/bird.entity';


describe('SeenbirdsController', () => {
  let controller: SeenbirdsController;									
  let seenbirdsService: MockType<ProfileService>;
  
  const mockSeenbirdsService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAllProfile: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockQueryBuilder = {
    getMany: jest.fn(),
  }

 

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [SeenbirdsController],
      providers: [
        {
          provide: SeenbirdsService,
          useValue: mockSeenbirdsService,
        },
      ],
    }).compile();

    controller = module.get<SeenbirdsController>(SeenbirdsController);
    seenbirdsService = module.get(SeenbirdsService);
  });

  it('tests finding a single seenbird by id', async () => {
    const seenBird = { id: 1, bird: 'American Crow' };
    mockSeenbirdsService.findOne.mockResolvedValue(seenBird);

    const result = await controller.findOne(1);

    expect(result).toEqual(seenBird);
    expect(mockSeenbirdsService.findOne).toHaveBeenCalledWith(1);
  });


  it('tests finding all seenbirds in a profile', async () => {
    const seenBirds = [
      {id: 1, bird: {id: 10, name: "European Starling"}},
    ]

    mockSeenbirdsService.findAllProfile.mockResolvedValue(seenBirds);

    const result = await controller.findAllProfile(1);

    expect(result).toEqual(seenBirds);
    expect(mockSeenbirdsService.findAllProfile).toHaveBeenCalled();
  });


  it('tests finding all seenbirds', async () => {
    const seenBirds = [
      {id: 1, bird: {id: 10, name: "European Starling"}},
    ]

    seenbirdsService.findAll?.mockResolvedValue(seenBirds);

    const result = await controller.findAll();

    expect(result).toEqual(seenBirds);
    expect(seenbirdsService.findAll).toHaveBeenCalledWith();
  });


  it('tests creating seenbirds', async () => {
    const seenBird = { bird: 21 };
    const created = { id: 1, bird: 21 };
    seenbirdsService.create?.mockResolvedValue(created);

    const result = await controller.create(1, seenBird);

    expect(result).toEqual(created);
    expect(seenbirdsService.create).toHaveBeenCalledWith(1, seenBird);
  });


  it('tests updating a seenbird', async () => {
    const seenBird = { bird: 21 };
    const mockUpdate = {raw: [], affected: 1}

    seenbirdsService.update?.mockResolvedValue(mockUpdate)

    const result = await controller.update(1, seenBird)
    expect(result).toEqual(mockUpdate)
    expect(seenbirdsService.update).toHaveBeenCalledWith(1, seenBird);
  });


  it('tests deleting a seenbird', async () => {
    const mockUpdate = {raw: [], affected: 1}

    seenbirdsService.delete?.mockResolvedValue(mockUpdate)

    const result = await controller.delete(1)
    expect(seenbirdsService.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUpdate)
  });
});
