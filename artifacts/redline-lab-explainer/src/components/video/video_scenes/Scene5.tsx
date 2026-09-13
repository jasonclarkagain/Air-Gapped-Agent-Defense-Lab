import { motion } from 'framer-motion';
import { FileCheck2 } from 'lucide-react';
import { SafeFrame, VideoText } from '@/lib/video';

const logRows = [
  ['09:41:56', 'BOUNDARY CHECK', 'Nevada ingress remained isolated', 'PASS'],
  ['09:36:22', 'APPROVAL GATE', 'APR-091 / lead decision required', 'HELD'],
  ['09:18:04', 'TASK DISPATCH', 'RL-2048 / scope verified', 'LOGGED'],
  ['08:54:10', 'SCOPE CHECK', 'RL-2047 / Utah allowlist match', 'PASS'],
];

export function Scene5() {
  return (
    <motion.div className="scene-shell" initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 74% 100%)' }} animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} exit={{ clipPath: 'polygon(0 0, 0 0, 26% 100%, 0 100%)' }} transition={{ duration: .9, ease: [0.16, 1, .3, 1] }}>
      <SafeFrame className="scene-content">
        <motion.img initial={{ opacity: 0, x: 55, scale: 1.08 }} animate={{ opacity: .17, x: 0, scale: 1 }} transition={{ duration: 1.1 }} src={`${import.meta.env.BASE_URL}audit-thread.png`} alt="" style={{ position: 'absolute', width: '57vmin', height: '40vmin', objectFit: 'cover', right: '-3vmin', top: '7vmin', mixBlendMode: 'multiply' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '.72fr 1.28fr', gap: '6vmin', height: '100%', alignItems: 'center' }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .24, duration: .5 }} className="eyebrow teal metric-line">04 / audit trail</motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .7 }}><VideoText as="h2" scale="heading" className="display ink" style={{ fontWeight: 600, letterSpacing: '-.065em', marginTop: '2.5vmin' }}>Every action<br /><span className="teal">leaves a trail.</span></VideoText></motion.div>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }} className="muted" style={{ maxWidth: '32vmin', fontSize: 'clamp(.7rem, 1.45vmin, 1.1rem)', lineHeight: 1.4, marginTop: '3vmin' }}>Dispatch, boundary checks, approvals, and outcomes — captured as they happen.</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="micro orange" style={{ display: 'flex', alignItems: 'center', gap: '1vmin', marginTop: '5vmin' }}><FileCheck2 size="1.8vmin" /> immutable run ledger</motion.div>
          </div>
          <div className="paper-card" style={{ padding: '2.8vmin', position: 'relative', background: 'rgba(238,233,223,.82)', transform: 'rotate(1deg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2vmin', borderBottom: '1px solid rgba(20,39,44,.22)' }}><span className="eyebrow ink">run ledger / 24h</span><span className="micro teal">6 events sealed</span></div>
            <div>
              {logRows.map((row, index) => (
                <motion.div key={row[0]} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .52 + index * .18, duration: .48, ease: [0.16, 1, .3, 1] }} style={{ display: 'grid', gridTemplateColumns: '10vmin 19vmin 1fr 8vmin', gap: '1.5vmin', alignItems: 'center', padding: '2.25vmin 0', borderBottom: '1px solid rgba(20,39,44,.13)' }}>
                  <span className="mono muted" style={{ fontSize: 'clamp(.5rem, .95vmin, .72rem)' }}>{row[0]}</span>
                  <span className="mono ink" style={{ fontSize: 'clamp(.46rem, .88vmin, .68rem)' }}>{row[1]}</span>
                  <span className="muted" style={{ fontSize: 'clamp(.5rem, 1.05vmin, .8rem)' }}>{row[2]}</span>
                  <span className="micro" style={{ color: row[3] === 'HELD' ? 'var(--color-primary)' : 'var(--color-secondary)', textAlign: 'right' }}>{row[3]}</span>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 1.2, duration: .8 }} style={{ position: 'absolute', bottom: '-.7vmin', left: 0, height: '1.4vmin', background: 'var(--color-primary)', opacity: .8 }} />
          </div>
        </div>
      </SafeFrame>
    </motion.div>
  );
}