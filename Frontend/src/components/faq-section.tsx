import { Accordion } from '@/components/ui/accordion';
import { Minus, Plus } from 'lucide-react';

type FaqType = {
  question: string;
  answer: string;
};

export function FaqSection() {
  const faqItems: FaqType[] = [
    {
      question: "Puis-je annuler ma réservation ?",
      answer: "Oui, vous pouvez annuler votre réservation selon les conditions d'annulation définies par la plateforme. Des frais peuvent s'appliquer selon le délai d'annulation."
    },
    {
      question: "Comment savoir si mon conducteur est fiable ?",
      answer: "Vous pouvez consulter les avis et notes laissés par d'autres passagers. Vérifiez également si le conducteur a un profil vérifié avec photo, numéro de téléphone et documents validés."
    },
    {
      question: "Puis-je voyager avec un animal de compagnie ?",
      answer: "Cela dépend du conducteur. Nous vous conseillons de le contacter avant la réservation pour vous assurer qu'il accepte les animaux à bord."
    },
    {
      question: "Quels sont les critères pour être conducteur ?",
      answer: "Pour être conducteur, vous devez avoir au moins 18 ans et un permis valide depuis 1 à 2 ans. Votre véhicule doit être assuré, en bon état et conforme aux normes de sécurité. Une assurance couvrant le covoiturage est obligatoire, et vous devez respecter le code de la route. Enfin, votre profil doit être vérifié avec une photo, un numéro de téléphone et une adresse e-mail confirmés. Des documents peuvent être demandés pour validation."
    },
    {
      question: "Comment laisser un avis sur un conducteur ?",
      answer: "Après votre trajet, vous recevrez une invitation à noter et commenter votre expérience. Vous pouvez attribuer une note et laisser un commentaire pour aider les futurs passagers."
    }
  ];

  return (
    <section className="flex flex-col items-center justify-center mb-25">
      <div className="w-full">
        <h1 className="mx-auto my-10 w-full lg:w-3/12 text-accent text-[22px] md:text-[38px] text-center font-semibold">
          Nos Questions fréquentes
        </h1>
        <div className="mx-6 max-w-[855px] md:mx-10 lg:m-auto ">
          {faqItems.map((item, index) => (
            <Accordion
              key={`${item.question}-${index}`}
              border={index === 0 ? 'top-bottom' : 'bottom'}
              title={item.question}
              contentClassname="pb-4 text-[#414141] w-10/12  text-[12px] lg:text-[15px]"
              titleStyle='text-black font-semibold text-[14px] lg:text-[20px]'
              customIcon={{
                active: <Minus size={18} />,
                inactive: <Plus size={18} />,
              }}            >
              <p>{item.answer}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}