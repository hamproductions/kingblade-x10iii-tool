import { FaXmark } from 'react-icons/fa6';
import type { DialogRootProps } from '@ark-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { HStack, Stack } from 'styled-system/jsx';

export function CreatePresetDialog(
  props: DialogRootProps & { onCreatePreset: (name: string) => void }
) {
  const { onCreatePreset } = props;
  const [name, setName] = useState('Preset Name');
  const { t } = useTranslation();

  const handleCreatePreset = () => {
    onCreatePreset(name);
    setName('');
  };

  return (
    <>
      <Dialog.Root {...props}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>{t(`create_preset_dialog.title`)}</Dialog.Title>
                <Dialog.Description>{t(`create_preset_dialog.description`)}</Dialog.Description>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Stack>
              <HStack gap="3" width="full" direction="row">
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline" width="full">
                    {t('dialog.close')}
                  </Button>
                </Dialog.CloseTrigger>
                <Button onClick={handleCreatePreset} width="full">
                  {t('create_preset_dialog.save')}
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
