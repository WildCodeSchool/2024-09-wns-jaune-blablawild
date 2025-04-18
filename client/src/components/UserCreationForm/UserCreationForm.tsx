import { useToast } from "@/contexts/ToasterContext";
import { useSignupMutation } from "@/graphql/hooks";
import { useUserStore } from "@/store/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SignupFormData, formSchema, handleSignup } from "./utils";

type UserCreationFormProps = {
  closeModal?: () => void;
  closeNavbar?: () => void;
};

export default function UserCreationForm({
  closeModal,
  closeNavbar,
}: UserCreationFormProps) {
  const [signup] = useSignupMutation();
  const { success } = useToast();
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    await handleSignup({
      data,
      signup,
      setUser,
      closeModal,
      closeNavbar,
      navigate,
      success,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    placeholder="*Nom"
                    className="col-span-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-2 text-primary" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    placeholder="*Prénom"
                    className="col-span-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-2 text-primary" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    placeholder="*Mail"
                    className="col-span-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-2 text-primary" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    type="password"
                    placeholder="*Mot de passe"
                    className="col-span-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-2 text-primary" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="w-40 bg-accent rounded-3xl p-5">
            Valider
          </Button>
        </div>
      </form>
    </Form>
  );
}
