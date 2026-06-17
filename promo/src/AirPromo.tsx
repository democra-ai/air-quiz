import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { C, type Lang } from './theme';
import { SCENES, sceneFrames, LEAD, POSTER, totalFrames } from './scenes';
import { SceneSwitch, Poster } from './SceneViews';

export const AirPromo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const total = totalFrames(lang);
  let start = POSTER;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {/* light BGM bed — fade in/out at the video edges */}
      <Audio
        src={staticFile('audio/bgm.mp3')}
        volume={(f) =>
          interpolate(f, [0, 18, total - 40, total], [0, 0.12, 0.12, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      {/* opening cover poster (no VO) */}
      <Sequence from={0} durationInFrames={POSTER} name="poster">
        <Poster lang={lang} />
      </Sequence>
      {SCENES.map((s, i) => {
        const dur = sceneFrames(s, lang);
        const from = start;
        start += dur;
        const caption = lang === 'en' ? s.captionEn : s.captionZh;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={`${s.id}-${s.visualType}`}>
            <SceneSwitch id={s.visualType} lang={lang} dur={dur} caption={caption} />
            <Sequence from={LEAD}>
              <Audio src={staticFile(`audio/${lang}/scene-${String(i + 1).padStart(2, '0')}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
      {/* global atmosphere — paper grain + vignette for depth (over all scenes) */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply' }}>
          <filter id="paperGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#paperGrain)" />
        </svg>
        <AbsoluteFill style={{ boxShadow: 'inset 0 0 360px rgba(31,24,20,0.14)' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
