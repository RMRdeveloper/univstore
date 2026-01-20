import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { WishlistRepository } from './wishlist.repository';
import { ProductsService } from '../products/products.service';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let repository: WishlistRepository;
  let productsService: ProductsService;

  const mockWishlistRepository = {
    findByUser: jest.fn(),
    addProduct: jest.fn(),
    removeProduct: jest.fn(),
    hasProduct: jest.fn(),
  };

  const mockProductsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: WishlistRepository,
          useValue: mockWishlistRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    repository = module.get<WishlistRepository>(WishlistRepository);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWishlist', () => {
    it('should return the wishlist', async () => {
      const userId = new Types.ObjectId();
      const result = { user: userId, products: [] };
      mockWishlistRepository.findByUser.mockResolvedValue(result);

      expect(await service.getWishlist(userId)).toBe(result);
      expect(mockWishlistRepository.findByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('addProduct', () => {
    it('should add a product if it exists', async () => {
      const userId = new Types.ObjectId();
      const productId = new Types.ObjectId();
      const result = { user: userId, products: [productId] };

      mockProductsService.findById.mockResolvedValue({ _id: productId });
      mockWishlistRepository.addProduct.mockResolvedValue(result);

      expect(await service.addProduct(userId, productId)).toBe(result);
      expect(mockProductsService.findById).toHaveBeenCalledWith(productId);
      expect(mockWishlistRepository.addProduct).toHaveBeenCalledWith(userId, productId);
    });

    it('should throw if product does not exist', async () => {
      const userId = new Types.ObjectId();
      const productId = new Types.ObjectId();
      mockProductsService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.addProduct(userId, productId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProduct', () => {
    it('should remove a product', async () => {
      const userId = new Types.ObjectId();
      const productId = new Types.ObjectId();
      const result = { user: userId, products: [] };

      mockWishlistRepository.removeProduct.mockResolvedValue(result);

      expect(await service.removeProduct(userId, productId)).toBe(result);
      expect(mockWishlistRepository.removeProduct).toHaveBeenCalledWith(userId, productId);
    });

    it('should throw if wishlist not found', async () => {
      const userId = new Types.ObjectId();
      const productId = new Types.ObjectId();

      mockWishlistRepository.removeProduct.mockResolvedValue(null);

      await expect(service.removeProduct(userId, productId)).rejects.toThrow(NotFoundException);
    });
  });
});
