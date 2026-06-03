import mammoth from 'mammoth'

const MAX_FILE_BYTES = 5 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const ALLOWED_EXTENSIONS = new Set(['.txt', '.pdf', '.docx'])

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.')
  return index >= 0 ? name.slice(index).toLowerCase() : ''
}

export function isAllowedResumeFile(file: File): boolean {
  const extension = extensionOf(file.name)
  return ALLOWED_MIME_TYPES.has(file.type) || ALLOWED_EXTENSIONS.has(extension)
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default
  const parsed = await pdfParse(buffer)
  return parsed.text.trim()
}

export async function extractResumeTextFromFile(file: File): Promise<string> {
  if (!isAllowedResumeFile(file)) {
    throw new Error('Unsupported file type. Upload a .txt, .pdf, or .docx resume.')
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error('File is too large. Maximum size is 5 MB.')
  }

  const extension = extensionOf(file.name)
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === 'text/plain' || extension === '.txt') {
    return buffer.toString('utf-8').trim()
  }

  if (file.type === 'application/pdf' || extension === '.pdf') {
    return extractPdfText(buffer)
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === '.docx'
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
  }

  throw new Error('Unsupported file type. Upload a .txt, .pdf, or .docx resume.')
}
