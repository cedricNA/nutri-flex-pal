import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  it('renders text depending on theme', () => {
    render(<ThemeToggle isDark={false} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Activer le mode sombre' })).toBeInTheDocument();
    expect(screen.getByText('Mode sombre')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle isDark={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalled();
  });
});
