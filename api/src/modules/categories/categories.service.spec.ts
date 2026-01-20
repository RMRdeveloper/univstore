import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Types } from 'mongoose';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  const mockCategoriesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    findRootCategories: jest.fn(),
    findChildren: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsBySlug: jest.fn(),
    hasChildren: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category with a unique slug if no duplicate exists', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
        order: 1,
      };

      mockCategoriesRepository.existsBySlug.mockResolvedValue(false);
      mockCategoriesRepository.create.mockImplementation((dto) => ({ ...dto, _id: 'new-id' }));

      await service.create(createDto);

      expect(mockCategoriesRepository.existsBySlug).toHaveBeenCalledWith('test-category', undefined);
      expect(mockCategoriesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'test-category',
        }),
      );
    });

    it('should append a unique suffix if slug already exists', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
        order: 1,
      };

      mockCategoriesRepository.existsBySlug.mockResolvedValueOnce(true);
      mockCategoriesRepository.create.mockImplementation((dto) => ({ ...dto, _id: 'new-id' }));

      await service.create(createDto);

      expect(mockCategoriesRepository.existsBySlug).toHaveBeenCalledWith('test-category', undefined);
      const createdSlug = mockCategoriesRepository.create.mock.calls[0][0].slug;
      expect(createdSlug).toMatch(/^test-category-[a-f0-9]+$/);
    });
  });

  describe('update', () => {
    it('should update slug with unique suffix if name changes and collision occurs', async () => {
      const id = new Types.ObjectId();
      const updateDto = { name: 'New Name' };

      mockCategoriesRepository.existsBySlug.mockResolvedValueOnce(true);
      mockCategoriesRepository.update.mockImplementation((id, dto) => ({ _id: id, ...dto }));

      await service.update(id, updateDto);

      expect(mockCategoriesRepository.existsBySlug).toHaveBeenCalledWith('new-name', id);
      const updatedSlug = mockCategoriesRepository.update.mock.calls[0][1].slug;
      expect(updatedSlug).toMatch(/^new-name-[a-f0-9]+$/);
    });
  });
});
