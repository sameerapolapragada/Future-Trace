import { redirect } from 'next/navigation'

type SignInRedirectPageProps = {
  searchParams: { redirectTo?: string }
}

export default function SignInRedirectPage({ searchParams }: SignInRedirectPageProps) {
  const query = searchParams.redirectTo
    ? `?redirectTo=${encodeURIComponent(searchParams.redirectTo)}`
    : ''
  redirect(`/auth${query}`)
}
