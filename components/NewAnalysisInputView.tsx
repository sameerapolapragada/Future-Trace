'use client'

import { Briefcase, FileText, TrendingUp, Upload, Zap } from 'lucide-react'
import type { ChangeEvent, DragEvent, FormEvent, RefObject } from 'react'

const RESUME_CHAR_LIMIT = 5000

const FIELD_TEXTAREA_CLASS =
  'w-full resize-none rounded-lg bg-slate-900/80 p-3 text-sm leading-relaxed text-slate-100 caret-sky-400 placeholder:text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-60'

function HowItWorksCard() {
  const steps = [
    'Upload your resume or paste your skills',
    'Enter your current and target job titles',
    'Get your AI Career Transition Roadmap with milestones and route',
  ]

  return (
    <aside className="rounded-2xl border border-sky-900/40 bg-trace-surface/50 p-5">
      <h3 className="text-sm font-semibold text-slate-100">How It Works</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-400">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-300">
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
}: NewAnalysisInputViewProps) {
  return (
    <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6">
      <form onSubmit={onSubmit} className="flex min-w-0 flex-col gap-4">
        <div className="rounded-2xl border border-sky-900/40 bg-trace-surface/50 p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-400" aria-hidden />
            <h2 className="text-sm font-semibold text-slate-100">Resume or Skills Summary</h2>
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
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex w-full flex-col items-center rounded-xl border-2 border-dashed px-4 py-8 transition ${
              isDraggingFile
                ? 'border-sky-400/70 bg-sky-950/30'
                : 'border-sky-900/50 bg-slate-950/40 hover:border-sky-700/50 hover:bg-slate-950/60'
            }`}
          >
            <Upload className="h-6 w-6 text-sky-400" aria-hidden />
            {uploadedFileName ? (
              <>
                <p className="mt-3 text-sm font-medium text-slate-100">{uploadedFileName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="text-sky-400">Click to upload</span> or drag and drop to replace
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-slate-300">
                  <span className="font-medium text-sky-400">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF, TXT, or DOCX (up to 5 MB)</p>
              </>
            )}
          </button>

          {uploadedFileName ? (
            <button
              type="button"
              onClick={onClearFile}
              className="mt-2 text-xs font-medium text-slate-400 transition hover:text-slate-200"
            >
              Remove file
            </button>
          ) : null}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-sky-900/40" aria-hidden />
            <span className="text-xs text-slate-500">Or paste your resume / LinkedIn summary</span>
            <div className="h-px flex-1 bg-sky-900/40" aria-hidden />
          </div>

          <textarea
            id="resumeText"
            name="resumeText"
            rows={7}
            maxLength={RESUME_CHAR_LIMIT}
            value={resumeText}
            onChange={(e) => onResumeTextChange(e.target.value)}
            placeholder="Paste your resume or skills summary here..."
            disabled={hasUploadedFile}
            className={FIELD_TEXTAREA_CLASS}
          />
          <p className="mt-2 text-xs text-slate-500">
            {resumeText.length} / {RESUME_CHAR_LIMIT} characters
          </p>
        </div>

        <div className="rounded-2xl border border-sky-900/40 bg-trace-surface/50 p-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-sky-400" aria-hidden />
                <label htmlFor="currentJobTitle" className="text-sm font-semibold text-slate-100">
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
                placeholder="e.g. Business Analyst"
                className="w-full rounded-lg border border-sky-900/40 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 caret-sky-400 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-sky-400" aria-hidden />
                <label htmlFor="targetJobTitle" className="text-sm font-semibold text-slate-100">
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
                placeholder="e.g. Senior Product Manager"
                className="w-full rounded-lg border border-sky-900/40 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 caret-sky-400 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25"
              />
            </div>
          </div>
        </div>

        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-300"
          >
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-500"
        >
          <Zap className="h-4 w-4" aria-hidden />
          Generate My Transition Roadmap
        </button>
      </form>

      <HowItWorksCard />
    </section>
  )
}
