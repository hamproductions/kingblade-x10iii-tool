import { useTranslation } from 'react-i18next';

import { clientOnly } from 'vike-react/clientOnly';
import { useToaster } from '../../context/ToasterContext';

import { Box, Center, HStack, Stack } from 'styled-system/jsx';
import { Metadata } from '~/components/layout/Metadata';
import { Heading } from '~/components/ui/heading';
import { Text } from '~/components/ui/text';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
// import { AudioCodePlayer } from '~/components/AudioCodePlayer';
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
    </>
  );
}
