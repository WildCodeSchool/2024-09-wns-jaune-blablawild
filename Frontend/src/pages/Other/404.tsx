import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <p className="text-2xl font-semibold text-secondary">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
        Page non trouvée
      </h1>
      <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
        Désolé, nous n'avons pas trouvé la page que vous cherchez.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button
          size="lg"
          variant="default"
          onClick={() => navigate("/")}
          className="hover:ring-secondary/80 hover:ring-2 hover:ring-offset-2"
        >
          Retour à l'accueil
        </Button>
        <Button
          size="lg"
          variant="outline2"
          onClick={() => navigate("/contact")}
        >
          Contactez-nous <span aria-hidden="true">&rarr;</span>
        </Button>
      </div>
    </div>
  );
}
