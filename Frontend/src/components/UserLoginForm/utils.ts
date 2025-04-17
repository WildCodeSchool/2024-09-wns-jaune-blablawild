import { LoginMutationFn, User } from "@/graphql/hooks";
import { NavigateFunction } from "react-router-dom";
import { z } from "zod";

// Schéma de validation pour le formulaire
export const formSchema = z.object({
  email: z.string().email("Adresse mail invalide"),
  password: z.string().min(6, "Mot de passe invalide"),
});

export type LoginFormData = z.infer<typeof formSchema>;

type HandleLoginParams = {
  data: LoginFormData;
  login: LoginMutationFn;
  setUser: (user: User | null, token?: string | null) => void;
  closeModal?: () => void;
  closeNavbar?: () => void;
  navigate: NavigateFunction;
  success: (message: string) => void;
  error: (message: string) => void;
};

export const handleLogin = async ({
  data,
  login,
  setUser,
  closeModal,
  closeNavbar,
  navigate,
  success,
  error,
}: HandleLoginParams) => {
  try {
    const response = await login({
      variables: {
        data: {
          email: data.email,
          password: data.password,
        },
      },
    });

    if (response.data?.login) {
      try {
        const parsedData = JSON.parse(response.data.login) as {
          user: User;
          token: string;
        };

        const { user, token } = parsedData;
        setUser(user, token);

        if (closeModal) {
          closeModal();
        }

        if (closeNavbar) {
          closeNavbar();
        }

        setTimeout(() => {
          navigate("/");
          success("Connexion réussie");
        }, 50);
      } catch (err) {
        console.error("Erreur lors du parsing de la réponse", err);
        error("Format de réponse invalide");
      }
    }
  } catch (err) {
    console.error("Erreur lors de la connexion", err);
    error("Erreur de connexion. Vérifiez vos identifiants.");
  }
};
