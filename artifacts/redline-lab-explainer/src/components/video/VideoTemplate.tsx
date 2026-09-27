import {
  SafeFrame,
  VideoCanvas,
  VideoPausedContext,
  type VideoAspectRatio,
  useVideoPlayer,
} from '@/lib/video';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect, type ComponentType } from 'react';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS = {
  intro: 4800,
  sites: 4300,
  fleet: 4700,
  approval: 4400,
  audit: 4600,
  close: 5200,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';

const SCENE_COMPONENTS: Record<string, ComponentType> = {
  intro: Scene1,
  sites: Scene2,
  fleet: Scene3,
  approval: Scene4,
  audit: Scene5,
  close: Scene6,
};

export interface VideoTemplateProps {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  onSceneChange?: (sceneKey: string) => void;
}

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  onSceneChange,
}: VideoTemplateProps = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({
    durations,
    loop,
    paused,
  });
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Math.max(
    0,
    Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey),
  );
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas
        aspectRatio={VIDEO_ASPECT_RATIO}
        className="video-root"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <PersistentAtmosphere currentScene={sceneIndex} />
        <AnimatePresence mode="sync">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </VideoCanvas>
    </VideoPausedContext.Provider>
  );
}

function PersistentAtmosphere({ currentScene }: { currentScene: number }) {
  const accentPositions = [
    { left: '78%', top: '22%', scale: 1.2 },
    { left: '18%', top: '27%', scale: .8 },
    { left: '84%', top: '72%', scale: 1.45 },
    { left: '35%', top: '78%', scale: .92 },
    { left: '68%', top: '18%', scale: 1.05 },
    { left: '50%', top: '23%', scale: .7 },
  ];
  const position = accentPositions[currentScene] ?? accentPositions[0];

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'linear-gradient(125deg, #eee9df 0%, #e7e1d6 50%, #efeade 100%)',
        }}
        animate={{ backgroundPosition: [`${currentScene * 7}% ${currentScene * 4}%`, `${currentScene * 7 + 5}% ${currentScene * 4 + 7}%`] }}
        transition={{ duration: 7, ease: 'easeInOut' }}
      />
      <motion.img
        aria-hidden="true"
        src={`${import.meta.env.BASE_URL}atlas-grid.png`}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: .12, x: currentScene % 2 ? '-1.5%' : '1.5%', y: currentScene % 3 ? '1%' : '-1%' }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '-10%',
          width: '120%',
          height: '120%',
          objectFit: 'cover',
          mixBlendMode: 'multiply',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div aria-hidden="true" className="scan-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: .27, pointerEvents: 'none' }} />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '25vmin',
          height: '25vmin',
          borderRadius: '50%',
          border: '1px solid rgba(46,119,113,.3)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        animate={{ left: position.left, top: position.top, scale: position.scale, rotate: currentScene * 11 }}
        transition={{ duration: 1.35, ease: [0.16, 1, .3, 1] }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1.1vmin',
          height: '1.1vmin',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        animate={{ left: `calc(${position.left} + 11vmin)`, top: `calc(${position.top} + 12.5vmin)`, scale: [1, 1.35, 1] }}
        transition={{ left: { duration: 1.35, ease: [0.16, 1, .3, 1] }, top: { duration: 1.35, ease: [0.16, 1, .3, 1] }, scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <SafeFrame style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: '5vmin', left: '6vmin', right: '6vmin' }}>
          <div className="lab-mark">
            <div className="lab-mark__glyph"><div className="lab-mark__core" /></div>
            <div>
              <div className="display" style={{ fontSize: 'clamp(.68rem, 1.55vmin, 1.2rem)' }}>REDLINE LAB</div>
              <div className="micro muted" style={{ marginTop: '.55vmin' }}>console / v1.4.0</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="micro teal">live frame / 06 beats</div>
            <div className="micro muted" style={{ marginTop: '.65vmin' }}>LOCAL SESSION / 09:42 UTC</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '4vmin', left: '6vmin', right: '6vmin', display: 'flex', alignItems: 'center', gap: '1vmin' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div key={index} animate={{ opacity: index === currentScene ? 1 : .26, scaleX: index === currentScene ? 1 : .6 }} transition={{ duration: .4 }} style={{ height: '.45vmin', flex: 1, background: index === currentScene ? 'var(--color-primary)' : 'var(--color-text-primary)', transformOrigin: index < currentScene ? 'right' : 'left' }} />
          ))}
          <span className="micro muted" style={{ marginLeft: '1.2vmin' }}>RL / {String(currentScene + 1).padStart(2, '0')}</span>
        </div>
      </SafeFrame>
    </>
  );
}
