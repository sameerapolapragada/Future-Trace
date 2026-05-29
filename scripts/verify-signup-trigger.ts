import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

/**
 * Runtime verification for handle_new_user_signup() + ACCOUNT_CREATED compliance log.
 *
 * Uses the service-role admin client (not @/utils/supabase/server — that is anon/cookie scoped).
 *
 * Run from repo root (requires .env.local with Supabase URL + service role key):
 *   npm run verify:signup-trigger
 */

import { createAdminClient } from '../utils/supabase/admin'

const MOCK_FULL_NAME = 'Test Case User'
const TRIGGER_DELAY_MS = 2000

type StepResult = {
  label: string
  passed: boolean
  detail?: string
}

function validateEnv(): void {
  const missing: string[] = []

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY')
  }

  if (missing.length > 0) {
    console.error(
      '⚠️ Missing keys in .env.local. Make sure you have added SUPABASE_SERVICE_ROLE_KEY to your local env file.'
    )
    console.error(`   Missing: ${missing.join(', ')}`)
    process.exit(1)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms))
}

function randomSuffix(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function printReport(results: StepResult[]): void {
  console.log('\n--- Signup trigger verification ---\n')
  for (const step of results) {
    const icon = step.passed ? '✓' : '✗'
    console.log(`${icon} ${step.label}`)
    if (step.detail) {
      console.log(`    ${step.detail}`)
    }
  }
  const allPassed = results.every((r) => r.passed)
  console.log(`\n${allPassed ? 'PASS' : 'FAIL'} — ${results.filter((r) => r.passed).length}/${results.length} checks passed\n`)
}

async function main(): Promise<void> {
  validateEnv()

  const results: StepResult[] = []
  let userId: string | null = null
  const testEmail = `test_trigger_user_${randomSuffix()}@test.com`
  const testPassword = `Test_${randomSuffix()}_Aa1!`

  let supabase: ReturnType<typeof createAdminClient>

  try {
    supabase = createAdminClient()
    results.push({
      label: 'Admin client initialized (service role)',
      passed: true,
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    results.push({
      label: 'Admin client initialized (service role)',
      passed: false,
      detail: message,
    })
    printReport(results)
    process.exit(1)
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: MOCK_FULL_NAME },
  })

  if (createError || !created.user) {
    results.push({
      label: 'Create test user (auth.admin.createUser)',
      passed: false,
      detail: createError?.message ?? 'No user returned',
    })
    printReport(results)
    process.exit(1)
  }

  userId = created.user.id
  results.push({
    label: 'Create test user (auth.admin.createUser)',
    passed: true,
    detail: `${testEmail} → ${userId}`,
  })

  await sleep(TRIGGER_DELAY_MS)
  results.push({
    label: `Wait ${TRIGGER_DELAY_MS / 1000}s for trigger pipeline`,
    passed: true,
  })

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('id', userId)
    .maybeSingle()

  const profileOk =
    !profileError &&
    profile !== null &&
    profile.email === testEmail &&
    profile.full_name === MOCK_FULL_NAME

  results.push({
    label: 'profiles row exists with synced email + full_name',
    passed: profileOk,
    detail: profileError
      ? profileError.message
      : profile
        ? `email=${profile.email}, full_name=${profile.full_name ?? '(null)'}`
        : 'No profile row found',
  })

  const { data: logs, error: logsError } = await supabase
    .from('compliance_logs')
    .select('id, action_performed, target_profile_id')
    .eq('target_profile_id', userId)
    .eq('action_performed', 'ACCOUNT_CREATED')
    .limit(1)

  const logOk = !logsError && (logs?.length ?? 0) > 0
  results.push({
    label: "compliance_logs contains ACCOUNT_CREATED for user id",
    passed: logOk,
    detail: logsError
      ? logsError.message
      : logOk
        ? `log id ${logs![0].id}`
        : 'No matching compliance log',
  })

  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
  userId = null

  results.push({
    label: 'Delete test user (auth.admin.deleteUser)',
    passed: !deleteError,
    detail: deleteError?.message,
  })

  await sleep(500)

  const { data: profileAfterDelete } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', created.user.id)
    .maybeSingle()

  results.push({
    label: 'profiles row removed after auth user delete (ON DELETE CASCADE)',
    passed: profileAfterDelete === null,
    detail: profileAfterDelete ? 'Profile still present' : 'Profile row gone',
  })

  const { data: logsAfterDelete } = await supabase
    .from('compliance_logs')
    .select('id')
    .eq('target_profile_id', created.user.id)
    .eq('action_performed', 'ACCOUNT_CREATED')
    .limit(1)

  const logsRetained = (logsAfterDelete?.length ?? 0) > 0
  results.push({
    label: 'compliance_logs retained after delete (immutable audit; no FK cascade)',
    passed: logsRetained,
    detail: logsRetained
      ? 'Expected: ACCOUNT_CREATED log survives for legal audit'
      : 'Log missing — check trigger or retention policy',
  })

  printReport(results)

  if (!results.every((r) => r.passed)) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
