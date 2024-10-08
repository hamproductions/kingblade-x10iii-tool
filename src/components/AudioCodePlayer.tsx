import { useState, useEffect } from 'react';
import { generateAudioFile } from '~/utils/kbx3wave';

export function AudioCodePlayer(props: { colors: string[] }) {
  const { colors } = props;
  const [audioFile, setAudioFile] = useState<string>();

  useEffect(() => {
    const buffer = new Blob([generateAudioFile(colors ?? [])]);
    setAudioFile(URL.createObjectURL(buffer));
    console.log(buffer);
  }, [colors]);

  return (
    audioFile && (
      <audio controls>
        <source src={audioFile} type="audio/wav" />
        <track kind="captions" />
      </audio>
    )
  );
}
