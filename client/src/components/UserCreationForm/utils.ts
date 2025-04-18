import { SignupMutationFn, User } from "@/graphql/hooks";
import { NavigateFunction } from "react-router-dom";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupFormData = z.infer<typeof formSchema>;

type HandleSignupParams = {
  data: SignupFormData;
  signup: SignupMutationFn;
  setUser: (user: User, token: string) => void;
  closeModal?: () => void;
  closeNavbar?: () => void;
  navigate: NavigateFunction;
  success: (message: string) => void;
};

export const handleSignup = async ({
  data,
  signup,
  setUser,
  closeModal,
  closeNavbar,
  navigate,
  success,
}: HandleSignupParams) => {
  try {
    const response = await signup({
      variables: {
        data: {
          firstname: data.name,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
        },
      },
    });

    if (response.data?.signup) {
      const userData = JSON.parse(response.data.signup);
      const { user, token } = userData;
      setUser(user, token);

      if (closeModal) {
        closeModal();
      }

      if (closeNavbar) {
        closeNavbar();
      }

      setTimeout(() => {
        navigate("/");
        success("Inscription réussie");
      }, 100);
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription", error);
  }
};
