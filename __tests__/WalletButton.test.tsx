/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import WalletButton from '@/components/WalletButton';

jest.mock('@/hooks/useWallet', () => ({
  __esModule: true,
  default: () => ({
    address: '0x1234567890abcdef1234567890abcdef12345678',
    connectWallet: jest.fn(),
    disconnectWallet: jest.fn(),
    network: 'sepolia'
  })
}));

describe('WalletButton', () => {
  it('renders disconnect button when wallet is connected', () => {
    render(<WalletButton />);
    expect(screen.getByText(/Disconnect/i)).toBeInTheDocument();
    expect(screen.getByText(/sepolia/i)).toBeInTheDocument();
  });
});
