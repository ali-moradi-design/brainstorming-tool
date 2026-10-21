import { expect, test, type Page } from '@playwright/test';

const createBoard = async (page: Page, name: string) => {
  await page.goto('/');
  // The sidebar form and the home page form are both on screen; use the sidebar one.
  await page.getByRole('textbox', { name: /idea/i }).first().fill(name);
  await page.getByRole('button', { name: 'Create board' }).first().click();
  await expect(page).toHaveURL(/#\/board\//);
};

test('creates a board with a root idea and persists after reload', async ({ page }) => {
  await createBoard(page, 'Product launch');
  await expect(page.getByTestId('idea-node')).toHaveCount(1);

  await page.getByTestId('idea-node').click();
  await page.getByTestId('add-child').click();
  await expect(page.getByTestId('idea-node').locator('textarea')).toBeFocused();
  await page.keyboard.type('Landing page');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('idea-node')).toHaveCount(2);

  await page.reload();
  await expect(page.getByTestId('idea-node')).toHaveCount(2);
  await expect(page.getByTestId('idea-node').getByText('Landing page')).toBeVisible();
});

test('keyboard shortcuts add a child and delete it', async ({ page }) => {
  await createBoard(page, 'Keys');
  await page.getByTestId('idea-node').click();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('idea-node').locator('textarea')).toBeFocused();
  await page.keyboard.press('Enter'); // confirm the default text
  await expect(page.getByTestId('idea-node').locator('textarea')).toHaveCount(0);
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
  await page.getByRole('button', { name: 'Delete board' }).first().click({ force: true });
  await expect(page.getByText('No boards yet').first()).toBeVisible();
});

test('adds a description and separate notes to an idea', async ({ page }) => {
  await createBoard(page, 'Details');
  await page.getByTestId('idea-node').click();
  const panel = page.getByTestId('details-panel');
  await expect(panel).toBeVisible();

  await panel.getByLabel('Description').fill('Why this matters');
  await panel.getByLabel('Description').blur();
  await panel.getByLabel('Write a note', { exact: false }).fill('First note');
  await panel.getByTestId('add-note').click();
  await panel.getByLabel('Write a note', { exact: false }).fill('Second note');
  await panel.getByTestId('add-note').click();
  await expect(panel.getByTestId('note')).toHaveCount(2);

  await page.reload();
  await page.getByTestId('idea-node').click();
  await expect(page.getByTestId('details-panel').getByLabel('Description')).toHaveValue(
    'Why this matters',
  );
  await expect(page.getByTestId('note')).toHaveCount(2);

  await page.getByRole('button', { name: 'Delete note' }).first().click();
  await expect(page.getByTestId('note')).toHaveCount(1);
});

test('keeps several projects and switches between them from the sidebar', async ({ page }) => {
  await createBoard(page, 'Alpha');
  await page.getByRole('textbox', { name: /idea/i }).first().fill('Beta');
  await page.getByRole('button', { name: 'Create board' }).first().click();
  const sidebar = page.getByTestId('sidebar');
  await expect(sidebar.getByRole('button', { name: 'Alpha' }).first()).toBeVisible();
  await expect(sidebar.getByRole('button', { name: 'Beta' }).first()).toBeVisible();

  await sidebar.getByRole('button', { name: 'Alpha' }).first().click();
  await expect(page.getByRole('textbox', { name: 'Board title' })).toHaveValue('Alpha');
});

test('outline selects an idea and the sidebar can be collapsed', async ({ page }) => {
  await createBoard(page, 'Outline');
  await page.getByTestId('idea-node').click();
  await page.getByTestId('add-child').click();
  await expect(page.getByTestId('idea-node').locator('textarea')).toBeFocused();
  await page.keyboard.type('Child idea');
  await page.keyboard.press('Enter');
  await page.getByTestId('idea-node').first().click();

  await page.getByTestId('sidebar').getByRole('button', { name: 'Child idea' }).click();
  await expect(page.getByTestId('details-panel').getByLabel('Title')).toHaveValue('Child idea');

  const sidebar = page.getByTestId('sidebar');
  await expect(sidebar).toHaveAttribute('data-open', 'true');
  await page.getByTestId('sidebar-toggle').click();
  await expect(sidebar).toHaveAttribute('data-open', 'false');
  await page.reload();
  await expect(page.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');
});
