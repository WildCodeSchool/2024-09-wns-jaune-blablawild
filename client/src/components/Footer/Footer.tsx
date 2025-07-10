import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import SocialIcons from "./_components/SocialIcons";

const Footer = () => {
  const routes = [
    { from: "Paris", to: "Toulouse" },
    { from: "Paris", to: "Angers" },
    { from: "Montpellier", to: "Nantes" },
    { from: "Lyon", to: "Angers" },
  ];

  const informationLinks = ["Qui sommes-nous ?", "Centre d'aide"];

  const legalLinks = [
    "Conditions générales de ventes",
    "Politiques de confidentialités",
    "Mentions légales",
  ];

  const currentYear = new Date().getFullYear();

  const generateSearchUrl = (departure:string, arrival: string) => {
    const today = new Date();
    const formattedDate = today.toISOString();
    return `/search-result?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(formattedDate)}`;
  };

  return (
    <footer className="flex flex-col md:flex-row md:flex-wrap justify-between gap-8 bg-secondary text-white p-12">
      <section className="flex flex-col gap-4 md:w-[45%]">
        <h2 className="text-xl font-semibold flex flex-col text-white">
          <span>Besoin d'aide ?</span>
          <span>Notre équipe est là pour vous !</span>
        </h2>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-3xl w-fit text-md h-[3.5rem] hover:bg-white hover:text-secondary transition-colors"
        >
          Contactez-nous
        </Button>
      </section>

      <section className="flex flex-col gap-4 md:w-1/2">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-white">Nos itinéraires</h2>
            <nav aria-label="Itinéraires populaires" className="mt-4">
              <ul className="flex flex-col gap-4 text-sm">
                {routes.map((route) => (
                  <li key={`${route.from}-${route.to}`}>
                    <Link
                      to={generateSearchUrl(route.from, route.to)}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{route.from}</span>
                      <FaLongArrowAltRight size={16} className="mx-2" />
                      <span>{route.to}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-white">En savoir plus</h2>
            <nav
              aria-label="Liens d'information"
              className="flex flex-col gap-4 mt-4"
            >
              {informationLinks.map((link) => (
                <Link key={link} to="/" className="hover:underline text-sm">
                  {link}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 md:w-1/2">
        <h2 className="font-semibold text-xl text-white">Suivez-nous</h2>
        <SocialIcons size={36} />
      </section>

      <section className="flex flex-col text-xs w-full mt-2 pt-4 border-t border-white/20 justify-center items-center">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {legalLinks.map((legal) => (
            <Link key={legal} to="/" className="hover:underline">
              {legal}
            </Link>
          ))}
        </div>
        <p className="mt-4">© {currentYear} DriveUp. Tous droits réservés.</p>
      </section>
    </footer>
  );
};

export default Footer;