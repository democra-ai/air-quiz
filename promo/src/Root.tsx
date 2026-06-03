import { Composition } from 'remotion';
import { AirPromo } from './AirPromo';
import { FPS, WIDTH, HEIGHT, totalFrames } from './scenes';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AirPromoEN"
        component={AirPromo}
        durationInFrames={totalFrames('en')}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ lang: 'en' as const }}
      />
      <Composition
        id="AirPromoZH"
        component={AirPromo}
        durationInFrames={totalFrames('zh')}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ lang: 'zh' as const }}
      />
    </>
  );
};
