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
  await expect(page.getByTestId('idea-node').getByText('Landing page')).toBeVisible(); // saved
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
  await expect(page.getByText('بگذار ایده‌هایت شکوفا شوند')).toBeVisible();

  await page.getByTestId('language-switch').selectOption('es');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByText('Deja que tus ideas florezcan')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Deja que tus ideas florezcan')).toBeVisible();
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

  await page.getByTestId('sidebar').getByRole('button', { name: 'Child idea' }).click();
  await expect(page.getByTestId('details-panel').getByLabel('Title')).toHaveValue('Child idea');

  const sidebar = page.getByTestId('sidebar');
  await expect(sidebar).toHaveAttribute('data-open', 'true');
  await page.getByTestId('sidebar-toggle').click();
  await expect(sidebar).toHaveAttribute('data-open', 'false');
  await page.reload();
  await expect(page.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');
});

const addChild = async (page: Page, parent: string, text: string) => {
  await page.getByTestId('idea-node').filter({ hasText: parent }).first().click();
  await page.getByTestId('add-child').click();
  await expect(page.getByTestId('idea-node').locator('textarea')).toBeFocused();
  await page.keyboard.type(text);
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('idea-node').locator('textarea')).toHaveCount(0);
};

test('undo and redo restore the map', async ({ page }) => {
  await createBoard(page, 'History');
  await addChild(page, 'History', 'Extra');
  await expect(page.getByTestId('idea-node')).toHaveCount(2);

  await page.getByTestId('undo').click();
  await expect(page.getByTestId('idea-node')).toHaveCount(1);
  await page.getByTestId('redo').click();
  await expect(page.getByTestId('idea-node')).toHaveCount(2);
});

test('searches across projects with Ctrl+K and opens the result', async ({ page }) => {
  await createBoard(page, 'Alpha plan');
  await page.goto('/#/');
  await page.getByRole('textbox', { name: /idea/i }).first().fill('Beta plan');
  await page.getByRole('button', { name: 'Create board' }).first().click();
  await expect(page.getByRole('textbox', { name: 'Board title' })).toHaveValue('Beta plan');

  await page.keyboard.press('Control+k');
  await page.getByRole('textbox', { name: /Search projects/ }).fill('alpha');
  await expect(page.getByRole('dialog').getByRole('option').first()).toContainText('Alpha plan');
  await expect(page.getByRole('dialog').getByRole('option').first()).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Board title' })).toHaveValue('Alpha plan');
});

test('tags filter the map and the list view shows every idea', async ({ page }) => {
  await createBoard(page, 'Tags');
  await addChild(page, 'Tags', 'Urgent task');
  const panel = page.getByTestId('details-panel');
  await panel.getByLabel('Add a tag and press Enter').fill('urgent');
  await page.keyboard.press('Enter');
  await expect(panel.getByText('#urgent')).toBeVisible();

  await page.getByRole('button', { name: '#urgent' }).last().click();
  await page.getByTestId('view-list').click();
  await expect(page.getByTestId('idea-list').getByRole('button')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filter' }).click();
  await expect(page.getByTestId('idea-list').getByRole('button')).toHaveCount(2);
});

test.describe('link mode', () => {
  // The details sheet takes space, so give the map room to show both ideas.
  test.use({ viewport: { width: 1280, height: 1100 } });

  test('links two ideas in link mode', async ({ page }) => {
    await createBoard(page, 'Links');
    await addChild(page, 'Links', 'Kid one');
    await addChild(page, 'Links', 'Kid two');
    await page.getByRole('button', { name: 'fit view' }).click();
    await page.getByTestId('idea-node').filter({ hasText: 'Kid one' }).click();
    await page.getByTestId('link-mode').click();
    await page.getByTestId('idea-node').filter({ hasText: 'Kid two' }).click();
    await page.getByTestId('idea-node').filter({ hasText: 'Kid one' }).click();
    await expect(
      page.getByTestId('details-panel').getByText('Kid two', { exact: true }),
    ).toBeVisible();
  });
});

test('collapses and expands a branch', async ({ page }) => {
  await createBoard(page, 'Branches');
  await addChild(page, 'Branches', 'Leaf');
  await expect(page.getByTestId('idea-node')).toHaveCount(2);

  const root = page.getByTestId('idea-node').filter({ hasText: 'Branches' });
  const toggle = root.getByTestId('collapse-toggle');
  await root.hover();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('idea-node')).toHaveCount(1);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('idea-node')).toHaveCount(2);
});

test('creates a project from the SWOT template', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('template-select').first().selectOption({ label: 'SWOT analysis' });
  await page.getByRole('textbox', { name: /idea/i }).first().fill('My SWOT');
  await page.getByRole('button', { name: 'Create board' }).first().click();
  await expect(page.getByTestId('idea-node')).toHaveCount(5);
  await expect(page.getByTestId('idea-node').getByText('Opportunities')).toBeVisible();
});

test('exports a project as Markdown and serves the PWA manifest', async ({ page, request }) => {
  await createBoard(page, 'Export me');
  await page.getByTestId('export-menu').click();
  const download = page.waitForEvent('download');
  await page.getByTestId('export-markdown').click();
  expect((await download).suggestedFilename()).toBe('Export-me.md');

  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  expect((await manifest.json()).name).toBe('Ideabloom');
});

const XSS =
  '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>"><svg onload=window.__xss=3>';

test.describe('security', () => {
  test('markup in user content is rendered as text and never executes', async ({ page }) => {
    const dialogs: string[] = [];
    page.on('dialog', (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });
    await createBoard(page, 'Safe');
    await addChild(page, 'Safe', XSS);
    const panel = page.getByTestId('details-panel');
    await panel.getByLabel('Description').fill(XSS);
    await panel.getByLabel('Description').blur();
    await panel.getByLabel('Write a note', { exact: false }).fill(XSS);
    await panel.getByTestId('add-note').click();
    await panel.getByLabel('Add a tag and press Enter').fill('<b>x</b>');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('note')).toHaveCount(1);

    // The payload is on screen as literal text, not as elements.
    await expect(
      page.getByTestId('idea-node').getByText('<img src=x', { exact: false }),
    ).toBeVisible();
    await expect(page.locator('main img[src="x"], main script, main svg[onload]')).toHaveCount(0);
    expect(
      await page.evaluate(() => (window as unknown as { __xss?: number }).__xss),
    ).toBeUndefined();

    // ...and also in the list view, search results and the sidebar.
    await page.getByTestId('view-list').click();
    await expect(
      page.getByTestId('idea-list').getByText('<img src=x', { exact: false }).first(),
    ).toBeVisible();
    await page.keyboard.press('Control+k');
    await page.getByRole('textbox', { name: /Search projects/ }).fill('onerror');
    await expect(page.getByRole('dialog').getByRole('option').first()).toBeVisible();
    expect(
      await page.evaluate(() => (window as unknown as { __xss?: number }).__xss),
    ).toBeUndefined();
    expect(dialogs).toEqual([]);
  });

  test('a malicious backup file is rejected and changes nothing', async ({ page }) => {
    await createBoard(page, 'Keep me');
    const bad = {
      app: 'brainstorming-tool',
      version: 1,
      boards: [{ id: 'evil', title: 'x', createdAt: 1, updatedAt: 1 }],
      ideas: [
        {
          id: 'e',
          boardId: 'evil',
          parentId: null,
          text: 'x'.repeat(100_000),
          x: 0,
          y: 0,
          color: 0,
          createdAt: 1,
        },
      ],
    };
    await page.getByTestId('import-input').setInputFiles({
      name: 'evil.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(bad)),
    });
    await expect(page.getByRole('status')).toContainText('not a valid backup');
    await page.goto('/#/');
    await expect(
      page.getByTestId('sidebar').getByRole('button', { name: 'Keep me' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('sidebar').getByRole('button', { name: 'x', exact: true }),
    ).toHaveCount(0);
  });

  test('the production build runs under its Content-Security-Policy without violations', async ({
    page,
  }) => {
    const violations: string[] = [];
    page.on(
      'console',
      (m) => /content security policy|refused to/i.test(m.text()) && violations.push(m.text()),
    );
    await page.addInitScript(() =>
      document.addEventListener('securitypolicyviolation', (e) =>
        console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`),
      ),
    );
    const csp = await page
      .goto('/')
      .then(() =>
        page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'),
      );
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("'unsafe-eval'");

    await createBoard(page, 'CSP');
    await addChild(page, 'CSP', 'Child');
    await page.getByTestId('export-menu').click();
    const png = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: /PNG/ }).click();
    expect((await png).suggestedFilename()).toBe('CSP.png');
    await page.getByTestId('theme-switch').click();
    await page.getByTestId('language-switch').selectOption('fa');
    expect(violations).toEqual([]);
  });
});

test('links ideas from the details sheet and shows the link on the map', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('template-select').first().selectOption({ label: 'Pros and cons' });
  await page.getByRole('textbox', { name: /idea/i }).first().fill('Choice');
  await page.getByRole('button', { name: 'Create board' }).first().click();
  await expect(page.getByTestId('idea-node')).toHaveCount(3);

  await page.getByTestId('sidebar').getByRole('button', { name: 'Pros', exact: true }).click();
  await page.getByLabel('Link to another idea…').selectOption({ label: 'Cons' });
  const panel = page.getByTestId('details-panel');
  await expect(panel.getByRole('listitem').filter({ hasText: 'Cons' })).toHaveCount(1);
  await expect(page.locator('.react-flow__edge path[style*="stroke-dasharray"]')).toHaveCount(1);
});
