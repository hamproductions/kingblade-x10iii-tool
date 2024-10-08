import { useTranslation } from 'react-i18next';

import { clientOnly } from 'vike-react/clientOnly';
import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useToaster } from '../../context/ToasterContext';

import { Box, Center, HStack, Stack } from 'styled-system/jsx';
import { Metadata } from '~/components/layout/Metadata';
import { Heading } from '~/components/ui/heading';
import { Text } from '~/components/ui/text';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Dialog } from '~/components/ui/dialog';
import { IconButton } from '~/components/ui/icon-button';
import { css } from 'styled-system/css';

const AudioCodePlayer = clientOnly(() =>
  import('~/components/AudioCodePlayer').then((a) => a.AudioCodePlayer)
);

export function Page() {
  const { toast } = useToaster();
  const { t } = useTranslation();
  const [colors, setColors] = useLocalStorage<string[]>('current-colors', [
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
  ]);
  const [showQRScanner, setShowQRScanner] = useState(false);

  return (
    <>
      <Metadata title={t('title')} helmet />
      <Center>
        <Stack alignItems="center" w="full" maxWidth="breakpoint-lg">
          <Heading as="h1" fontSize="2xl">
            {t('title')}
          </Heading>
          <Text>{t('description')}</Text>
          <AudioCodePlayer colors={colors ?? []} />
          <Button onClick={() => setShowQRScanner(true)}>Scan QR Code</Button>
          <Heading as="h2" fontSize="lg">
            {t('color_settings')}
          </Heading>
          {colors?.map((c, idx) => {
            const handleDelete = () => {
              setColors((c) => c?.filter((_, currentIdx) => currentIdx !== idx));
            };
            return (
              <HStack key={idx}>
                <Box
                  style={{ backgroundColor: `#${c.slice(0, 6)}` }}
                  aspectRatio="1"
                  border="1px solid"
                  rounded="md"
                  width="10"
                />
                <Input
                  value={c}
                  maxLength={10}
                  pattern="/[0-9a-fA-F]{10}/"
                  onChange={(evt) => {
                    setColors((cur) => {
                      return cur?.map((a, id) => (idx === id ? evt.target.value : a));
                    });
                  }}
                />
                <Button onClick={handleDelete}>{t('delete')}</Button>
              </HStack>
            );
          })}
          <Button onClick={() => setColors((c) => [...(c ?? []), '0000000000'])}>
            {t('new_card')}
          </Button>
        </Stack>
      </Center>
      <Dialog.Root open={showQRScanner} onOpenChange={() => setShowQRScanner(false)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>{t(`scanner.title`)}</Dialog.Title>
                <Dialog.Description>{t(`scanner.description`)}</Dialog.Description>
                <Box display="block">
                  {showQRScanner && (
                    <Scanner
                      classNames={{
                        container: css({
                          aspectRatio: 1,
                          '& video': { objectFit: 'cover' },
                          '& svg': { maxWidth: 'full', maxHeight: 'full' }
                        })
                      }}
                      onScan={(results) => console.log(results)}
                    />
                  )}
                </Box>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline" width="full">
                    {t('dialog.cancel')}
                  </Button>
                </Dialog.CloseTrigger>
              </Stack>
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
