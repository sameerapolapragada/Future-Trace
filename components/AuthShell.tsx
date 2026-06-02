'use client'

import BrandLogo from '@/components/BrandLogo'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-trace-bg text-trace-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="mb-10 flex w-full flex-col items-center text-center transition hover:opacity-90"
        >
          <div className="mb-5 flex h-44 w-44 animate-auth-logo-enter items-center justify-center opacity-0 sm:h-52 sm:w-52">
            <BrandLogo size={208} className="h-full w-full" priority />
          </div>
          <h1 className="animate-auth-fade-up text-2xl font-bold tracking-tight text-slate-50 opacity-0 [animation-delay:200ms]">
            Future Trace
          </h1>
        </Link>

        <div className="w-full animate-auth-fade-up opacity-0 [animation-delay:380ms]">{children}</div>
      </div>
    </div>
  )
}
