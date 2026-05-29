import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

interface BackButtonProps {
  className?: string
  label?: string
}

export function BackButton({ className = 'btn-ghost', label }: BackButtonProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <button
      type="button"
      className={className}
      onClick={() => navigate(-1)}
    >
      ← {label ?? t.common.back}
    </button>
  )
}
