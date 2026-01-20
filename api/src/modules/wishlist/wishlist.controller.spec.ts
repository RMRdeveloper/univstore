import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { Types } from 'mongoose';

describe('WishlistController', () => {
  let controller: WishlistController;
  let service: WishlistService;

  const mockWishlistService = {
    getWishlist: jest.fn(),
    addProduct: jest.fn(),
    removeProduct: jest.fn(),
  };

  const mockUser = {
    sub: new Types.ObjectId(),
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: mockWishlistService,
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWishlist', () => {
    it('should return the wishlist for the user', async () => {
      const result = { user: mockUser.sub, products: [] };
      mockWishlistService.getWishlist.mockResolvedValue(result);

      expect(await controller.getWishlist(mockUser as any)).toBe(result);
      expect(mockWishlistService.getWishlist).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('addProduct', () => {
    it('should add a product to the wishlist', async () => {
      const productId = new Types.ObjectId();
      const result = { user: mockUser.sub, products: [productId] };
      mockWishlistService.addProduct.mockResolvedValue(result);

      expect(await controller.addProduct(mockUser as any, productId)).toBe(result);
      expect(mockWishlistService.addProduct).toHaveBeenCalledWith(
        mockUser.sub,
        productId,
      );
    });
  });

  describe('removeProduct', () => {
    it('should remove a product from the wishlist', async () => {
      const productId = new Types.ObjectId();
      const result = { user: mockUser.sub, products: [] };
      mockWishlistService.removeProduct.mockResolvedValue(result);

      expect(await controller.removeProduct(mockUser as any, productId)).toBe(result);
      expect(mockWishlistService.removeProduct).toHaveBeenCalledWith(
        mockUser.sub,
        productId,
      );
    });
  });
});
