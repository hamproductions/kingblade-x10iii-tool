import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';
import { useToaster } from '../../context/ToasterContext';

import { Center, Divider, HStack, Stack } from 'styled-system/jsx';
import { Metadata } from '~/components/layout/Metadata';
import { Heading } from '~/components/ui/heading';
import { Text } from '~/components/ui/text';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { NumberInput } from '~/components/ui/number-input';
import { FormLabel } from '~/components/ui/form-label';
import { Slider } from '~/components/ui/slider';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { RadioGroup } from '~/components/ui/radio-group';
import { Checkbox } from '~/components/ui/checkbox';
import { calculateCardUse } from '~/utils';

type Card = {
  enabled: boolean;
  name: string;
  mentalPercentChange: number;
  mood: 'neutral' | 'happy' | 'mellow';
};

const calculateMoodEffect = (card: Card, moodValue: number) => {
  const { mood, mentalPercentChange } = card;
  if (mood === 'neutral') {
    return (mentalPercentChange / 100) * (1 + (Math.abs(moodValue) * 0.25) / 100);
  } else if ((mood === 'happy' && moodValue >= 0) || (mood === 'mellow' && moodValue <= 0)) {
    return (mentalPercentChange / 100) * (1 + (Math.abs(moodValue) * 0.5) / 100);
  } else {
    return mentalPercentChange / 100;
  }
};

export function Page() {
  const { toast } = useToaster();
  const { t } = useTranslation();
  const [cards, setCards] = useLocalStorage<Card[]>('owned-cards', []);
  const [maxMental, setMaxMental] = useLocalStorage<number>('max-mental', 400);
  const [currentMental, setCurrentMental] = useLocalStorage<number>('current-mental', 110);
  const [targetMentalPercent, setTargetMentalPercent] = useLocalStorage<number>('target-mental', 1);
  const [currentMoodValue, setCurrentMoodValue] = useLocalStorage<number>('current-mood', 0);

  const handleAddCard = () => {
    setCards((c) => {
      return [...(c ?? []), { enabled: true, name: '', mentalPercentChange: 0, mood: 'neutral' }];
    });
  };

  const results = useMemo(() => {
    const data = cards
      ?.filter((c) => c.enabled)
      .map((c) => ({
        name: c.name,
        value: Math.round((calculateMoodEffect(c, currentMoodValue ?? 0) ?? 0) * (maxMental ?? 0))
      }));
    const res = calculateCardUse(
      data ?? [],
      currentMental ?? 0,
      (targetMentalPercent ?? 1) * (maxMental ?? 0)
    );

    return res;
  }, [cards, maxMental, currentMental, currentMoodValue]);
  return (
    <>
      <Metadata title={t('title')} helmet />
      <Center>
        <Stack alignItems="center" w="full" maxWidth="breakpoint-lg">
          <Heading as="h1" fontSize="2xl">
            {t('title')}
          </Heading>
          <Text>{t('description')} </Text>
          <Heading as="h2" fontSize="lg">
            {t('settings')}
          </Heading>
          <HStack alignItems="flex-start">
            <Stack>
              <FormLabel>{t('current_mental')}</FormLabel>
              <NumberInput
                value={`${currentMental ?? 0}`}
                min={0}
                max={maxMental ?? 100}
                onValueChange={({ value }) => setCurrentMental(Number(value))}
              />
            </Stack>
            <Stack>
              <FormLabel>{t('max_mental')}</FormLabel>
              <NumberInput
                value={`${maxMental ?? 0}`}
                min={0}
                step={0.1}
                onValueChange={({ value }) => setMaxMental(Number(value))}
              />
            </Stack>
            <Stack>
              <FormLabel>{t('target_mental')}</FormLabel>
              <NumberInput
                value={`${(targetMentalPercent ?? 0) * 100}`}
                min={0}
                max={100}
                onValueChange={({ value }) => setTargetMentalPercent(Number(value) / 100)}
              />
              {(targetMentalPercent ?? 0) * (maxMental ?? 0)} {t('mental')}
            </Stack>
          </HStack>
          <HStack w="full">
            <Stack w="full">
              <FormLabel>{t('current_mood')}</FormLabel>
              <HStack>
                <Slider
                  value={[currentMoodValue ?? 0]}
                  min={-150}
                  max={150}
                  marks={[
                    { value: -150, label: '-150' },
                    { value: 0, label: '0' },
                    { value: 150, label: '150' }
                  ]}
                  onValueChange={({ value }) => setCurrentMoodValue(Number(value[0]))}
                />
                <NumberInput
                  value={`${currentMoodValue ?? 0}`}
                  min={0}
                  max={150}
                  onValueChange={({ value }) => setCurrentMoodValue(Number(value))}
                />
              </HStack>
            </Stack>
          </HStack>
          <Heading as="h2" fontSize="lg">
            {t('cards_settings')}
          </Heading>
          {cards?.map((c, idx) => {
            const handleValueChange = (newData: Card) => {
              setCards((old) => {
                return old?.map((card, currentIdx) => (currentIdx !== idx ? card : newData));
              });
            };
            const handleDelete = () => {
              setCards((c) => c?.filter((_, currentIdx) => currentIdx !== idx));
            };
            return (
              <>
                <HStack justifyContent="space-between" alignItems="stretch">
                  <Stack alignItems="center">
                    <FormLabel>{t('card.enabled')}</FormLabel>
                    <Checkbox
                      checked={c.enabled}
                      onCheckedChange={({ checked }) =>
                        handleValueChange({ ...c, enabled: checked === true })
                      }
                    />
                  </Stack>
                  <Stack alignItems="flex-start">
                    <FormLabel>{t('card.name')}</FormLabel>
                    <Input
                      value={c.name}
                      onChange={(e) => handleValueChange({ ...c, name: e.target.value })}
                    />
                  </Stack>
                  <Stack alignItems="flex-start">
                    <FormLabel>{t('card.mood-change')}</FormLabel>
                    <NumberInput
                      value={`${c.mentalPercentChange}`}
                      onValueChange={({ value }) =>
                        handleValueChange({ ...c, mentalPercentChange: Number(value) })
                      }
                    />
                  </Stack>
                  <Stack alignItems="flex-start">
                    <FormLabel>{t('card.mood')}</FormLabel>
                    <RadioGroup.Root
                      size={'sm'}
                      value={c.mood}
                      onValueChange={({ value }) =>
                        handleValueChange({ ...c, mood: value as 'happy' })
                      }
                    >
                      {[
                        { id: 'happy', label: t('happy') },
                        { id: 'neutral', label: t('neutral') },
                        { id: 'mellow', label: t('mellow') }
                      ].map((option) => (
                        <RadioGroup.Item key={option.id} value={option.id}>
                          <RadioGroup.ItemControl />
                          <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
                          <RadioGroup.ItemHiddenInput />
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </Stack>
                  <Stack justifyContent="center">
                    <Button onClick={handleDelete}>{t('delete')}</Button>
                  </Stack>
                  <Stack>
                    <Text>{t('per_use')}</Text>
                    <Text>
                      {Math.round(
                        calculateMoodEffect(c, currentMoodValue ?? 0) * (maxMental ?? 100)
                      )}{' '}
                      {t('mental')}
                    </Text>
                  </Stack>
                </HStack>
                <Divider />
              </>
            );
          })}
          <Button onClick={handleAddCard}>{t('new_card')}</Button>
        </Stack>
      </Center>
    </>
  );
}
