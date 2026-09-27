import { ChevronDown, ChevronUp, LockKeyhole, Pause, Play, Repeat } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const SCENE_DETAILS: Record<string, { title: string; filePath: string }> = {
  intro: {
    title: 'Bounded intelligence',
    filePath: 'src/components/video/video_scenes/Scene1.tsx',
  },
  sites: {
    title: 'Two isolated sites',
    filePath: 'src/components/video/video_scenes/Scene2.tsx',
  },
  fleet: {
    title: 'Scoped agent fleet',
    filePath: 'src/components/video/video_scenes/Scene3.tsx',
  },
  approval: {
    title: 'Human approval gate',
    filePath: 'src/components/video/video_scenes/Scene4.tsx',
  },
  audit: {
    title: 'Audit ledger',
    filePath: 'src/components/video/video_scenes/Scene5.tsx',
  },
  close: {
    title: 'Safety posture',
    filePath: 'src/components/video/video_scenes/Scene6.tsx',
  },
};

function announceSceneSelection(index: number, sceneKeys: string[]) {
  const key = sceneKeys[index];
  const details = SCENE_DETAILS[key];
  if (!details?.filePath) return;

  window.parent.postMessage(
    {
      type: 'REPLIT_VIDEO_SCENE_SELECTED',
      payload: {
        sceneIndex: index,
        sceneCount: sceneKeys.length,
        sceneTitle: details.title || key,
        filePath: details.filePath,
        lineNumber: 1,
      },
    },
    '*',
  );
}

export default function VideoWithControls() {
  const isIframed =
    typeof window !== 'undefined' && window.self !== window.top;
  const {
    sceneKeys,
    activeIndex,
    locked,
    paused,
    mountKey,
    tick,
    durations,
    activeDuration,
    activeStartTime,
    totalDuration,
    onSceneChange,
    jumpTo,
    toggleLock,
    togglePause,
  } = useSceneControls(SCENE_DURATIONS);
  const sensorRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);

  useEffect(() => {
    if (!paused) return;
    const runningAnimations = document
      .getAnimations()
      .filter((animation) => animation.playState === 'running');
    runningAnimations.forEach((animation) => animation.pause());
    return () => runningAnimations.forEach((animation) => animation.play());
  }, [paused]);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      if (!sensorRef.current?.contains(event.target as Node)) {
        setTapPinned(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [collapsed, tapPinned]);

  const handleJumpTo = useCallback(
    (index: number) => {
      jumpTo(index);
      announceSceneSelection(index, sceneKeys);
    },
    [jumpTo, sceneKeys],
  );

  const handleToggleCollapsed = useCallback(() => {
    setCollapsed((value) => {
      if (!value) {
        setHovering(false);
        setTapPinned(false);
      }
      return !value;
    });
  }, []);

  if (!isIframed) return <VideoTemplate />;

  const barVisible = !collapsed || hovering || tapPinned;

  return (
    <div className="relative h-screen w-full">
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        paused={paused}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end"
        style={{ height: '25%' }}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setHovering(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setHovering(false);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' && collapsed) setTapPinned(true);
        }}
      >
        <div className="min-h-0 flex-1" aria-hidden="true" />
        <ControlBar
          visible={barVisible}
          collapsed={collapsed}
          locked={locked}
          paused={paused}
          sceneKeys={sceneKeys}
          activeIndex={activeIndex}
          activeDuration={activeDuration}
          activeStartTime={activeStartTime}
          totalDuration={totalDuration}
          tick={tick}
          onTogglePause={togglePause}
          onToggleLock={toggleLock}
          onJumpTo={handleJumpTo}
          onToggleCollapsed={handleToggleCollapsed}
        />
      </div>
    </div>
  );
}

interface ControlBarProps {
  visible: boolean;
  collapsed: boolean;
  locked: boolean;
  paused: boolean;
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  onTogglePause: () => void;
  onToggleLock: () => void;
  onJumpTo: (index: number) => void;
  onToggleCollapsed: () => void;
}

function ControlBar({
  visible,
  collapsed,
  locked,
  paused,
  sceneKeys,
  activeIndex,
  activeDuration,
  activeStartTime,
  totalDuration,
  tick,
  onTogglePause,
  onToggleLock,
  onJumpTo,
  onToggleCollapsed,
}: ControlBarProps) {
  return (
    <div
      className={`video-control-bar ${visible ? 'video-control-bar--visible' : ''}`}
      aria-hidden={!visible}
    >
      <button
        className="video-control-button"
        onClick={onTogglePause}
        title={paused ? 'Play' : 'Pause'}
        aria-label={paused ? 'Play' : 'Pause'}
      >
        {paused ? <Play size={22} /> : <Pause size={22} />}
      </button>
      <button
        className={`video-control-button ${locked ? 'video-control-button--active' : ''}`}
        onClick={onToggleLock}
        title={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-label={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-pressed={locked}
      >
        <Repeat size={22} />
      </button>
      <div className="video-control-divider" aria-hidden="true" />
      <PlaybackStatus
        sceneKeys={sceneKeys}
        activeIndex={activeIndex}
        activeDuration={activeDuration}
        activeStartTime={activeStartTime}
        totalDuration={totalDuration}
        tick={tick}
        paused={paused}
        onJumpTo={onJumpTo}
      />
      <button
        className="video-control-button"
        onClick={onToggleCollapsed}
        title={collapsed ? 'Show controls' : 'Hide controls'}
        aria-label={collapsed ? 'Show controls' : 'Hide controls'}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
    </div>
  );
}

function PlaybackStatus({
  sceneKeys,
  activeIndex,
  activeDuration,
  activeStartTime,
  totalDuration,
  tick,
  paused,
  onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  paused: boolean;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const elapsedBaseRef = useRef(0);

  useEffect(() => {
    setElapsed(0);
    elapsedBaseRef.current = 0;
  }, [tick]);

  useEffect(() => {
    if (paused) return;
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setElapsed(
        elapsedBaseRef.current + (performance.now() - startedAt),
      );
    }, 60);
    return () => {
      window.clearInterval(interval);
      elapsedBaseRef.current += performance.now() - startedAt;
    };
  }, [paused, tick]);

  const progress =
    activeDuration > 0 ? Math.min(1, elapsed / activeDuration) : 0;
  const totalElapsed = Math.min(
    totalDuration,
    activeStartTime + Math.min(elapsed, activeDuration),
  );

  return (
    <>
      <div className="video-control-progress">
        {sceneKeys.map((key, index) => (
          <button
            key={key}
            className="video-control-segment"
            onClick={() => onJumpTo(index)}
            aria-label={`Jump to scene ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <span
              className="video-control-segment__fill"
              style={{
                width: `${index === activeIndex ? progress * 100 : 0}%`,
              }}
            />
          </button>
        ))}
      </div>
      <div className="video-control-counter">
        {activeIndex + 1}/{sceneKeys.length}
      </div>
      <div className="video-control-time" role="timer">
        {formatPlaybackTime(totalElapsed)} / {formatPlaybackTime(totalDuration)}
      </div>
    </>
  );
}

function formatPlaybackTime(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}