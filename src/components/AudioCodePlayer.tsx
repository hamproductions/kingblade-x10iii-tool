import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import { Button } from './ui/button';
import { HStack } from 'styled-system/jsx';
import { generateAudioFile } from '~/utils/kbx3wave';

export function AudioCodePlayer(props: { colors: string[] }) {
  const playerRef = useRef<HTMLAudioElement>(null);
  const { colors } = props;
  const [audioFile, setAudioFile] = useState<string>();
  const { t } = useTranslation();

  const createAudioFile = debounce(() => {
    const buffer = new Blob([generateAudioFile(colors ?? [], { bitDepth: '16' })]);
    setAudioFile(URL.createObjectURL(buffer));

    return buffer;
  }, 100);

  useEffect(() => {
    createAudioFile();
    return () => {
      if (!audioFile) return;
      URL.revokeObjectURL(audioFile);
    };
  }, [colors]);

  const playAudio = async () => {
    const player = playerRef.current;
    if (!player) return;
    player.volume = 0.5;
    console.log('PLAY!!!', player.volume);
    player.currentTime = 0;
    await player.play();
  };

  const stopAudio = () => {
    const player = playerRef.current;
    if (!player) return;
    player.pause();
  };

  return (
    <>
      {audioFile && (
        <>
          <audio ref={playerRef}>
            <source src={audioFile} type="audio/wav" />
            <track kind="captions" />
          </audio>
          <HStack>
            <Button
              onClick={() => {
                void playAudio();
              }}
            >
              {t('install_to_kingblade')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                stopAudio();
              }}
            >
              {t('stop')}
            </Button>
          </HStack>
        </>
      )}
    </>
  );
}
