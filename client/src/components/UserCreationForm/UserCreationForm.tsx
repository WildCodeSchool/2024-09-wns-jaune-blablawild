import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useSignupMutation } from "@/graphql/hooks";
import { useToast } from "@/contexts/ToasterContext";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function UserCreationForm() {
  const [signup] = useSignupMutation();
  const { success } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await signup({
        variables: {
          data: {
            firstname: data.name,
            lastname: data.lastname,
            email: data.email,
            password: data.password,
          },
        },
      });
      success("Utilisateur créer");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
