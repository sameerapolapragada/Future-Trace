import Link from 'next/link'

export default function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">AI Evolution Timeline</h1>
          <p className="text-sm text-slate-600">A concise, educational walkthrough of how AI has progressed.</p>
        </div>
        <nav>
          <Link href="#timeline" className="text-sm text-sky-600 hover:underline">
            Explore timeline
          </Link>
        </nav>
      </div>
    </header>
  )
}
