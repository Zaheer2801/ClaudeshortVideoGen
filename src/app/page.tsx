import { redirect } from 'next/navigation';

export default function RootPage() {
  // middleware.ts sends signed-out/unapproved users to /login or /pending;
  // anyone who reaches here for real is approved, so send them straight in.
  redirect('/dashboard');
}
