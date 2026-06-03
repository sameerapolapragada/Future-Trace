'use client'

import { createClient } from '@/utils/supabase/client'

export type ComplianceAction = 'DATA_EXPORT' | 'ACCOUNT_DELETION'

/**
 * Records an immutable compliance audit event for the signed-in user.
 *
 * Database RPC: `log_compliance_event(p_action text)` — `target_profile_id`
 * is set server-side from `auth.uid()`; `targetId` is validated client-side.
 */
export async function triggerComplianceLog(
  action: ComplianceAction,
  targetId: string
): Promise<{ logId: string | null; error: string | null }> {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { logId: null, error: userError?.message ?? 'Not authenticated' }
  }

  if (user.id !== targetId) {
    return { logId: null, error: 'Target profile does not match the active session' }
  }

  const { data: logId, error: rpcError } = await supabase.rpc('log_compliance_event', {
    p_action: action,
  })

  if (rpcError) {
    return { logId: null, error: rpcError.message }
  }

  return { logId: logId as string, error: null }
}

/*
 * ---------------------------------------------------------------------------
 * Settings panel integration (app/dashboard/page.tsx or account settings tab)
 * ---------------------------------------------------------------------------
 *
 * import { triggerComplianceLog } from '@/utils/supabase/compliance'
 *
 * // --- Export My PDF Data Profile ---
 * async function handleExportProfileData() {
 *   if (!userId) return
 *   setExportLoading(true)
 *
 *   const { logId, error } = await triggerComplianceLog('DATA_EXPORT', userId)
 *   if (error) {
 *     setExportError(error)
 *     setExportLoading(false)
 *     return
 *   }
 *
 *   // TODO: generate PDF / download payload after audit log succeeds
 *   console.log('Compliance log recorded:', logId)
 *   setExportLoading(false)
 * }
 *
 * <button type="button" onClick={handleExportProfileData} disabled={exportLoading}>
 *   Export My PDF Data Profile
 * </button>
 *
 * // --- Permanently Delete My Structural Account Data ---
 * async function handlePermanentAccountDeletion() {
 *   if (!userId) return
 *   if (!window.confirm('This permanently deletes your account and data. Continue?')) return
 *   setDeleteLoading(true)
 *
 *   const { logId, error } = await triggerComplianceLog('ACCOUNT_DELETION', userId)
 *   if (error) {
 *     setDeleteError(error)
 *     setDeleteLoading(false)
 *     return
 *   }
 *
 *   // TODO: call account deletion flow (admin API / Supabase Auth delete user)
 *   console.log('Deletion request logged:', logId)
 *   setDeleteLoading(false)
 * }
 *
 * <button
 *   type="button"
 *   onClick={handlePermanentAccountDeletion}
 *   disabled={deleteLoading}
 *   className="text-red-400 hover:text-red-300"
 * >
 *   Permanently Delete My Structural Account Data
 * </button>
 */
