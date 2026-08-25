import {expect, test} from '@playwright/test';

/**
 * Baseline regression recording of the main wizard use case:
 * Station wählen -> Zeitliche Auflösung wählen -> Zeitraum wählen -> Ihre Auswahl -> Die Daten herunterladen.
 *
 * Recorded 2026-08-19 against a local `ng serve` (http://localhost:4200) build.
 * This file is a fixed snapshot of one concrete path through the wizard
 * (Parameter: Temperatur, Station: Zürich / Fluntern (SMA), Messnetz: Automatische
 * Wetterstationen, Auflösung: Stündlich, Zeitraum: Aktuelles Jahr). Re-run after an
 * application update to confirm the same choices still produce the same URL state,
 * summary text and final step - do NOT click the actual download button.
 */
test('main wizard use case (record-only, no download)', async ({page}) => {
  // 1. Initial URL parameters: only lang=de and mdt=normal are preset, everything else empty.
  await page.goto('/');
  await expect(page).toHaveURL('http://localhost:4200/#lang=de&mdt=normal&pgid=&sid=&col=&di=&tr=&hdr=');

  // 2. Step 1 "Station wählen" is shown and active.
  await expect(page.getByRole('button', {name: /Station wählen/})).toHaveAttribute('aria-expanded', 'true');
  await page.waitForTimeout(1500);
  await expect(page).toHaveScreenshot('pw-01-step1-initial.png', {
    mask: [page.getByRole('region', {name: 'Map'})],
  });
  await expect(page.getByRole('region', {name: 'Map'})).toHaveScreenshot('pw-01-step1-initial-map.png', {maxDiffPixelRatio: 0.05});

  // 3. Choose a parameter from the autocomplete list.
  await page.getByRole('combobox', {name: 'Parameter'}).click();
  await page.getByRole('option', {name: 'Temperatur', exact: true}).click();
  await expect(page).toHaveURL(/pgid=Temperature/);
  await expect(page).toHaveScreenshot('pw-02-parameter-selected.png', {
    mask: [page.getByRole('region', {name: 'Map'})],
  });
  await expect(page.getByRole('region', {name: 'Map'})).toHaveScreenshot('pw-02-parameter-selected-map.png', {maxDiffPixelRatio: 0.05});

  // 4. Choose a station from the autocomplete list.
  await page.getByRole('combobox', {name: 'Station'}).click();
  await page.getByRole('option', {name: 'Zürich / Fluntern (SMA)'}).click();
  await expect(page).toHaveURL(/sid=SMA&col=ch\.meteoschweiz\.ogd-smn/);
  await expect(page.getByRole('heading', {name: 'Messnetz wählen'})).toBeVisible();
  await expect(page).toHaveScreenshot('pw-03-station-selected.png', {
    mask: [page.getByRole('region', {name: 'Map'})],
  });
  await expect(page.getByRole('region', {name: 'Map'})).toHaveScreenshot('pw-03-station-selected-map.png', {maxDiffPixelRatio: 0.05});

  // Choose the measuring network.
  await page.getByRole('button', {name: 'Automatische Wetterstationen'}).click();
  await expect(page).toHaveScreenshot('pw-04-network-selected.png');

  // 5. Click "Weiter"; step 2 becomes active.
  await page.getByRole('button', {name: 'Weiter'}).click();
  await expect(page.getByRole('button', {name: /Zeitliche Auflösung wählen/})).toHaveAttribute('aria-expanded', 'true');
  await expect(page).toHaveScreenshot('pw-05-step2.png');

  // 6. Choose a radio button (time resolution).
  await page.getByRole('radio', {name: 'Stündlich'}).click();
  await expect(page).toHaveURL(/di=hourly/);
  await expect(page).toHaveScreenshot('pw-06-step2-hourly-selected.png');

  // 7. Click "Weiter"; step 3 becomes active.
  await page.getByRole('button', {name: 'Weiter'}).click();
  await expect(page.getByRole('button', {name: 'Zeitraum wählen'})).toHaveAttribute('aria-expanded', 'true');
  await expect(page).toHaveScreenshot('pw-08-step3.png');

  // 8. Choose a radio button (time range).
  await page.getByRole('radio', {name: 'Aktuelles Jahr'}).click();
  await expect(page).toHaveURL(/tr=recent/);
  await expect(page).toHaveScreenshot('pw-09-step3-selected.png');

  // 9. Click "Weiter"; step 4 becomes active.
  await page.getByRole('button', {name: 'Weiter'}).click();
  await expect(page.getByRole('button', {name: /^Ihre Auswahl/})).toHaveAttribute('aria-expanded', 'true');

  // 10. Verify the summary reflects all previous choices.
  await expect(page.getByText('Station: Zürich / Fluntern (SMA)')).toBeVisible();
  await expect(page.getByText('Messnetz: Automatische Wetterstationen - Messwerte')).toBeVisible();
  await expect(
    page.getByText('Parameter: Bodentemperatur, Druck, Feuchte, Niederschlag, Schnee, Sonne, Strahlung, Temperatur, Verdunstung, Wind'),
  ).toBeVisible();
  await expect(page.getByText(/Zeitliche Auflösung: Stündlich/)).toBeVisible();
  await expect(page.getByText('Zeitraum: Aktuelles Jahr')).toBeVisible();
  await expect(page.getByText('Dateiformat: CSV')).toBeVisible();

  await expect(page).toHaveURL(
    'http://localhost:4200/#lang=de&mdt=normal&pgid=Temperature&sid=SMA&col=ch.meteoschweiz.ogd-smn&di=hourly&tr=recent&hdr=',
  );
  await expect(page).toHaveScreenshot('pw-10-step4-summary.png');

  // 11. Click "Weiter"; step 5 becomes active.
  // Scoped to the active "Ihre Auswahl" region: once step 4 is reached, the
  // now-collapsed step 2/3 panels still render their own (hidden) "Weiter"
  // buttons in the DOM, so an unscoped role lookup is ambiguous here.
  await page
    .getByRole('region', {name: /^Ihre Auswahl/})
    .getByRole('button', {name: 'Weiter'})
    .click();
  await expect(page.getByRole('button', {name: 'Die Daten herunterladen'})).toHaveAttribute('aria-expanded', 'true');
  await expect(page).toHaveScreenshot('pw-11-step5-final.png');

  // 12. Do NOT click any download button - recording stops here.
});
