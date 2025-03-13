import { InformationCard } from "./ui/information-card";

type Information = {
  title: string;
  text: string;
};

const INFORMATIONS: Information[] = [
  {
    title: "Des trajets abordables toutes destinations",
    text: "Que vous optiez pour le covoiturage, trouvez facilement l'itinéraire idéal parmi une large sélection d'options économiques.",
  },
  {
    title: "Un voyage en toute sérénité",
    text: "Nous accordons une grande importance à la sécurité et à la fiabilité de notre service. C'est pourquoi nous vérifions attentivement les avis, les profils et les pièces d'identité de nos membres.",
  },
  {
    title: "Réservez en toute simplicité",
    text: "Grâce à notre application intuitive et performante, planifier votre trajet n'a jamais été aussi rapide. En quelques clics, trouvez et réservez un trajet près de chez vous en toute facilité.",
  },
];

export const InformationSection = () => (
  <section className="flex flex-col items-center space-y-10 md:flex-row md:space-y-0 md:space-x-10 md:mx-auto md:w-10/12 md:items-start lg:space-x-16 xl:w-9/12">
    {INFORMATIONS.map((information, index) => (
      <InformationCard
        key={`information-card-${index}`}
        index={index}
        title={information.title}
        text={information.text}
      />
    ))}
  </section>
);
