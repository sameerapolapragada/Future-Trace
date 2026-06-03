import { StyleSheet, View } from 'react-native'
import { Text } from './AppText'
import { horizon } from '../theme/colors'

const ABOUT_PARAGRAPHS = [
  "Everywhere you look, AI is changing the rules of the professional landscape. It's in our software tools, our workflows, and dominates every headline regarding the future of work. For the modern professional, this rapid evolution brings a quiet but persistent question: Where do I fit into this new architecture?",
  'Most career platforms offer generic advice or tell you to "learn to code," ignoring the nuance of your unique background. We built Future Trace because we believe that the rise of AI shouldn\'t mean the displacement of brilliant professionals—it should mean their evolution.',
  "Future Trace is a career intelligence platform born out of a simple mission: to turn AI-driven market disruption into your ultimate competitive advantage. We don't just give you a static risk score; we map out your exact, recommended trajectory from where you are today to where the market is starving for talent. By breaking down daunting, long-term industry transitions into digestible, 30-day tactical execution sprints, we provide the step-by-step blueprints and deep in-app resources you need to systematically future-proof your career.",
] as const

const ABOUT_CLOSING =
  "The future isn't something to watch happen from the sidelines. Trace your path, master your evolution, and build what comes next with Future Trace."

export function HomeAboutSection() {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>About Us</Text>
      <Text style={styles.title}>Navigating the AI Shift: From Uncertainty to Trajectory</Text>
      <View style={styles.body}>
        {ABOUT_PARAGRAPHS.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
        <Text style={styles.closing}>{ABOUT_CLOSING}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: horizon.borderMuted,
    backgroundColor: horizon.surface,
    padding: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: horizon.accent,
  },
  title: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: horizon.textPrimary,
  },
  body: {
    marginTop: 20,
    gap: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: horizon.textSecondary,
  },
  closing: {
    fontSize: 14,
    lineHeight: 22,
    color: horizon.textPrimary,
  },
})
