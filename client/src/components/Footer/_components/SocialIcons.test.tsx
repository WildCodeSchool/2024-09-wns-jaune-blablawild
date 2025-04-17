import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SocialIcons from "./SocialIcons";

describe("SocialIcons", () => {
  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <SocialIcons {...props} />
      </BrowserRouter>
    );
  };

  test("rend les trois icônes de réseaux sociaux", () => {
    renderComponent();

    expect(
      screen.getByLabelText("Visitez notre page Instagram")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Visitez notre page Facebook")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Visitez notre page X (Twitter)")
    ).toBeInTheDocument();
  });

  test("applique la taille par défaut aux icônes", () => {
    renderComponent();
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(3);
  });

  test("applique une taille personnalisée aux icônes", () => {
    renderComponent({ size: 48 });

    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(3);
  });

  test("applique une classe personnalisée au conteneur", () => {
    const customClass = "test-custom-class";
    renderComponent({ className: customClass });

    const container = screen.getAllByRole("link")[0].parentElement;
    expect(container).toHaveClass(customClass);
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("gap-6");
  });

  test("inclut un texte pour les lecteurs d'écran", () => {
    renderComponent();

    expect(screen.getByText("Nos réseaux sociaux")).toBeInTheDocument();
    expect(screen.getByText("Nos réseaux sociaux")).toHaveClass("sr-only");
  });

  test("rend tous les liens avec l'URL correcte", () => {
    renderComponent();

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/");
    });
  });
});
