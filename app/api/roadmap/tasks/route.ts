import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('roadmap_task_completions')
      .select('milestone_key, task_id')
      .eq('profile_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const completed = (data ?? []).map((row) => `${row.milestone_key}:${row.task_id}`)
    return NextResponse.json({ completed })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load task completions'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (!profile?.is_premium) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    const body = (await request.json()) as {
      milestoneKey?: string
      taskId?: string
      completed?: boolean
    }

    const milestoneKey = body.milestoneKey?.trim()
    const taskId = body.taskId?.trim()
    const completed = body.completed

    if (!milestoneKey || !taskId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (completed) {
      const { error } = await supabase.from('roadmap_task_completions').upsert(
        {
          profile_id: user.id,
          milestone_key: milestoneKey,
          task_id: taskId,
        },
        { onConflict: 'profile_id,milestone_key,task_id' }
      )

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      const { error } = await supabase
        .from('roadmap_task_completions')
        .delete()
        .eq('profile_id', user.id)
        .eq('milestone_key', milestoneKey)
        .eq('task_id', taskId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task completion'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
