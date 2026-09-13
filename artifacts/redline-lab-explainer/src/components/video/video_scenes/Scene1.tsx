import { motion } from 'framer-motion';
import { SafeFrame, VideoText } from '@/lib/video';

export function Scene1() {
  return (
    <motion.div
      className="scene-shell"
      initial={{ clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
      animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
      exit={{ clipPath: 'inset(0 100% 0 0%)', opacity: 0 }}
      transition={{ duration: .9, ease: [0.16, 1, .3, 1] }}
    >
      <SafeFrame className="scene-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', alignItems: 'center', gap: '5vmin', height: '100%' }}>
          <div style={{ maxWidth: '66vmin' }}>
            <motion.div className="eyebrow teal metric-line" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2, duration: .55 }}>
              Defensive operations / 01
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .37, duration: .8, ease: [0.16, 1, .3, 1] }}>
              <VideoText as="h1" scale="display" className="display ink" style={{ marginTop: '2.1vmin', fontWeight: 600, letterSpacing: '-.075em', maxWidth: '68vmin' }}>
                Coordination<br /><span className="orange">with a redline.</span>
              </VideoText>
            </motion.div>
            <motion.p className="muted" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .68, duration: .65 }} style={{ maxWidth: '45vmin', fontSize: 'clamp(.78rem, 1.9vmin, 1.55rem)', lineHeight: 1.35, marginTop: '3.2vmin' }}>
              Redline Lab Console keeps AI research moving — inside clearly bounded spaces.
            </motion.p>
            <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 1.05, duration: .75, ease: [0.16, 1, .3, 1] }} className="rule line-draw orange" style={{ width: '25vmin', marginTop: '5vmin' }} />
          </div>
          <div style={{ position: 'relative', height: '64vmin', maxHeight: '70vh' }}>
            <motion.div className="paper-card scan-grid" initial={{ opacity: 0, rotate: 3, scale: .86 }} animate={{ opacity: 1, rotate: -3, scale: 1 }} transition={{ delay: .25, duration: 1, ease: [0.16, 1, .3, 1] }} style={{ position: 'absolute', inset: '8% 4% 5% 10%', padding: '4vmin', transformOrigin: 'center' }}>
              <div className="eyebrow muted">console / live frame</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '3vmin' }}>
                <div><div className="micro muted">boundary posture</div><div className="display ink" style={{ fontSize: 'clamp(1.8rem, 5.8vmin, 5rem)', fontWeight: 600, letterSpacing: '-.07em', marginTop: '.7vmin' }}>INTACT</div></div>
                <div className="mono teal" style={{ fontSize: 'clamp(.54rem, 1.1vmin, .85rem)' }}>09:41:56Z</div>
              </div>
              <div className="rule" style={{ margin: '4.5vmin 0 3vmin' }} />
              {[['UTAH', 'dual air-gap', '03 agents'], ['NEVADA', 'triple air-gap', '03 agents']].map(([site, sub, total], i) => (
                <motion.div key={site} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .82 + i * .18, duration: .45 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.6vmin 0', borderBottom: '1px solid rgba(20,39,44,.14)' }}>
                  <span className="mono" style={{ fontSize: 'clamp(.58rem, 1.18vmin, .95rem)', color: i === 0 ? '#a57c22' : 'var(--color-secondary)' }}>{site}</span>
                  <span className="muted" style={{ fontSize: 'clamp(.62rem, 1.28vmin, 1rem)' }}>{sub}</span>
                  <span className="mono ink" style={{ fontSize: 'clamp(.5rem, .95vmin, .75rem)' }}>{total}</span>
                </motion.div>
              ))}
              <div style={{ display: 'flex', gap: '1vmin', alignItems: 'center', marginTop: '4.2vmin' }} className="micro teal"><span className="dot" /> all actions audited</div>
            </motion.div>
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .75, duration: .7, type: 'spring', stiffness: 180, damping: 16 }} style={{ position: 'absolute', top: '3%', right: '0%', width: '12vmin', height: '12vmin', background: 'var(--color-primary)', color: 'var(--color-text-inverse)', padding: '2vmin', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '.8vmin .8vmin 0 rgba(20,39,44,.16)' }}>
              <span className="micro">01—06</span><span className="display" style={{ fontSize: '3.8vmin', lineHeight: .8 }}>RL</span>
            </motion.div>
          </div>
        </div>
      </SafeFrame>
    </motion.div>
  );
}