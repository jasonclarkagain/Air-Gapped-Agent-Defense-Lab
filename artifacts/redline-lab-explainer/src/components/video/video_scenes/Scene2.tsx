import { motion } from 'framer-motion';
import { SafeFrame, VideoText } from '@/lib/video';

const siteData = [
  { site: 'UTAH', name: 'Utah dual air-gap lab', note: 'Evidence collection', tone: '#a57c22', gates: ['01', '02'] },
  { site: 'NEVADA', name: 'Nevada triple air-gap lab', note: 'Controlled adversarial research', tone: '#2e7771', gates: ['01', '02', '03'] },
];

export function Scene2() {
  return (
    <motion.div className="scene-shell" initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(100% at 50% 50%)' }} exit={{ clipPath: 'circle(0% at 85% 12%)' }} transition={{ duration: 1.1, ease: [0.16, 1, .3, 1] }}>
      <SafeFrame className="scene-content">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .5 }} className="eyebrow muted" style={{ position: 'absolute', top: '7vmin', left: '6vmin' }}>01 / topology</motion.div>
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .36, duration: .6 }} style={{ position: 'absolute', top: '14vmin', left: '6vmin', zIndex: 3 }}>
          <VideoText as="h2" scale="heading" className="display ink" style={{ fontWeight: 600, letterSpacing: '-.065em' }}>Two labs.<br /><span className="teal">Deliberately separate.</span></VideoText>
        </motion.div>
        <div style={{ position: 'absolute', inset: '31vmin 6vmin 7vmin', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vmin' }}>
          {siteData.map((data, index) => (
            <motion.div key={data.site} className="dark-card" initial={{ opacity: 0, y: 35, rotate: index === 0 ? -2 : 2 }} animate={{ opacity: 1, y: 0, rotate: index === 0 ? -1.2 : 1.2 }} transition={{ delay: .55 + index * .22, duration: .72, ease: [0.16, 1, .3, 1] }} style={{ position: 'relative', padding: '4vmin', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: '2.2vmin', border: `1px solid ${data.tone}66` }} />
              <div style={{ position: 'absolute', right: '5vmin', top: '4vmin', color: data.tone, fontSize: 'clamp(1rem, 2.3vmin, 2rem)' }} className="mono">{data.site === 'UTAH' ? '02' : '03'}×</div>
              <div className="eyebrow" style={{ color: data.tone }}>{data.site} / isolated site</div>
              <div className="display" style={{ fontSize: 'clamp(1.3rem, 3vmin, 2.7rem)', lineHeight: 1, letterSpacing: '-.055em', marginTop: '4.6vmin', maxWidth: '29vmin' }}>{data.name}</div>
              <div className="muted" style={{ fontSize: 'clamp(.6rem, 1.2vmin, .95rem)', marginTop: '1.6vmin' }}>{data.note}</div>
              <div style={{ position: 'absolute', left: '4vmin', right: '4vmin', bottom: '4vmin' }}>
                <div className="micro muted" style={{ marginBottom: '1.5vmin' }}>air-gap chain</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.1vmin' }}>
                  {data.gates.map((gate, gateIndex) => (
                    <div key={gate} style={{ display: 'flex', alignItems: 'center', gap: '1.1vmin', flex: gateIndex === data.gates.length - 1 ? '0 0 auto' : 1 }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .9 + index * .15 + gateIndex * .12, type: 'spring', stiffness: 260, damping: 18 }} style={{ width: '2.8vmin', height: '2.8vmin', border: `1px solid ${data.tone}`, color: data.tone, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 'clamp(.45rem, .82vmin, .65rem)' }} className="mono">{gate}</motion.div>
                      {gateIndex < data.gates.length - 1 && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1 + gateIndex * .12, duration: .45 }} className="rule" style={{ flex: 1, color: data.tone, transformOrigin: 'left' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="micro orange" style={{ position: 'absolute', right: '6vmin', top: '15vmin' }}>no shared lane / no implied trust</motion.div>
      </SafeFrame>
    </motion.div>
  );
}