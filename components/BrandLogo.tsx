import Image from 'next/image'

type BrandLogoProps = {
  /** Rendered width in px (height follows logo aspect ratio). */
  size?: number
  className?: string
  priority?: boolean
}

const LOGO_SRC = '/future-trace-logo.png'
const LOGO_ASPECT = 510 / 289

export default function BrandLogo({ size = 112, className = '', priority = false }: BrandLogoProps) {
  const width = size
  const height = Math.round(size / LOGO_ASPECT)

  return (
    <Image
      src={LOGO_SRC}
      alt="Future Trace"
      width={width}
      height={height}
      className={`h-auto w-auto max-w-full object-contain ${className}`.trim()}
      priority={priority}
    />
  )
}
