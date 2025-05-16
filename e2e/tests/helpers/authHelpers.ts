import { expect, Page } from "@playwright/test";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

export async function login(page: Page) {
  // Allez sur la page principale
  await page.goto("/");

  // Ouvrir la modal de connexion
  const connectionButton = page.locator('[data-testid="connection-button"]');
  await connectionButton.click();

  // Remplir les champs pour se connecter
  const email = page.locator('[data-testid="email-input"]');
  const password = page.locator('[data-testid="password-input"]');
  const connectedButton = page.locator('[data-testid="connected-button"]');
  await email.fill(process.env.USER_EMAIL || "");
  await password.fill(process.env.USER_PASSWORD || "");
  await connectedButton.click();

  // Attendre que l'utilisateur soit bien connecté
  await expect(page.getByText("Connexion réussie")).toBeVisible({
    timeout: 5000,
  });
}
