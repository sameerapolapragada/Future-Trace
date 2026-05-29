import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function isAuthPath(pathname: string) {
  return pathname === '/auth' || pathname.startsWith('/auth/')
}

function isDashboardPath(pathname: string) {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
}

function applySessionCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value)
  })
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const pathname = request.nextUrl.pathname
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (user && !error && isAuthPath(pathname)) {
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
    applySessionCookies(response, redirectResponse)
    return redirectResponse
  }

  if ((error || !user) && isDashboardPath(pathname)) {
    const signInUrl = request.nextUrl.clone()
    signInUrl.pathname = '/auth'
    signInUrl.search = ''
    signInUrl.searchParams.set(
      'redirectTo',
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    )

    const redirectResponse = NextResponse.redirect(signInUrl)
    applySessionCookies(response, redirectResponse)
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/auth', '/auth/:path*'],
}
