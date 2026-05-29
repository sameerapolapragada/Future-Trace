import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy & Data Governance | AI Career Shield',
  description:
    'How AI Career Shield collects, minimizes, and erases personal data under GDPR and CCPA.',
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto min-h-screen max-w-md bg-slate-950 px-6 py-8 text-slate-100">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-50">
          Privacy &amp; Data Governance
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Last updated: May 2026 · GDPR / CCPA aligned practices for AI Career Shield
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-300">
        <section aria-labelledby="data-collection-heading">
          <h2 id="data-collection-heading" className="text-lg font-semibold text-slate-100">
            Data Collection
          </h2>
          <p className="mt-3">
            When you run an AI insulation scan, we securely ingest the resume or skills summary you
            provide, along with your target job title. This text is transmitted over encrypted
            connections and processed to derive automation-risk signals and a vulnerability score.
          </p>
          <p className="mt-3">
            We store your account email, profile name, and role in our{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 text-xs text-slate-200">
              profiles
            </code>{' '}
            table. Scan outputs—including resume text, scores, and summaries—are recorded in{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 text-xs text-slate-200">
              ai_scan_history
            </code>{' '}
            so you can review past results inside the app. We do not sell your personal data to third
            parties.
          </p>
        </section>

        <section aria-labelledby="data-minimization-heading">
          <h2 id="data-minimization-heading" className="text-lg font-semibold text-slate-100">
            Data Minimization
          </h2>
          <p className="mt-3">
            We limit retention to what is necessary to operate the service. For{' '}
            <strong className="font-medium text-slate-200">free-tier accounts</strong>, scan history
            older than <strong className="font-medium text-slate-200">30 days</strong> is
            permanently erased from our remote databases by an automated nightly cleanup job (
            <code className="rounded bg-slate-900 px-1.5 py-0.5 text-xs text-slate-200">
              cleanup_old_free_scans
            </code>
            ).
          </p>
          <p className="mt-3">
            Premium members may retain scan history according to their active subscription terms.
            Immutable compliance audit events may be retained separately where required for legal
            obligations, without retaining full resume content beyond operational needs.
          </p>
        </section>

        <section aria-labelledby="data-erasure-heading">
          <h2 id="data-erasure-heading" className="text-lg font-semibold text-slate-100">
            Data Erasure (Right to be Forgotten)
          </h2>
          <p className="mt-3">
            You may export your personal data or permanently delete your account from the{' '}
            <strong className="font-medium text-slate-200">Profile</strong> tab in the dashboard
            under &ldquo;Data Privacy &amp; Portability Options.&rdquo;
          </p>
          <p className="mt-3">
            Choosing{' '}
            <strong className="font-medium text-slate-200">
              Permanently Delete My Personal Profile
            </strong>{' '}
            records your request in our compliance log, removes your authentication identity, and
            triggers a cascade delete of your profile row and all associated scan records across our
            systems. Certain anonymized audit log entries may be preserved where law requires an
            immutable record of the deletion event itself.
          </p>
          <p className="mt-3">
            <Link href="/dashboard" className="font-medium text-indigo-400 hover:text-indigo-300">
              Go to Profile settings
            </Link>
          </p>
        </section>

        <section aria-labelledby="your-rights-heading">
          <h2 id="your-rights-heading" className="text-lg font-semibold text-slate-100">
            Your Rights
          </h2>
          <p className="mt-3">
            Depending on your jurisdiction, you may have rights to access, correct, export, restrict,
            or object to processing of your personal data. Contact us through your account settings
            or support channel to exercise these rights.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
        <p>© 2026 AI Career Shield. All rights reserved.</p>
      </footer>
    </article>
  )
}
