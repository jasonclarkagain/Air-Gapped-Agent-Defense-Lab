import { motion } from 'framer-motion';
import { SafeFrame, VideoText } from '@/lib/video';

const agents = [
  { id: 'U-SCOUT 01', role: 'evidence collection', site: 'UTAH', color: '#a57c22', state: 'ACTIVE', task: 'network baseline / rack 04' },
  { id: 'U-JUDGE 01', role: 'policy evaluation', site: 'UTAH', color: '#a57c22', state: 'READY', task: 'waiting for evidence' },
  { id: 'N-PROBE 01', role: 'controlled probing', site: 'NEVADA', color: '#2e7771', state: 'ACTIVE', task: 'model boundary sweep' },
  { id: 'N-SCRIBE 01', role: 'audit & synthesis', site: 'NEVADA', color: '#2e7771', state: 'LOGGING', task: 'writing run ledger' },
];

export function Scene3() {
  return (
    <motion.div className="scene-shell" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} transition={{ duration: .85, ease: [0.16, 1, .3, 1] }}>
      <SafeFrame className="scene-content">
        <div style={{ display: 'grid', gridTemplateColumns: '.82fr 1.18fr', gap: '5vmin', height: '100%', alignItems: 'center' }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .22, duration: .5 }} className="eyebrow teal metric-line">02 / fleet + scope</motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}>
              <VideoText as="h2" scale="heading" className="display ink" style={{ fontWeight: 600, letterSpacing: '-.065em', marginTop: '2.5vmin' }}>Agents work<br /><span className="orange">inside a scope.</span></VideoText>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75, duration: .5 }} className="muted" style={{ maxWidth: '35vmin', fontSize: 'clamp(.7rem, 1.5vmin, 1.15rem)', lineHeight: 1.4, marginTop: '3vmin' }}>Every dispatch is allowlisted to one site, one agent, and one bounded operation.</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }} style={{ marginTop: '5vmin' }}>
              <div className="micro muted">scope packet / RL-2048</div>
              <div className="mono teal" style={{ marginTop: '1vmin', fontSize: 'clamp(.58rem, 1.15vmin, .9rem)' }}>model-boundary.read</div>
              <div className="rule" style={{ width: '25vmin', marginTop: '1.5vmin' }} />
            </motion.div>
          </div>
          <div style={{ position: 'relative', height: '68vmin', maxHeight: '76vh' }}>
            <div style={{ position: 'absolute', inset: '5% 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vmin' }}>
              {agents.map((agent, index) => (
                <motion.div key={agent.id} className="paper-card" initial={{ opacity: 0, y: 22, rotate: index % 2 ? 1.5 : -1.5 }} animate={{ opacity: 1, y: 0, rotate: index % 2 ? .6 : -.6 }} transition={{ delay: .43 + index * .12, duration: .55, ease: [0.16, 1, .3, 1] }} style={{ padding: '2.4vmin', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '.55vmin', height: '100%', background: agent.color }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1vmin' }}>
                    <span className="mono ink" style={{ fontSize: 'clamp(.52rem, 1.05vmin, .8rem)' }}>{agent.id}</span>
                    <span className="micro" style={{ color: agent.color }}>{agent.state}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 'clamp(.54rem, 1.05vmin, .8rem)', marginTop: '1.6vmin' }}>{agent.role}</div>
                  <div className="ink" style={{ fontSize: 'clamp(.62rem, 1.25vmin, .95rem)', marginTop: '3vmin', lineHeight: 1.2 }}>{agent.task}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.7vmin', marginTop: '3vmin' }} className="micro muted"><span className="dot" style={{ color: agent.color }} /> heartbeat 12 sec</div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.05, duration: .65 }} style={{ position: 'absolute', top: '50%', left: '2%', right: '2%', height: '1px', background: 'var(--color-primary)', transformOrigin: 'left', opacity: .75 }} />
            <motion.div initial={{ x: '-10%', opacity: 0 }} animate={{ x: '115%', opacity: [0, 1, 1, 0] }} transition={{ delay: 1.15, duration: 1.8, ease: 'easeInOut' }} style={{ position: 'absolute', top: 'calc(50% - .6vmin)', width: '1.2vmin', height: '1.2vmin', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 0 1vmin rgba(215,97,59,.13)' }} />
            <div className="micro orange" style={{ position: 'absolute', right: '1vmin', top: 'calc(50% + 2vmin)' }}>packet verified / lane sealed</div>
          </div>
        </div>
      </SafeFrame>
    </motion.div>
  );
}