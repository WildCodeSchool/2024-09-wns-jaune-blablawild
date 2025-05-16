import { useToast } from "@/contexts/ToasterContext";
import { useLoginMutation } from "@/graphql/hooks";
import { useUserStore } from "@/store/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import UserCreationForm from "../UserCreationForm/UserCreationForm";
import { LoginFormData, formSchema, handleLogin } from "./utils";

type UserLoginFormProps = {
  closeModal?: () => void;
  closeNavbar?: () => void;
};

export default function UserLoginForm({
  closeModal,
  closeNavbar,
}: UserLoginFormProps) {
  const [login] = useLoginMutation();
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  // const [openCreationForm, setOpenCreationForm] = useState(false)
  const { success, error } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const handleCloseCreationForm = () => setOpenCreationForm(false)

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin({
      data,
      login,
      setUser,
      closeModal,
      closeNavbar,
      navigate,
      success,
      error,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormControl>
                    <Input
                      data-testid="email-input"
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
                      data-testid="password-input"
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
          <div className="flex justify-end text-foreground">
            <p className="text-border-grey text-xs font-regular underline underline-offset-4 mt-1 hover:opacity-80 cursor-pointer">
              Mot de passe oublié ?
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 mt-8">
            <Button
              data-testid="connected-button"
              type="submit"
              className="w-full h-11 bg-accent rounded-3xl p-5"
            >
              Se connecter
            </Button>
            <Modal
              trigger={
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-3xl p-5"
                  type="button"
                >
                  S'inscrire
                </Button>
              }
              content={<UserCreationForm closeModal={closeModal} />}
              moduleTitle="Inscription"
              dialogStyle="w-[350px]"
            />
          </div>
        </form>
      </Form>
    </>
  );
}
