import { FaXmark } from 'react-icons/fa6';
import type { DialogRootProps } from '@ark-ui/react';
import { debounce, padStart } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { FormLabel } from '../ui/form-label';
import { Box, HStack, Stack } from 'styled-system/jsx';
import { colorsToHex, splitRGBW } from '~/utils/colors';
import { generateAudioFile } from '~/utils/kbx3wave';

export function EditColorDialog(
  props: DialogRootProps & { color: string; onColorChange: (newColor: string) => void }
) {
  const playerRef = useRef<HTMLAudioElement>(null);

  const { color, onColorChange, onOpenChange } = props;
  const [tmpColor, setTmpColor] = useState(color);
  const [previewAudio, setPreviewAudio] = useState<string>();
  const { t } = useTranslation();

  useEffect(() => {
    setTmpColor(color);
  }, [color]);

  const [r, g, b, w] = splitRGBW(tmpColor);

  const handleSave = () => {
    onColorChange(tmpColor);
    onOpenChange?.({ open: false });
  };

  const createAudioFile = debounce(() => {
    const buffer = new Blob([generateAudioFile([tmpColor], { preview: true })]);
    setPreviewAudio(URL.createObjectURL(buffer));
    console.log('NEW FILE!');
  }, 100);

  useEffect(() => {
    createAudioFile();

    return () => {
      if (!previewAudio) return;
      URL.revokeObjectURL(previewAudio);
    };
  }, [tmpColor]);

  const playAudio = async () => {
    const player = playerRef.current;
    if (!player) return;
    console.log('PLAY!');
    player.currentTime = 0;
    await player.play();
    player.volume = 1;
  };

  const stopAudio = () => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = 0;
    player.pause();
  };

  return (
    <>
      <Dialog.Root {...props}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>{t(`edit_color.title`)}</Dialog.Title>
                <Dialog.Description>{t(`edit_color.description`)}</Dialog.Description>
                <Input value={color} onChange={(e) => setTmpColor(e.target.value)} />
                <Box
                  style={{ backgroundColor: colorsToHex(tmpColor) }}
                  aspectRatio="1"
                  border="1px solid"
                  borderColor="border.default"
                  rounded="md"
                />
                <Stack>
                  <Stack>
                    <FormLabel>
                      {t('red')}: {r}
                    </FormLabel>
                    <Slider
                      value={[r]}
                      min={0}
                      step={1}
                      max={255}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 128, label: '128' },
                        { value: 255, label: '255' }
                      ]}
                      onValueChange={({ value }) => {
                        setTmpColor(
                          padStart(Number(value[0]).toString(16), 2, '0') + tmpColor.slice(2)
                        );
                      }}
                      mb={4}
                    />
                  </Stack>
                  <Stack>
                    <FormLabel>
                      {t('green')}: {g}
                    </FormLabel>
                    <Slider
                      value={[g]}
                      min={0}
                      max={255}
                      step={1}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 128, label: '128' },
                        { value: 255, label: '255' }
                      ]}
                      onValueChange={({ value }) => {
                        setTmpColor(
                          tmpColor.slice(0, 2) +
                            padStart(Number(value[0]).toString(16), 2, '0') +
                            tmpColor.slice(4)
                        );
                      }}
                      mb={4}
                    />
                  </Stack>
                  <Stack>
                    <FormLabel>
                      {t('blue')}: {b}
                    </FormLabel>
                    <Slider
                      value={[b]}
                      min={0}
                      step={1}
                      max={255}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 128, label: '128' },
                        { value: 255, label: '255' }
                      ]}
                      onValueChange={({ value }) => {
                        onColorChange(
                          tmpColor.slice(0, 4) +
                            padStart(Number(value[0]).toString(16), 2, '0') +
                            tmpColor.slice(6)
                        );
                      }}
                      mb={4}
                    />
                  </Stack>
                  <Stack>
                    <FormLabel>
                      {t('white')}: {w}
                    </FormLabel>
                    <Slider
                      value={[w]}
                      min={0}
                      step={1}
                      max={255}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 128, label: '128' },
                        { value: 255, label: '255' }
                      ]}
                      onValueChange={({ value }) => {
                        onColorChange(
                          tmpColor.slice(0, 6) +
                            padStart(Number(value[0]).toString(16), 2, '0') +
                            tmpColor.slice(8)
                        );
                      }}
                      mb={4}
                    />
                  </Stack>
                </Stack>
              </Stack>
              {previewAudio && (
                <>
                  <audio ref={playerRef}>
                    <source src={previewAudio} type="audio/wav" />
                    <track kind="captions" />
                  </audio>
                  <HStack>
                    <Button
                      onClick={() => {
                        void playAudio();
                      }}
                    >
                      {t('preview_color')}
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
              <HStack gap="3" width="full" direction="row">
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline" width="full">
                    {t('dialog.close')}
                  </Button>
                </Dialog.CloseTrigger>
                <Button onClick={handleSave} width="full">
                  {t('edit_color.save')}
                </Button>
              </HStack>
            </Stack>
            <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
              <IconButton aria-label="Close Dialog" variant="ghost" size="sm">
                <FaXmark />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}
