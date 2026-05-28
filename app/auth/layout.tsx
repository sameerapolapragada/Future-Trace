import Image from 'next/image'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <header className="mb-10 flex w-full flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
            <Image
              src="/icon-192x192.png"
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">
            AI Career Shield
          </h1>
        </header>

        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
