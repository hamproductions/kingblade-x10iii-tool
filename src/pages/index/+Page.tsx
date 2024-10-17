import { useTranslation } from 'react-i18next';

import { clientOnly } from 'vike-react/clientOnly';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import {
  FaCamera,
  FaCheck,
  FaChevronDown,
  FaFloppyDisk,
  FaPlus,
  FaQrcode,
  FaTrash,
  FaXmark
} from 'react-icons/fa6';
import { createListCollection } from '@ark-ui/react';

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
import type { Preset } from '~/types/preset';
import { Select } from '~/components/ui/select';
import { QRViewerDialog } from '~/components/dialog/QRViewerDialog';
import { CreatePresetDialog } from '~/components/dialog/SavePresetDialog';

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
  const { t } = useTranslation();
  const [colors, setColors] = useLocalStorage<string[]>('current-preset', DEFAULT_COLORS);
  const DEFAULT_PRESET = { name: t('default'), colors: DEFAULT_COLORS };

  const [currentPresetIdx, setCurrentPresetIdx] = useState<number>();
  const [presets, setPresets] = useLocalStorage<Preset[]>('presets', [DEFAULT_PRESET]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCreatePreset, setShowCreatePreset] = useState(false);
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

  const handleSavePreset = () => {
    if (currentPresetIdx === undefined || !presets?.[currentPresetIdx]) {
      setShowCreatePreset(true);
      return;
    }
    const currentPreset = presets[currentPresetIdx];
    if (!colors) return;
    setPresets((p) => {
      return p?.map((d, idx) =>
        idx === currentPresetIdx ? { name: currentPreset.name, colors } : d
      );
    });
  };

  const handleDeletePreset = () => {
    if (currentPresetIdx === undefined) return;

    setPresets((p) => p?.filter((_, idx) => idx !== currentPresetIdx));
    setCurrentPresetIdx(undefined);
  };

  const handleLoadPreset = () => {
    if (currentPresetIdx === undefined) return;
    const preset = presets?.[currentPresetIdx];
    if (!preset) return;
    setColors(preset.colors);
  };

  const presetItems = createListCollection({
    items: presets ?? [],
    itemToString: (item) => item.name,
    itemToValue: (item) => (presets ?? []).findIndex((i) => i.name === item.name).toString()
  });

  const handleCreatePreset = (name: string) => {
    if (!name || !colors || colors.length < 1) return;
    setPresets((p) => [...(p ?? []), { name, colors }]);
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

          <HStack justifyContent="center" alignItems="flex-end" width="100%" flexWrap="wrap">
            <Select.Root
              deselectable
              positioning={{ sameWidth: true }}
              value={currentPresetIdx !== undefined ? [currentPresetIdx.toString()] : []}
              onValueChange={({ value }) => {
                setCurrentPresetIdx(Number(value[0]));
              }}
              collection={presetItems}
            >
              <Select.Label>{t('select_preset')}</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder={t('select_a_preset')} />
                  <FaChevronDown />
                </Select.Trigger>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  <Select.ItemGroup>
                    {(presets ?? []).map((item, idx) => (
                      <Select.Item key={idx.toString()} item={item}>
                        <Select.ItemText>{item.name}</Select.ItemText>
                        <Select.ItemIndicator>
                          <FaCheck />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            <HStack>
              <Button disabled={currentPresetIdx === undefined} onClick={() => handleLoadPreset()}>
                {t('load_preset')}
              </Button>
              <Button onClick={() => handleSavePreset()}>
                <FaFloppyDisk />
                {currentPresetIdx === undefined ? t('create_preset') : t('save_preset')}
              </Button>
              <Button
                disabled={currentPresetIdx === undefined}
                onClick={() => handleDeletePreset()}
                variant="subtle"
              >
                <FaTrash /> {t('delete_preset')}
              </Button>
            </HStack>
          </HStack>

          <HStack>
            <Button onClick={() => setShowQRScanner(true)}>
              <FaCamera />
              {t('scan_qr_code')}
            </Button>
            <Button onClick={() => setShowQRCode(true)}>
              <FaQrcode />
              {t('show_qr_code')}
            </Button>
          </HStack>

          <AudioCodePlayer colors={colors ?? []} />
          <Heading as="h2" fontSize="lg">
            {t('color_settings')}
          </Heading>

          <Grid gridGap="2" gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))" w="full">
            {colors?.map((c, idx) => {
              const handleDelete: MouseEventHandler = (event) => {
                setColors((c) => c?.filter((_, currentIdx) => currentIdx !== idx));
                event.stopPropagation();
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
      <QRViewerDialog
        open={showQRCode}
        onOpenChange={({ open }) => {
          setShowQRCode(open);
        }}
        value={`Copyright RUIFAN\nKingblade x10iii\n${colors?.join('\n')}`}
      />
      <CreatePresetDialog
        open={showCreatePreset}
        onOpenChange={({ open }) => {
          setShowCreatePreset(open);
        }}
        onCreatePreset={handleCreatePreset}
      />
    </>
  );
}
