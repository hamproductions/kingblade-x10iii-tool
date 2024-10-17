import type { DialogRootProps } from '@ark-ui/react';
import { t } from 'i18next';
import { FaXmark } from 'react-icons/fa6';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { QrCode } from '../ui/qr-code';
import { Stack } from 'styled-system/jsx';

export function QRViewerDialog(props: DialogRootProps & { value: string }) {
  const { value, ...rest } = props;
  return (
    <Dialog.Root {...rest}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="8" p="6">
            <Stack gap="1">
              <Dialog.Title>{t(`scanner.title`)}</Dialog.Title>
              <Dialog.Description>{t(`scanner.description`)}</Dialog.Description>
              <QrCode.Root value={value} bgColor="white">
                <QrCode.Frame>
                  <QrCode.Pattern />
                </QrCode.Frame>
              </QrCode.Root>
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
