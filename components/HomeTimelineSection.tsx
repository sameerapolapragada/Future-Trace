import HomeAboutSection from '@/components/HomeAboutSection'
import HomeLearnMoreButton from '@/components/home/HomeLearnMoreButton'
import HomeStats from '@/components/HomeStats'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HomeTimelineSection() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/auth"
          className="btn-primary inline-flex items-center gap-1 px-5 py-2.5"
        >
          Get Your Analysis
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
        <HomeLearnMoreButton />
      </div>
      <HomeStats />
      <HomeAboutSection />
    </>
  )
}
