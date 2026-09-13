import { motion } from 'framer-motion';
import { LockKeyhole, UserRound } from 'lucide-react';
import { SafeFrame, VideoText } from '@/lib/video';

export function Scene4() {
  return (
    <motion.div className="scene-shell" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .85, ease: [0.16, 1, .3, 1] }}>
      <SafeFrame className="scene-content">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="eyebrow muted" style={{ position: 'absolute', top: '7vmin', left: '6vmin' }}>03 / approval gate</motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: '7vmin', height: '100%', alignItems: 'center' }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .28, duration: .55 }}><VideoText as="h2" scale="heading" className="display ink" style={{ fontWeight: 600, letterSpacing: '-.065em' }}>A human<br /><span className="orange">stays in the loop.</span></VideoText></motion.div>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .72, duration: .55 }} className="muted" style={{ maxWidth: '35vmin', fontSize: 'clamp(.72rem, 1.5vmin, 1.15rem)', lineHeight: 1.4, marginTop: '3vmin' }}>When an action needs judgment, the console stops. The next move belongs to the lead.</motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.04, duration: .45 }} className="micro teal" style={{ display: 'flex', alignItems: 'center', gap: '1vmin', marginTop: '5vmin' }}><LockKeyhole size="1.8vmin" /> gate status / enforced</motion.div>
          </div>
          <div style={{ position: 'relative', height: '56vmin' }}>
            <motion.div initial={{ opacity: 0, x: -30, rotate: -2 }} animate={{ opacity: 1, x: 0, rotate: -1 }} transition={{ delay: .38, duration: .7 }} className="paper-card" style={{ position: 'absolute', left: '0%', top: '12%', width: '43vmin', padding: '3vmin', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}><div className="eyebrow orange">request / APR-091</div><div className="micro muted">NEVADA</div></div>
              <div className="display ink" style={{ fontSize: 'clamp(1rem, 2.5vmin, 2rem)', fontWeight: 600, lineHeight: 1.06, marginTop: '3vmin', letterSpacing: '-.045em' }}>Promote evidence<br />bundle to review lane</div>
              <div className="rule" style={{ margin: '3vmin 0 2vmin' }} />
              <div className="micro muted">scope / evidence.promote</div>
              <div className="micro teal" style={{ marginTop: '1vmin' }}>local integrity checks passed</div>
            </motion.div>
            <motion.div initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .8, duration: .7, type: 'spring', stiffness: 170, damping: 17 }} style={{ position: 'absolute', right: '2%', top: '27%', width: '17vmin', height: '17vmin', borderRadius: '50%', border: '.35vmin solid var(--color-primary)', background: 'var(--color-bg-light)', display: 'grid', placeItems: 'center', zIndex: 3, boxShadow: '0 0 0 1.4vmin rgba(215,97,59,.12)' }}>
              <div style={{ textAlign: 'center' }}><LockKeyhole size="3.1vmin" color="var(--color-primary)" /><div className="micro orange" style={{ marginTop: '1vmin' }}>HUMAN GATE</div></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: .55 }} className="dark-card" style={{ position: 'absolute', right: '0%', bottom: '4%', width: '31vmin', padding: '2.6vmin', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.3vmin' }}><div style={{ width: '4.3vmin', height: '4.3vmin', borderRadius: '50%', border: '1px solid var(--color-accent)', display: 'grid', placeItems: 'center', color: 'var(--color-accent)' }}><UserRound size="2vmin" /></div><div><div className="mono" style={{ fontSize: 'clamp(.58rem, 1.05vmin, .8rem)' }}>AVERY MERCER</div><div className="micro" style={{ color: 'rgba(238,233,223,.58)', marginTop: '.45vmin' }}>RESEARCH LEAD</div></div></div>
              <div className="micro" style={{ color: 'var(--color-accent)', marginTop: '2.4vmin' }}>decision recorded / 09:36:22Z</div>
            </motion.div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.02, duration: .75 }} style={{ position: 'absolute', left: '35%', right: '13%', top: '45%', height: '1px', background: 'var(--color-primary)', transformOrigin: 'left', zIndex: 2 }} />
          </div>
        </div>
      </SafeFrame>
    </motion.div>
  );
}