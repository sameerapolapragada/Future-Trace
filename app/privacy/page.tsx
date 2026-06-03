import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy & Data Governance | Future Trace',
  description:
    'How Future Trace collects, minimizes, and erases personal data under GDPR and CCPA.',
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto min-h-screen max-w-md bg-trace-bg px-6 py-8 text-trace-foreground">
      <header className="mb-8 border-b border-trace-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-highlight transition hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-50">
          Privacy &amp; Data Governance
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Last updated: May 2026 · GDPR / CCPA aligned practices for Future Trace
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-300">
        <section aria-labelledby="data-collection-heading">
          <h2 id="data-collection-heading" className="text-lg font-semibold text-trace-foreground">
            Data Collection
          </h2>
          <p className="mt-3">
            When you run an AI insulation scan, we securely ingest the resume or skills summary you
            provide, along with your target job title. This content is transmitted over encrypted
            connections and processed to derive automation-risk signals and a vulnerability score.
          </p>
          <p className="mt-3">
            We store your account email, profile name, and role in our{' '}
            <code className="rounded bg-trace-surface px-1.5 py-0.5 text-xs text-slate-200">
              profiles
            </code>{' '}
            table.{' '}
            <strong className="font-medium text-slate-200">Premium members</strong> may also have
            scan outputs—including extracted resume text, scores, and summaries—recorded in{' '}
            <code className="rounded bg-trace-surface px-1.5 py-0.5 text-xs text-slate-200">
              ai_scan_history
            </code>{' '}
            to support historical risk tracking inside the app. Free-tier scans are not written to
            permanent storage (see Data Minimization). We do not sell your personal data to third
            parties.
          </p>
        </section>

        <section aria-labelledby="data-minimization-heading">
          <h2 id="data-minimization-heading" className="text-lg font-semibold text-trace-foreground">
            Data Minimization
          </h2>
          <p className="mt-3">
            We limit retention to what is necessary to operate the service.
          </p>
          <p className="mt-3">
            <strong className="font-medium text-slate-200">Free users:</strong> For free tier scans,
            files are processed entirely in volatile server memory (RAM) to calculate your initial
            Future Trace index. The document binary is completely destroyed immediately after your
            session score is generated, and never touches our permanent database or storage drives.
          </p>
          <p className="mt-3">
            Immutable compliance audit events may be retained separately where required for legal
            obligations, without retaining full resume content beyond operational needs.
          </p>
        </section>

        <section aria-labelledby="premium-storage-heading">
          <h2 id="premium-storage-heading" className="text-lg font-semibold text-trace-foreground">
            Premium Data Storage
          </h2>
          <p className="mt-3">
            Upon upgrading to premium, users gain access to encrypted, persistent profile hosting
            where resumes are securely stored inside a private cloud bucket isolated by Postgres
            Row-Level Security (RLS) to support continuous historical risk tracking.
          </p>
        </section>

        <section aria-labelledby="data-erasure-heading">
          <h2 id="data-erasure-heading" className="text-lg font-semibold text-trace-foreground">
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
            <Link href="/dashboard" className="font-medium text-highlight hover:text-accent">
              Go to Profile settings
            </Link>
          </p>
        </section>

        <section aria-labelledby="your-rights-heading">
          <h2 id="your-rights-heading" className="text-lg font-semibold text-trace-foreground">
            Your Rights
          </h2>
          <p className="mt-3">
            Depending on your jurisdiction, you may have rights to access, correct, export, restrict,
            or object to processing of your personal data. Contact us through your account settings
            or support channel to exercise these rights.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-trace-border pt-6 text-xs text-slate-500">
        <p>© 2026 Future Trace. All rights reserved.</p>
      </footer>
    </article>
  )
}
