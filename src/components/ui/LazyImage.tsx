import { useState, useRef, useEffect, type ImgHTMLAttributes, type ReactNode } from 'react'
import { Skeleton } from './Skeleton'

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string
  srcSet?: string
  sizes?: string
  placeholder?: ReactNode
  aspectRatio?: string
  className?: string
}

export function LazyImage({
  src,
  srcSet,
  sizes,
  placeholder,
  aspectRatio,
  className = '',
  alt = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '300px',
        threshold: 0.01,
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const showPlaceholder = !isLoaded && (placeholder !== undefined)

  return (
    <div
      className={`relative overflow-hidden bg-[var(--bg-subtle)] ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {showPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder}
        </div>
      ) : !isLoaded ? (
        <div className="absolute inset-0">
          <Skeleton.Block className="w-full h-full rounded-[var(--radius-md)]" />
        </div>
      ) : null}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        srcSet={isInView ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        decoding="async"
        loading="lazy"
        {...props}
      />
    </div>
  )
}
