import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '../page';
import { productsService, categoriesService } from '@/services';

// Mock the services
jest.mock('@/services', () => ({
  productsService: {
    getAll: jest.fn(),
  },
  categoriesService: {
    getAll: jest.fn(),
  },
}));

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders stats with correct dark mode classes', async () => {
    (productsService.getAll as jest.Mock).mockResolvedValue({ total: 100, data: [] });
    (categoriesService.getAll as jest.Mock).mockResolvedValue([{}, {}, {}]); // 3 categories

    render(<AdminDashboardPage />);

    // Wait for the loading state to finish (Total Productos value appearing)
    // We use findByText which waits automatically (default 1000ms)
    const totalValue = await screen.findByText('100');
    expect(totalValue).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();

    // Verify Dark Mode Classes
    const totalLabel = screen.getByText('Total Productos');
    expect(totalLabel).toHaveClass('dark:text-gray-400');

    expect(totalValue).toHaveClass('dark:text-gray-50');
  });

  it('handles errors gracefully', async () => {
    (productsService.getAll as jest.Mock).mockRejectedValue(new Error('Failed path'));
    (categoriesService.getAll as jest.Mock).mockResolvedValue([]);

    render(<AdminDashboardPage />);

    // Should render the labels. We wait for one of them to be sure render loop is done.
    await screen.findByText('Total Productos');

    // We might have multiple '0' if initial state is 0 for multiple cards.
    // Use getAllByText and check if at least one exists, or check specific card.
    // However, the initial state is 0, so even before error it might show 0 if not loading?
    // The code shows '...' while isLoading.
    // In catch block, we log error but don't reset isLoading to false? 
    // Wait, finally block does setIsLoading(false).
    // So distinct values should be 0.

    // Wait for loading to finish (indicated by 0 appearing instead of ...)
    const zeros = await screen.findAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });
});
