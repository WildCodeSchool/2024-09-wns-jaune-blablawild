import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/contexts/ToasterContext";
import { useUpdatePasswordMutation } from "@/graphql/hooks";
import { passwordRegex } from "@/utils/Regex";
import { ApolloError } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .regex(
        passwordRegex,
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial"
      ),
    confirmPassword: z
      .string()
      .regex(
        passwordRegex,
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial"
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

export default function UpdatePassword() {
  const toast = useToast();
  const [updatePassword] = useUpdatePasswordMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updatePassword({
        variables: {
          data: {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
        },
      });
      toast.success("Mot de passe modifié avec succès");
    } catch (error) {
      if (error instanceof ApolloError) {
        toast.error(error.message);
      }
    }
  };
  return (
    <FormProvider {...form}>
      <h1 className="text-2xl font-bold">Mise à jour du mot de passe</h1>
      <p className="text-center">
        Il doit comporter au moins 8 caractères dont 1 lettre, 1 chiffre et 1
        caractère spécial.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    type="password"
                    placeholder="*Ancien mot de passe"
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
            name="newPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    type="password"
                    placeholder="*Nouveau mot de passe"
                    className="col-span-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-1 text-primary" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormControl>
                  <Input
                    variant="underline"
                    type="password"
                    placeholder="*Confirmer le nouveau mot de passe"
                    className="col-span-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-4 col-start-1 text-primary" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <Button type="submit" className="w-40 bg-accent rounded-3xl p-5">
            Modifier
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
