import { expect, test, type Page } from '@playwright/test';

const createBoard = async (page: Page, name: string) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: /idea/i }).fill(name);
  await page.getByRole('button', { name: 'Create board' }).click();
  await expect(page).toHaveURL(/#\/board\//);
};

test('creates a board with a root idea and persists after reload', async ({ page }) => {
  await createBoard(page, 'Product launch');
  await expect(page.getByTestId('idea-node')).toHaveCount(1);

  await page.getByTestId('idea-node').click();
  await page.getByTestId('add-child').click();
  await expect(page.locator('textarea')).toBeFocused();
  await page.keyboard.type('Landing page');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('idea-node')).toHaveCount(2);

  await page.reload();
  await expect(page.getByTestId('idea-node')).toHaveCount(2);
  await expect(page.getByText('Landing page')).toBeVisible();
});

test('keyboard shortcuts add a child and delete it', async ({ page }) => {
  await createBoard(page, 'Keys');
  await page.getByTestId('idea-node').click();
  await page.keyboard.press('Tab');
  await expect(page.locator('textarea')).toBeFocused();
  await page.keyboard.press('Enter'); // confirm the default text
  await expect(page.locator('textarea')).toHaveCount(0);
  await expect(page.getByTestId('idea-node')).toHaveCount(2);

  await page.keyboard.press('Delete');
  await expect(page.getByTestId('idea-node')).toHaveCount(1);
});

test('switches theme and the choice survives a reload', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = await html.getAttribute('data-theme');
  await page.getByTestId('theme-switch').click();
  const next = initial === 'dark' ? 'light' : 'dark';
  await expect(html).toHaveAttribute('data-theme', next);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', next);
});

test('switches language to Persian (RTL) and Spanish', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('language-switch').selectOption('fa');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('طوفان فکری');

  await page.getByTestId('language-switch').selectOption('es');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lluvia de ideas');

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lluvia de ideas');
});

test('deletes a board from the list', async ({ page }) => {
  await createBoard(page, 'Temporary');
  await page.goto('/#/');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Delete board' }).click({ force: true });
  await expect(page.getByText('No boards yet')).toBeVisible();
});
