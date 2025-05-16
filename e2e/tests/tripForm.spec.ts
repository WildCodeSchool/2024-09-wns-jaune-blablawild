import { test, expect, Page } from "@playwright/test";
import { login } from "./helpers/authHelpers";

export async function fillTripForm(
  page: Page,
  destination: string,
  departure: string,
  steps: number = 2
) {
  const destinationInput = page.locator('[data-testid="destination-input"]');
  const departureInput = page.locator('[data-testid="departure-input"]');
  const continueButton = page.locator('[data-testid="continue-button"]');

  // Étape 1 : Ville d'arrivée
  if (steps >= 1) {
    await destinationInput.fill(destination);
    await continueButton.click();
    await expect(departureInput).toBeVisible();
  }

  // Étape 2 : Ville de départ
  if (steps >= 2) {
    await departureInput.fill(departure);
    await continueButton.click();
    await expect(continueButton).toBeVisible();
  }

  // Étape 3 : Date de départ (simple clic sur Continuer)
  if (steps >= 3) {
    await continueButton.click();
    await expect(continueButton).toBeVisible();
  }

  // Étape 4 : Heure de départ (simple clic sur Continuer)
  if (steps >= 4) {
    await continueButton.click();
    await expect(continueButton).toBeVisible();
  }

  // Étape 5 : Nombre de passagers
  if (steps >= 5) {
    const plusButton = page.locator('[data-testid="plus-button"]');
    await plusButton.click(); // Ajoute un passager
    await continueButton.click();
    await expect(continueButton).toBeVisible();
  }

  // Étape 6 : Prix
  if (steps >= 6) {
    const priceInput = page.locator('[data-testid="price-input"]');
    await priceInput.fill("25");
    await continueButton.click();
  }
}

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto("/tripform");
});

test("should show error when departure and arrival cities are the same", async ({
  page,
}) => {
  await fillTripForm(page, "Paris", "Paris", 2);
  await expect(
    page.getByText(
      "La ville de départ et d'arrivée ne peuvent pas être identiques"
    )
  ).toBeVisible();
});

test("should show error when departure or arrival cities is missing", async ({
  page,
}) => {
  const continueButton = page.locator('[data-testid="continue-button"]');
  await continueButton.click();
  await expect(
    page.getByText("Veuillez sélectionner une ville d'arrivée")
  ).toBeVisible();
});

test("should show error when passenger count is 0", async ({ page }) => {
  await fillTripForm(page, "Paris", "Toulouse", 4);
  const continueButton = page.locator('[data-testid="continue-button"]');
  await continueButton.click();

  await expect(
    page.getByText("Le nombre de passagers doit être au moins 1")
  ).toBeVisible();
});

test("should show error when price is 0", async ({ page }) => {
  await fillTripForm(page, "Paris", "Toulouse", 5);
  const continueButton = page.locator('[data-testid="continue-button"]');
  await continueButton.click();

  await expect(page.getByText("Le prix doit être supérieur à 0")).toBeVisible();
});

test("should create a trip with valid data", async ({ page }) => {
  await fillTripForm(page, "Marseille", "Nice", 6);

  const publishButton = page.locator('[data-testid="publish-button"]');
  await publishButton.click();

  await expect(page.getByText("Trajet publié !")).toBeVisible();
});
