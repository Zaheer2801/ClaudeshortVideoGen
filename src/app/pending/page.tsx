export default function PendingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-950 px-6 text-center text-neutral-100">
      <h1 className="text-2xl font-semibold">You&apos;re signed in — just not approved yet</h1>
      <p className="max-w-sm text-neutral-400">
        This is invite-only for now. Ask the person who invited you to approve your account, then refresh this page.
      </p>
    </main>
  );
}
