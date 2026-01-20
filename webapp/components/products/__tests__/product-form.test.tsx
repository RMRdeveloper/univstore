import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '@/components/admin';
import { productsService, categoriesService } from '@/services';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/services', () => ({
  productsService: {
    create: jest.fn(),
    update: jest.fn(),
  },
  categoriesService: {
    getAll: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock toast behavior if used - REMOVED


describe('ProductForm', () => {
  const mockRouter = { push: jest.fn(), refresh: jest.fn(), back: jest.fn() };
  const mockCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics' },
    { id: '2', name: 'Clothing', slug: 'clothing' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (categoriesService.getAll as jest.Mock).mockResolvedValue(mockCategories);
  });

  it('renders create form correctly', async () => {
    render(<ProductForm />); // No initialData for create mode

    // Wait for categories to load
    await waitFor(() => {
      expect(categoriesService.getAll).toHaveBeenCalled();
    });

    expect(screen.getByLabelText(/Nombre del Producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SKU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio de Venta/i)).toBeInTheDocument();
    expect(screen.getByText('Publicar Producto')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ProductForm />);

    // Submit without filling fields
    const submitBtn = screen.getByText('Publicar Producto');
    fireEvent.click(submitBtn);

    // Expect validation errors (check if create was NOT called)
    await waitFor(() => {
      expect(productsService.create).not.toHaveBeenCalled();
    });
  });

  it('calls create service on valid submission', async () => {
    (productsService.create as jest.Mock).mockResolvedValue({ id: '123', name: 'New Product' });

    render(<ProductForm />);

    // Wait for data load
    await waitFor(() => expect(categoriesService.getAll).toHaveBeenCalled());

    // Fill form
    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe las características/i), { target: { value: 'Description with at least 10 chars' } });
    fireEvent.change(screen.getByLabelText(/SKU/i), { target: { value: 'SKU-123' } });
    fireEvent.change(screen.getByLabelText(/Precio de Venta/i), { target: { value: '99' } });
    fireEvent.change(screen.getByLabelText(/Stock Disponible/i), { target: { value: '10' } });

    // Select category (find select by display value or label)
    // The label is "Categoría", the select likely has role 'combobox' or just find by label
    // Note: The select in the code has explicit labels. Standard fireEvent.change should work on select.
    // However, finding the select might need to look for the combobox or implicit label.
    // The code uses: <label>Categoría</label> <select ...>
    // So getByLabelText('Categoría') should work if id matches or nested, but it wasn't nested in the code I saw perfectly.
    // Wait, lines 134-149: label is block, select is sibling? No, let's check.
    // Line 134: label. Line 138: <select value={formData.category} ...>
    // It doesn't use `id` linked to the label 'for'.
    // So `getByLabelText` might fail.
    // I will try to use `screen.getByRole('combobox')` if there is only one, or select strictly by other means.
    // Assuming there is one select for category.

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: '1' } });

    const submitBtn = screen.getByText('Publicar Producto');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(productsService.create).toHaveBeenCalled();
    });
  });

  it('renders edit form with initial data', async () => {
    const product = {
      id: '123',
      name: 'Existing Product',
      sku: 'SKU-001',
      description: 'Existing Description',
      price: 100,
      stock: 50,
      slug: 'existing-product',
      category: { id: '1', name: 'Electronics', slug: 'electronics' },
      tags: ['tag1'],
      images: [],
      isActive: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };

    render(<ProductForm initialData={product} />);

    await waitFor(() => expect(categoriesService.getAll).toHaveBeenCalled());

    expect(screen.getByDisplayValue('Existing Product')).toBeInTheDocument();
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
  });
});
