// @flow strict
import { test } from '@playwright/test';
import expectAccessiblePage from './expectAccessiblePage.mjs';

test('Structure and behavior Accessibility check', async ({ page }) => {
  await page.goto('/foundations/forms/composition_+_behavior');
  await expectAccessiblePage({ page });
});
