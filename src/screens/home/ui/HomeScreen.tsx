import type { LocaleId } from '@/shared/config';
import { LOCALES, entryById } from '@/shared/config';
import { getTranslation } from '@/shared/i18n';
import { Code, Container, List, ListItem, Stack, Text, Title } from '@/shared/ui';

/**
 * Scaffold screen for the `corporate-home` template.
 *
 * It carries NO product, clinical, evidence or regulatory copy and no drafted metadata from
 * the register. The homepage has a LOW claims gate, but its approved strings are produced in
 * WS-D/WS-B and do not exist yet.
 *
 * `docs/spec/claims-guardrails.md`, rule 7: placeholder copy is prohibited on gated surfaces.
 * Replace this screen with the real template; do not grow it into one.
 */
export async function HomeScreen({ locale }: { locale: LocaleId }) {
  const { t } = await getTranslation(locale);
  const definition = LOCALES[locale];
  const entry = entryById('homepage');

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={1}>Scaffold</Title>
        <Text>
          Application shell only. No approved copy is present on this page and nothing here is
          indexable.
        </Text>
        <List spacing="xs" size="sm">
          <ListItem>
            Locale: <Code>{definition.id}</Code> ({definition.label})
          </ListItem>
          <ListItem>
            URL prefix:{' '}
            <Code>{definition.prefix === '' ? '/ (unprefixed)' : definition.prefix}</Code>
          </ListItem>
          <ListItem>
            hreflang: <Code>{definition.hreflang.join(', ')}</Code>
          </ListItem>
          <ListItem>Status: {definition.status}</ListItem>
          {definition.gate ? <ListItem>Gate: {definition.gate}</ListItem> : null}
          <ListItem>
            Register entry: <Code>{entry?.template}</Code>, gate <Code>{entry?.gate}</Code>
          </ListItem>
          <ListItem>
            i18n probe: <Code>{t('errorRetry')}</Code>
          </ListItem>
        </List>
        <Text size="sm" c="dimmed">
          Specification: <Code>docs/spec/</Code>
        </Text>
      </Stack>
    </Container>
  );
}
