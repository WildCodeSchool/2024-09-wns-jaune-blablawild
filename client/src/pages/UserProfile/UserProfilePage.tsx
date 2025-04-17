import { useGetUserByIdQuery } from "@/graphql/hooks";
import { useState } from "react";
import { useParams } from "react-router-dom";
import About from "./About";
import UserReviews from "./UserReviews";
import img from "/home-background.jpg";

export default function UserProfilePage() {
  const { id } = useParams();
  if (!id) throw new Error("no id provided");

  const user = useGetUserByIdQuery({
    skip: !id,
    variables: { id: id! },
  });

  const [currentPage, setCurrentPage] = useState<"profile" | "comments">(
    "profile"
  );

  if (user.error)
    return <p>Une erreur s'est produite : {user.error.message}</p>;
  if (user.loading) return <p>Chargement...</p>;
  if (!user.data) return <p>Aucun utilisateur n'a été trouvé</p>;

  return (
    <main className="flex min-h-screen justify-center">
      <div className="sm:flex-1/8 hidden md:block">
        <img src={img} alt="van" className="h-full w-full object-cover" />
      </div>
      <section className="h-screen w-full self-center flex flex-col items-center md:w-2/3 md:bg-white md:px-18 lg:px-24">
        <div className="hidden md:block md:w-full md:mt-14">
          <h1 className="text-[#595959] text-[36px] text-left px-6 md:px-0">
            Mon profil
          </h1>
        </div>
        <menu className="flex w-full justify-between mt-6">
          <div
            onClick={() => setCurrentPage("profile")}
            className={`w-1/2 text-center uppercase text-base font-medium cursor-pointer pb-4
                            ${
                              currentPage === "profile"
                                ? "text-accent border-b-3 border-accent"
                                : "text-[#595959] opacity-90 border-b-2 border-border-grey"
                            }
                        `}
          >
            A propos
          </div>
          <div
            onClick={() => setCurrentPage("comments")}
            className={`w-1/2 text-center uppercase text-base font-medium cursor-pointer pb-4
                            ${
                              currentPage === "comments"
                                ? "text-accent border-b-3 border-accent"
                                : "text-[#595959] opacity-90 border-b-2 border-border-grey"
                            }
                        `}
          >
            Commentaires
          </div>
        </menu>
        <section
          className="relative h-screen w-full self-center flex flex-col md:hidden items-center bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="absolute inset-0 bg-white/70 z-0"></div>
          <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center px-6 py-8">
            <h1 className="text-[#4e598c] text-[36px]">Mon profil</h1>
            {currentPage === "profile" && (
              <About user={user.data.getUserById} />
            )}
            {currentPage === "comments" && (
              <UserReviews user={user.data.getUserById} />
            )}
          </div>
        </section>
        <section className="hidden md:block w-full">
          {currentPage === "profile" && <About user={user.data.getUserById} />}
          {currentPage === "comments" && (
            <UserReviews user={user.data.getUserById} />
          )}
        </section>
      </section>
      <div className="md:flex-1/8 hidden lg:block">
        <img
          src={img}
          alt="van"
          className="h-full w-full object-cover object-[75%_center]"
        />
      </div>
    </main>
  );
}
