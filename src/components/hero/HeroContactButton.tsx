import { motion } from '../../motion/framer'
import { useContactModal } from '../../context/ContactModalContext'
import { useLanguage } from '../../hooks/useLanguage'
import { fadeUp } from '../../motion/presets'

export function HeroContactButton() {
  const { t } = useLanguage()
  const { openContact } = useContactModal()

  return (
    <motion.div className="hero__contact-wrap" variants={fadeUp}>
      <button type="button" className="btn-primary hero__contact-cta" onClick={openContact}>
        {t.contact.cta}
      </button>
    </motion.div>
  )
}
