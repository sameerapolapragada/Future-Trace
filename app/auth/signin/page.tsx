import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-2xl font-bold text-slate-100">Sign in</h1>
      <p className="mt-2 text-sm text-slate-400">
        Authentication UI will connect to Supabase here. Protected routes require an active
        session.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-sky-400 hover:text-sky-300"
      >
        Back to home
      </Link>
    </div>
  )
}
