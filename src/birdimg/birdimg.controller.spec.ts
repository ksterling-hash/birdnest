import { Test } from '@nestjs/testing';
import { BirdImgController } from './birdimg.controller';
import { BirdImgService } from './birdimg.service';
import { MockType } from '../profile/profile.service.spec';
import { mock } from 'node:test';

describe('BirdImgController', () => {
  let controller: BirdImgController						
  let birdImgService: MockType<BirdImgService>;
  
  const mockBirdImgService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BirdImgController],
      providers: [
        {
          provide: BirdImgService,
          useValue: mockBirdImgService,
        },
      ],
    }).compile()

    controller = module.get<BirdImgController>(BirdImgController)
    birdImgService = module.get(BirdImgService)
  });

  it('should return bird images by ID', async () => {
    const img = { id: 1, path: 'src/uploads/' }
    mockBirdImgService.findOne.mockResolvedValue(img)

    const result = await controller.findOne(1)

    expect(result).toEqual(img)
    expect(mockBirdImgService.findOne).toHaveBeenCalledWith(1)
  });


  //
  it('should return all bird images', async () => {
    const imgs = [
      { id: 1, path: 'src/uploads/' },
    ]

    mockBirdImgService.findAll.mockResolvedValue(imgs)

    const result = await controller.findAll()

    expect(result).toEqual(imgs)
    expect(mockBirdImgService.findAll).toHaveBeenCalledWith()
  });


  ////
  it('uploads a new bird image and creates a path in the database', async () => {
    const path = 'uploads\\bird-images\\file-1761241653510-515368235.png'
    const mockImg = { path: path } as Express.Multer.File
    const created = { id: 1, path: path }

    mockBirdImgService.create.mockResolvedValue(created)

    const result = await controller.create(1, 2, mockImg)

    expect(result).toEqual(created)
    expect(mockBirdImgService.create).toHaveBeenCalledWith(1, 2, mockImg)
  });


  ////
  it('updates an existing image dto', async () => {
    const path = 'uploads\\bird-images\\file-1761241653510-515368235.png'
    const img = { id: 1, path: path }
    const mockUpdate = {raw: [], affected: 1}

    mockBirdImgService.update.mockResolvedValue(mockUpdate)

    const result = await controller.update(1, img)

    expect(result).toEqual(mockUpdate)
    expect(mockBirdImgService.update).toHaveBeenCalledWith(1, img)
  })


  ////
  it('deletes an img from the database', async () => {
    const mockUpdate = {raw: [], affected: 1}

    mockBirdImgService.delete.mockResolvedValue(mockUpdate)

    const result = await controller.delete(1)
    expect(mockBirdImgService.delete).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockUpdate)
  })
});