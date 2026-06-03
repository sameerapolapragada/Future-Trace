'use client'

import { formatJobTitle } from '@/lib/formatJobTitle'
import { MATCHER_SUBMIT_LABEL } from '@/lib/matcherCopy'
import ScanBalanceBadge, { isScanUploadLocked } from '@/components/ScanBalanceBadge'
import type { ScanBalanceResponse } from '@/lib/scanLimits'
import { Briefcase, FileText, TrendingUp, Upload, Zap } from 'lucide-react'
import type { ChangeEvent, DragEvent, FormEvent, RefObject } from 'react'
import { useState } from 'react'

const RESUME_CHAR_LIMIT = 5000

const FIELD_TEXTAREA_CLASS =
  'horizon-input w-full resize-none p-4 text-sm leading-relaxed disabled:cursor-not-allowed disabled:opacity-60'

function HowItWorksCard() {
  const steps = [
    'Upload your resume or paste your skills',
    'Enter your current and target job titles',
    'Get your AI Career Transition Roadmap with milestones and route',
  ]

  return (
    <aside className="horizon-card-padded">
      <h3 className="text-sm font-semibold text-textPrimary">How It Works</h3>
      <ol className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-textSecondary">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accentMuted text-xs font-semibold text-accent">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </aside>
  )
}

type NewAnalysisInputViewProps = {
  resumeText: string
  currentJobTitle: string
  targetJobTitle: string
  uploadedFileName: string | null
  isDraggingFile: boolean
  formError: string | null
  fileInputRef: RefObject<HTMLInputElement>
  onResumeTextChange: (value: string) => void
  onCurrentJobTitleChange: (value: string) => void
  onTargetJobTitleChange: (value: string) => void
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDragLeave: () => void
  onDrop: (event: DragEvent<HTMLElement>) => void
  onOpenFilePicker: () => void
  onClearFile: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  hasUploadedFile: boolean
  scanBalanceRefreshToken?: number
  submitButtonLabel?: string
}

export default function NewAnalysisInputView({
  resumeText,
  currentJobTitle,
  targetJobTitle,
  uploadedFileName,
  isDraggingFile,
  formError,
  fileInputRef,
  onResumeTextChange,
  onCurrentJobTitleChange,
  onTargetJobTitleChange,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenFilePicker,
  onClearFile,
  onSubmit,
  hasUploadedFile,
  scanBalanceRefreshToken = 0,
  submitButtonLabel = MATCHER_SUBMIT_LABEL,
}: NewAnalysisInputViewProps) {
  const [scanBalance, setScanBalance] = useState<ScanBalanceResponse | null>(null)
  const uploadLocked = isScanUploadLocked(scanBalance)

  return (
    <section className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">
      <form onSubmit={onSubmit} className="flex min-w-0 flex-col gap-6">
        <div className="horizon-card-padded">
          <div className="mb-6 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" aria-hidden />
            <h2 className="text-base font-semibold text-textPrimary">Resume or Skills Summary</h2>
          </div>

          <div className="mb-6">
            <ScanBalanceBadge
              refreshToken={scanBalanceRefreshToken}
              onBalanceChange={setScanBalance}
            />
          </div>

          <input
            ref={fileInputRef}
            id="resumeUpload"
            type="file"
            accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileInputChange}
            className="sr-only"
          />

          <button
            type="button"
            onClick={onOpenFilePicker}
            onDragOver={uploadLocked ? undefined : onDragOver}
            onDragLeave={uploadLocked ? undefined : onDragLeave}
            onDrop={uploadLocked ? undefined : onDrop}
            disabled={uploadLocked}
            aria-disabled={uploadLocked}
            className={`horizon-interactive flex w-full flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 ${
              uploadLocked
                ? 'cursor-not-allowed border-borderMuted bg-background opacity-60'
                : isDraggingFile
                  ? 'border-accent bg-accentMuted'
                  : 'border-borderMuted bg-surface hover:border-accent/40 hover:bg-accentMuted/50'
            }`}
          >
            <Upload className="h-6 w-6 text-accent" aria-hidden />
            {uploadedFileName ? (
              <>
                <p className="mt-4 text-sm font-medium text-textPrimary">{uploadedFileName}</p>
                <p className="mt-1 text-xs text-textSecondary">
                  <span className="font-medium text-accent">Click to upload</span> or drag and drop to replace
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm text-textSecondary">
                  <span className="font-medium text-accent">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-textSecondary">PDF, TXT, or DOCX (up to 5 MB)</p>
              </>
            )}
          </button>

          {uploadedFileName ? (
            <button
              type="button"
              onClick={onClearFile}
              className="horizon-interactive mt-3 text-xs font-medium text-textSecondary hover:text-textPrimary"
            >
              Remove file
            </button>
          ) : null}

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-borderMuted" aria-hidden />
            <span className="text-xs text-textSecondary">Or paste your resume / LinkedIn summary</span>
            <div className="h-px flex-1 bg-borderMuted" aria-hidden />
          </div>

          <textarea
            id="resumeText"
            name="resumeText"
            rows={7}
            maxLength={RESUME_CHAR_LIMIT}
            value={resumeText}
            onChange={(e) => onResumeTextChange(e.target.value)}
            placeholder="Paste your resume or skills summary here..."
            disabled={hasUploadedFile || uploadLocked}
            className={FIELD_TEXTAREA_CLASS}
          />
          <p className="mt-2 text-xs text-textSecondary">
            {resumeText.length} / {RESUME_CHAR_LIMIT} characters
          </p>
        </div>

        <div className="horizon-card-padded">
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" aria-hidden />
                <label htmlFor="currentJobTitle" className="text-sm font-semibold text-textPrimary">
                  Current Job Title
                </label>
              </div>
              <input
                id="currentJobTitle"
                name="currentJobTitle"
                type="text"
                autoComplete="organization-title"
                value={currentJobTitle}
                onChange={(e) => onCurrentJobTitleChange(e.target.value)}
                onBlur={() => onCurrentJobTitleChange(formatJobTitle(currentJobTitle))}
                placeholder="e.g. Business Analyst"
                disabled={uploadLocked}
                className="horizon-input w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" aria-hidden />
                <label htmlFor="targetJobTitle" className="text-sm font-semibold text-textPrimary">
                  Target Job Title
                </label>
              </div>
              <input
                id="targetJobTitle"
                name="targetJobTitle"
                type="text"
                autoComplete="off"
                value={targetJobTitle}
                onChange={(e) => onTargetJobTitleChange(e.target.value)}
                onBlur={() => onTargetJobTitleChange(formatJobTitle(targetJobTitle))}
                placeholder="e.g. Senior Product Manager"
                disabled={uploadLocked}
                className="horizon-input w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {formError ? (
          <p role="alert" className="alert-anomaly text-sm">
            {formError}
          </p>
        ) : null}

        <button type="submit" disabled={uploadLocked} className="btn-primary w-full gap-2 py-3.5">
          <Zap className="h-4 w-4" aria-hidden />
          {submitButtonLabel}
        </button>
      </form>

      <HowItWorksCard />
    </section>
  )
}
