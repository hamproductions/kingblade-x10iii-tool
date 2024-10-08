import type { DialogRootProps } from '@ark-ui/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { t } from 'i18next';
import { FaXmark } from 'react-icons/fa6';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { css } from 'styled-system/css';
import { Stack, Box } from 'styled-system/jsx';

export function QRScannerDialog(
  props: DialogRootProps & { onQrCodeScanned: (data: string) => void }
) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="8" p="6">
            <Stack gap="1">
              <Dialog.Title>{t(`scanner.title`)}</Dialog.Title>
              <Dialog.Description>{t(`scanner.description`)}</Dialog.Description>
              <Box display="block">
                {props.open && (
                  <Scanner
                    classNames={{
                      container: css({
                        aspectRatio: 1,
                        '& video': { objectFit: 'cover' },
                        '& svg': { maxWidth: 'full', maxHeight: 'full' }
                      })
                    }}
                    onScan={(results) => props.onQrCodeScanned(results[0].rawValue)}
                  />
                )}
              </Box>
            </Stack>
            <Stack gap="3" direction="row" width="full">
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" width="full">
                  {t('dialog.close')}
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
  );
}
