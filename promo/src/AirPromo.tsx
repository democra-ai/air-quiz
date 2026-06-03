import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { C, type Lang } from './theme';
import { SCENES, sceneFrames, LEAD, totalFrames } from './scenes';
import { SceneSwitch } from './SceneViews';

export const AirPromo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const total = totalFrames(lang);
  let start = 0;
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
      {SCENES.map((s) => {
        const dur = sceneFrames(s, lang);
        const from = start;
        start += dur;
        const caption = lang === 'en' ? s.captionEn : s.captionZh;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <SceneSwitch id={s.id} lang={lang} dur={dur} caption={caption} />
            <Sequence from={LEAD}>
              <Audio src={staticFile(`audio/vo-${lang}-${s.id}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
