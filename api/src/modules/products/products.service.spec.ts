import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Types } from 'mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  const mockProductsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    findByCategory: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsBySlug: jest.fn(),
    existsBySku: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product with a unique slug if no duplicate exists', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        sku: 'SKU-123',
        category: new Types.ObjectId().toString(),
        stock: 10,
        images: [],
        compareAtPrice: 0,
        tags: [],
      };

      mockProductsRepository.existsBySlug.mockResolvedValue(false); // No duplicate slug
      mockProductsRepository.existsBySku.mockResolvedValue(false);
      mockProductsRepository.create.mockImplementation((dto) => ({ ...dto, _id: 'new-id' }));

      const result = await service.create(createDto);

      expect(mockProductsRepository.existsBySlug).toHaveBeenCalledWith('test-product', undefined);
      expect(mockProductsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'test-product',
        }),
      );
    });

    it('should append a unique suffix if slug already exists', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        sku: 'SKU-123',
        category: new Types.ObjectId().toString(),
        stock: 10,
        images: [],
        compareAtPrice: 0,
        tags: [],
      };

      // First call returns true (exists), implying we need a suffix
      mockProductsRepository.existsBySlug.mockResolvedValueOnce(true);
      // We don't loop check in the implementation, we just append suffix. 
      // The implementation checks once, if exists -> append suffix. It doesn't check again (assuming UUID is unique).

      mockProductsRepository.existsBySku.mockResolvedValue(false);
      mockProductsRepository.create.mockImplementation((dto) => ({ ...dto, _id: 'new-id' }));

      const result = await service.create(createDto);

      // It should have called existsBySlug with the base slug
      expect(mockProductsRepository.existsBySlug).toHaveBeenCalledWith('test-product', undefined);

      // The created slug should contain 'test-product-'
      const createdSlug = mockProductsRepository.create.mock.calls[0][0].slug;
      expect(createdSlug).toMatch(/^test-product-[a-f0-9]+$/);
      // expect(createdSlug).not.toBe('test-product'); 
    });
  });

  describe('update', () => {
    it('should update slug with unique suffix if name changes and collision occurs', async () => {
      const id = new Types.ObjectId();
      const updateDto = { name: 'New Name' };

      mockProductsRepository.existsBySlug.mockResolvedValueOnce(true); // Collision
      mockProductsRepository.update.mockImplementation((id, dto) => ({ _id: id, ...dto }));

      await service.update(id, updateDto);

      expect(mockProductsRepository.existsBySlug).toHaveBeenCalledWith('new-name', id);
      const updatedSlug = mockProductsRepository.update.mock.calls[0][1].slug;
      expect(updatedSlug).toMatch(/^new-name-[a-f0-9]+$/);
    });
  });
});
