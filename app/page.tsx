import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from '../components/LoginForm/LoginForm';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../lib/guest-session';

export default async function HomePage() {
  const token = (await cookies()).get(GUEST_SESSION_COOKIE)?.value;
  if (await verifyGuestSession(token)) {
    redirect('/dashboard');
  }

  return <LoginForm password={process.env.GUEST_PASSWORD ?? ''} />;
}
