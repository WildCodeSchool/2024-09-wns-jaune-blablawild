import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <p className="text-xl sm:text-2xl font-semibold text-secondary">404</p>
      <h1 className="mt-4 text-3xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-balance text-gray-900">
        Page non trouvée
      </h1>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl/8 font-medium text-pretty text-gray-500 max-w-md sm:max-w-lg">
        Désolé, nous n'avons pas trouvé la page que vous cherchez.
      </p>
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
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
