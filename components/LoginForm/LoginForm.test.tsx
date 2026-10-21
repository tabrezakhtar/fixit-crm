import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import { login } from '../../app/actions/auth';
import { LoginForm } from './LoginForm';

jest.mock('../../app/actions/auth', () => ({ login: jest.fn() }));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(login).mockResolvedValue(null);
  });

  it('shows the demo sign-in form', () => {
    render(<LoginForm password="demo-secret" />);

    expect(screen.getByRole('heading', { name: 'Welcome to FixitCRM' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Explore Demo' })).toBeInTheDocument();
  });

  it('submits the guest credentials through the login action', async () => {
    const user = userEvent.setup();
    render(<LoginForm password="demo-secret" />);

    await user.click(screen.getByRole('button', { name: 'Explore Demo' }));

    expect(login).toHaveBeenCalledTimes(1);
    const submittedData = jest.mocked(login).mock.calls[0][1];
    expect(submittedData.get('username')).toBe('guest');
    expect(submittedData.get('password')).toBe('demo-secret');
  });

  it('shows the error returned by the login action', async () => {
    const user = userEvent.setup();
    jest.mocked(login).mockResolvedValue({ error: 'Sign-in failed.' });
    render(<LoginForm password="demo-secret" />);

    await user.click(screen.getByRole('button', { name: 'Explore Demo' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Sign-in failed.');
  });
});
