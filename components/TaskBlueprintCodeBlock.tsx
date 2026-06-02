const LANGUAGE_CLASS: Record<string, string> = {
  bash: 'language-bash',
  sh: 'language-bash',
  shell: 'language-bash',
  json: 'language-json',
  javascript: 'language-javascript',
  js: 'language-javascript',
  typescript: 'language-typescript',
  ts: 'language-typescript',
  python: 'language-python',
  sql: 'language-sql',
  yaml: 'language-yaml',
  yml: 'language-yaml',
}

type TaskBlueprintCodeBlockProps = {
  codeSnippet: string
  codeLanguage?: string
}

export default function TaskBlueprintCodeBlock({
  codeSnippet,
  codeLanguage = 'bash',
}: TaskBlueprintCodeBlockProps) {
  const lang = codeLanguage.toLowerCase().trim()
  const syntaxClass = LANGUAGE_CLASS[lang] ?? `language-${lang.replace(/[^a-z0-9-]/g, '')}`

  return (
    <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-700/80 bg-[#0d1117] p-3 shadow-inner">
      <code className={`block font-mono text-[11px] leading-relaxed text-slate-200 ${syntaxClass}`}>
        {codeSnippet}
      </code>
    </pre>
  )
}
