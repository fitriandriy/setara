import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoSaldo from '../../../../components/Homepage/InfoSaldo';
import { useAuth } from '../../../../hooks/useAuth';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { notification } from 'antd';

// Mock the useAuth hook
jest.mock('../../../../hooks/useAuth');

// Mock axios
jest.mock('axios');

// Mock the antd notification module
jest.mock('antd', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Skeleton: () => <div>Mocked Skeleton</div>,
}));

describe('InfoSaldo Component', () => {
  const mockUser = {
    token: 'test-token',
    user: {
      account_number: '1234567890',
      image_path: '/images/user.png',
    },
  };

  // Set up the mock return value for useAuth
  (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

  it('renders the component correctly', async () => {
    // Mock the API response
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: {
          balance: 10000,
        },
      },
    });

    render(<InfoSaldo />, { wrapper: MemoryRouter });

    // Wait for the loading to finish
    await waitFor(() => {
      expect(screen.getByLabelText('Informasi Saldo Rekening')).toBeInTheDocument();
    });
    
    const copyIcon = screen.getByLabelText('Salin nomer rekening');
    expect(copyIcon).toBeInTheDocument();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(true),
      },
    });


    expect(screen.getByLabelText("Saldo ditampilkan")).toBeInTheDocument();
  
    fireEvent.click(screen.getByRole('button', { name: 'Saldo ditampilkan' }));
    fireEvent.click(screen.getByRole('button', { name: 'Saldo disembunyikan' }));
    fireEvent.click(copyIcon);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockUser.user.account_number);
      expect(notification.success).toHaveBeenCalledTimes(1);
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Success',
        description: 'No. Rekening berhasil disalin',
        duration: 2,
      });
    });
  });
});