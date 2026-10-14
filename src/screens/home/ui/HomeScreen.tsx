import type { LocaleId } from '@/shared/config';
import { getTranslation } from '@/shared/i18n';
import { Container, Title } from '@/shared/ui';

/**
 * Homepage screen.
 *
 * Carries a single localised line: the page's own name. The string is an interface label and
 * lives in the `navigation` namespace, not a claim surface - no product, clinical, evidence
 * or regulatory copy is present here.
 */
export async function HomeScreen({ locale }: { locale: LocaleId }) {
  const { t } = await getTranslation(locale, 'navigation');

  return (
    <Container size="sm" py="xl">
      <Title order={1}>{t('home')}</Title>
    </Container>
  );
}
