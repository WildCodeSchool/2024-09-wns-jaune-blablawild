import { Separator } from "@/components/ui/separator";
import { Profile, useGetProfileQuery } from "@/graphql/hooks";
import { useParams } from "react-router-dom";

type Props = {
  user: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    profile?: Partial<Profile> | null;
  };
};

export default function About({ user }: Props) {
  const { id } = useParams();

  const { data } = useGetProfileQuery({
    skip: !user.id,
    variables: { userId: id || "" },
});

  return (
    <section className="flex flex-col justify-center items-center gap-8 mt-6 pb-12 w-full">
      <div className="flex flex-col w-full items-center md:flex-row-reverse md:justify-between lg:w-10/12">
        <img
          src={user.profile?.image || "/placeholder-portrait.png"}
          alt={`${user.firstname} ${user.lastname}`}
          className="w-40 self-center rounded-full mb-8 md:mb-0"
        />

        <div className="flex flex-col items-center gap-6 md:gap-8 md:items-start text-black">
          {data?.getProfile?.phoneNumber && (
            <p>{data.getProfile.phoneNumber}</p>
          )}
          <p data-testid="user-email">{user.email}</p>
          <p>Profil verifié</p>
        </div>
      </div>

      <Separator className="bg-[#949393]" />

      <div className="flex flex-col items-center gap-6 md:gap-8 w-full md:items-start text-black lg:w-10/12">
        <p>Faible taux d'annulation</p>
        <p>Délai de réponse rapide</p>
        <p>Excellents avis</p>
      </div>

      {data?.getProfile?.description && (
        <>
          <Separator className="bg-[#949393]" />
          <div className="flex flex-col w-full text-justify items-center md:items-start text-black lg:w-10/12">
            <h2 className="text-[#4e598c]">Description</h2>
            <p className="mt-4">{data.getProfile.description}</p>
          </div>
        </>
      )}
    </section>
  );
}
