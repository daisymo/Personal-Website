import { useLanguage } from '../../hooks/useLanguage'
import { withYear } from '../../lib/currentYear'
import { PageContainer } from '../ui/PageContainer'

export function Footer() {
  const { t, resume } = useLanguage()
  const text = withYear(t.footer)
  const name = resume?.profile.name ?? 'Portfolio'

  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__inner">
        <p className="site-footer__copy">{text}</p>
        <p className="site-footer__name">{name}</p>
      </PageContainer>
    </footer>
  )
}
