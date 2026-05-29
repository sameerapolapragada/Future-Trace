'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-black text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="mb-10 flex w-full flex-col items-center text-center transition hover:opacity-90"
        >
          <div className="mb-5 flex h-32 w-32 animate-auth-logo-enter items-center justify-center overflow-hidden rounded-2xl bg-trace-surface opacity-0 shadow-trace ring-1 ring-sky-900/40">
            <Image
              src="/icon-192x192.png"
              alt="Future Trace"
              width={112}
              height={112}
              className="h-28 w-28 object-contain"
              priority
            />
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
