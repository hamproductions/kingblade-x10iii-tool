import { useTranslation } from 'react-i18next';

import { clientOnly } from 'vike-react/clientOnly';
import { useState } from 'react';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { useToaster } from '../../context/ToasterContext';

import { Box, Center, Grid, HStack, Stack } from 'styled-system/jsx';
import { Metadata } from '~/components/layout/Metadata';
import { Heading } from '~/components/ui/heading';
import { Text } from '~/components/ui/text';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Button } from '~/components/ui/button';
import { IconButton } from '~/components/ui/icon-button';
import { QRScannerDialog } from '~/components/dialog/QRScannerDialog';
import { EditColorDialog } from '~/components/dialog/EditColorDialog';
import { colorsToHex } from '~/utils/colors';

const AudioCodePlayer = clientOnly(() =>
  import('~/components/AudioCodePlayer').then((a) => a.AudioCodePlayer)
);

const DEFAULT_COLORS = [
  'ff00000000',
  '0000ff0000',
  '000000ff00',
  'ff23000000',
  '00ff000000',
  '1e00ff0000',
  'ff004b0000',
  '93b9000000',
  '00a8140000',
  '00c6ae0700',
  'ff2f4d0000',
  '5000d30000',
  '57ff000000',
  '00ff5e0c00',
  'ff00110000'
];
export function Page() {
  const { toast } = useToaster();
  const { t } = useTranslation();
  const [colors, setColors] = useLocalStorage<string[]>('current-colors', DEFAULT_COLORS);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [editColorIndex, setEditColorIndex] = useState<number>();

  const handleQRCodeScanned = (data: string) => {
    if (!data.startsWith('Copyright RUIFAN')) {
      return;
    }

    setColors(
      data
        .trim()
        .split('\n')
        .slice(2)
        .map((c) => c.trim().toLowerCase())
    );
    setShowQRScanner(false);
  };

  const handleSetDefaultColors = () => {
    return setColors(DEFAULT_COLORS);
  };

  const handleSavePreset = () => {
    return toast?.(t('not_implemented'));
  };
  return (
    <>
      <Metadata title={t('title')} helmet />
      <Center>
        <Stack alignItems="center" w="full" maxWidth="breakpoint-lg">
          <Heading as="h1" fontSize="2xl">
            {t('title')}
          </Heading>
          <Text>{t('description')}</Text>

          <HStack>
            <Button onClick={() => handleSetDefaultColors()}>{t('set_default_colors')}</Button>
            <Button onClick={() => handleSavePreset()}>{t('save_preset')}</Button>
            <Button onClick={() => setShowQRScanner(true)}>{t('scan_qr_code')}</Button>
          </HStack>
          <AudioCodePlayer colors={colors ?? []} />
          <Heading as="h2" fontSize="lg">
            {t('color_settings')}
          </Heading>
          <Grid gridGap="2" gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))" w="full">
            {colors?.map((c, idx) => {
              const handleDelete = () => {
                setColors((c) => c?.filter((_, currentIdx) => currentIdx !== idx));
              };
              return (
                <Stack
                  className="group"
                  onClick={() => setEditColorIndex(idx)}
                  key={idx}
                  position="relative"
                  fontSize="sm"
                >
                  <HStack
                    display={{ base: 'none', _groupHover: 'block' }}
                    position="absolute"
                    top="0"
                    right="0"
                    justifyContent="flex-end"
                  >
                    <IconButton variant="ghost" onClick={handleDelete}>
                      <FaXmark />
                    </IconButton>
                  </HStack>
                  <Box
                    style={{ backgroundColor: colorsToHex(c) }}
                    aspectRatio="1"
                    border="1px solid"
                    borderColor="border.default"
                    rounded="md"
                  />
                  <Text textWrap="nowrap">
                    {idx + 1}. {c}
                  </Text>
                </Stack>
              );
            })}
            <Center>
              <Button
                onClick={() => setColors((c) => [...(c ?? []), '0000000000'])}
                aspectRatio="1"
              >
                <FaPlus />
              </Button>
            </Center>
          </Grid>
        </Stack>
      </Center>
      <QRScannerDialog
        open={showQRScanner}
        onOpenChange={() => setShowQRScanner(false)}
        onQrCodeScanned={handleQRCodeScanned}
      />
      {editColorIndex !== undefined && colors?.[editColorIndex] && (
        <EditColorDialog
          open={editColorIndex !== undefined}
          onOpenChange={({ open }) => {
            if (!open) setEditColorIndex(undefined);
          }}
          onColorChange={(newColor) => {
            setColors((e) => {
              return e?.map((c, idx) => {
                return idx === editColorIndex ? newColor : c;
              });
            });
          }}
          color={colors[editColorIndex]}
        />
      )}
    </>
  );
}
