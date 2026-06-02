export default function HomeAboutSection() {
  return (
    <section aria-labelledby="about-us-heading" className="mb-10">
      <div className="horizon-card-padded">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">About Us</p>
        <h2
          id="about-us-heading"
          className="mt-2 text-xl font-bold leading-snug text-textPrimary sm:text-2xl"
        >
          Navigating the AI Shift: From Uncertainty to Trajectory
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-textSecondary sm:text-base">
          <p>
            Everywhere you look, AI is changing the rules of the professional landscape. It&apos;s in
            our software tools, our workflows, and dominates every headline regarding the future of
            work. For the modern professional, this rapid evolution brings a quiet but persistent
            question: Where do I fit into this new architecture?
          </p>
          <p>
            Most career platforms offer generic advice or tell you to &quot;learn to code,&quot; ignoring the
            nuance of your unique background. We built Future Trace because we believe that the rise
            of AI shouldn&apos;t mean the displacement of brilliant professionals—it should mean their
            evolution.
          </p>
          <p>
            Future Trace is a career intelligence platform born out of a simple mission: to turn
            AI-driven market disruption into your ultimate competitive advantage. We don&apos;t just give
            you a static risk score; we map out your exact, recommended trajectory from where you are
            today to where the market is starving for talent. By breaking down daunting, long-term
            industry transitions into digestible, 30-day tactical execution sprints, we provide the
            step-by-step blueprints and deep in-app resources you need to systematically future-proof
            your career.
          </p>
          <p className="text-textPrimary">
            The future isn&apos;t something to watch happen from the sidelines. Trace your path, master
            your evolution, and build what comes next with Future Trace.
          </p>
        </div>
      </div>
    </section>
  )
}
