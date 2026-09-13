import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { SafeFrame, VideoText } from '@/lib/video';

export function Scene6() {
  return (
    <motion.div className="scene-shell" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 1, ease: [0.16, 1, .3, 1] }}>
      <SafeFrame className="scene-content">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .55 }} className="eyebrow orange">The operating picture, made legible.</motion.div>
          <motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .3, duration: .85, type: 'spring', stiffness: 140, damping: 18 }} style={{ width: '13vmin', height: '13vmin', border: '.35vmin solid var(--color-primary)', borderRadius: '50%', display: 'grid', placeItems: 'center', marginTop: '3vmin', boxShadow: '0 0 0 1.2vmin rgba(215,97,59,.1)' }}><LockKeyhole size="5vmin" color="var(--color-primary)" strokeWidth={1.5} /></motion.div>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, duration: .75 }}><VideoText as="h2" scale="heading" className="display ink" style={{ marginTop: '4vmin', fontWeight: 600, letterSpacing: '-.07em' }}>Redline Lab <span className="orange">Console</span></VideoText></motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: .55 }} className="muted" style={{ fontSize: 'clamp(.7rem, 1.5vmin, 1.15rem)', marginTop: '2.2vmin' }}>No autonomous egress. No boundary crossing. Every action audited.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: .55 }} style={{ display: 'flex', gap: '4.5vmin', marginTop: '6vmin' }}>
            {[['site separation', '2 labs / 5 air-gaps', ShieldCheck], ['human gates', 'scope before motion', LockKeyhole]].map(([label, value, Icon]) => {
              const Glyph = Icon as typeof ShieldCheck;
              return <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: '1.4vmin', textAlign: 'left' }}><Glyph size="2.7vmin" color="var(--color-secondary)" strokeWidth={1.5} /><div><div className="micro teal">{label as string}</div><div className="mono ink" style={{ fontSize: 'clamp(.52rem, 1vmin, .75rem)', marginTop: '.6vmin' }}>{value as string}</div></div></div>;
            })}
          </motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.75, duration: .8 }} className="rule orange" style={{ width: '24vmin', marginTop: '5vmin', transformOrigin: 'center' }} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.05 }} className="micro muted" style={{ marginTop: '1.7vmin' }}>a defensive operations console for coordinated AI research</motion.div>
        </div>
      </SafeFrame>
    </motion.div>
  );
}