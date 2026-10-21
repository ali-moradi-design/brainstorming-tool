import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { ThemeSwitch } from './ThemeSwitch';
import { useThemeStore } from './store';

beforeAll(async () => {
  await i18n.init({
    lng: 'en',
    resources: { en: { translation: { theme: { toLight: 'to light', toDark: 'to dark' } } } },
  });
});

it('toggles between dark and light and persists the choice', async () => {
  document.documentElement.dataset.theme = 'dark';
  useThemeStore.setState({ theme: 'dark' });
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeSwitch />
    </I18nextProvider>,
  );

  await userEvent.click(screen.getByRole('button', { name: 'to light' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('bt:theme')).toBe('light');

  await userEvent.click(screen.getByRole('button', { name: 'to dark' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
});
