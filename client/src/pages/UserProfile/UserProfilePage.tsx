import { useGetUserByIdQuery } from "@/graphql/hooks";
import { useState } from "react";
import { useParams } from "react-router-dom";
import About from "./About";
import UserReviews from "./UserReviews";
import img from "/home-background.jpg";
import { Button } from "@/components/ui/button";
import EditAbout from "./EditAbout";
import { useUserStore } from "@/store/useUserStore";

export default function UserProfilePage() {
  const { id } = useParams();
  if (!id) throw new Error("no id provided");

  const userData = useGetUserByIdQuery({
    skip: !id,
    variables: { id: id! },
  });

  const [currentPage, setCurrentPage] = useState<"profile" | "comments">(
    "profile"
  );
  const [editMode, setEditMode] = useState<boolean>(false);

  const { user } = useUserStore(); 
  
  const stringUserId = user ? String(user.id) : "";
  
  if (userData.error)
    return <p>Une erreur s'est produite : {userData.error.message}</p>;
  if (userData.loading) return <p>Chargement...</p>;
  if (!userData.data) return <p>Aucun utilisateur n'a été trouvé</p>;

  const handleCancel = () => {
    setEditMode(false)
  };

  return (
    <section className="flex h-[calc(100vh-3rem)] w-full overflow-hidden pt-0 mt-0">
      <div className="hidden md:block md:w-1/5 h-full">
        <img src={img} alt="van" className="h-full w-full object-cover" />
      </div>

      <section className="w-full bg-white flex flex-col items-center md:w-3/5 md:bg-white md:px-10 lg:px-24 h-full">
        <div className="sticky top-0 bg-white w-full z-10">
          <div className="hidden md:flex flex-row justify-between items-center md:w-full md:mt-10">
            <h1 className="text-[#595959] md:text-3xl lg:text-[36px] text-left font-medium px-6 md:px-0">
              {id === stringUserId ? "Mon profil" : `${userData.data.getUserById.firstname} ${userData.data.getUserById.lastname} `}
            </h1>
           {!editMode && id === stringUserId  &&  <Button
              onClick={() => setEditMode(true)}
              variant={"link"}
              className="hover:no-underline hover:opacity-70 text-forecast"
            >
              Modifier mon profil
            </Button>}
          </div>

          <menu className="flex w-full justify-between mt-6">
            <div
              onClick={() => setCurrentPage("profile")}
              className={`w-1/2 text-center uppercase text-sm lg:text-base font-medium cursor-pointer pb-4                             
                ${
                  currentPage === "profile"
                    ? "text-accent border-b-3 border-accent"
                    : "text-[#595959] opacity-90 border-b-2 border-border-grey"
                }`}
            >
              A propos
            </div>
            <div
              onClick={() => setCurrentPage("comments")}
              className={`w-1/2 text-center uppercase text-sm lg:text-base font-medium cursor-pointer pb-4                             
                ${
                  currentPage === "comments"
                    ? "text-accent border-b-3 border-accent"
                    : "text-[#595959] opacity-90 border-b-2 border-border-grey"
                }`}
            >
              Commentaires
            </div>
          </menu>
        </div>

        <div className="flex-1 w-full overflow-y-auto scrollbar-hide">
          <section
            className="relative flex-1 w-full flex flex-col md:hidden items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-white/70 z-0"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center px-6 py-8">
              <h1 className="text-[#4e598c] text-3xl md:text- lg:text-[36px]">
              {id === stringUserId ? "Mon profil" : `${userData.data.getUserById.firstname} ${userData.data.getUserById.lastname} `}
              </h1>
              
              {currentPage === "profile" &&
                (editMode ? (
                  <EditAbout user={userData.data.getUserById} onCancel={handleCancel}/>
                ) : (
                  <About user={userData.data.getUserById} />
                ))}
              {currentPage === "comments" && (
                <UserReviews user={userData.data.getUserById} />
              )}
            </div>
          </section>

          <section className="hidden md:block w-full">
            {currentPage === "profile" &&
              (editMode ? (
                <EditAbout user={userData.data.getUserById} onCancel={handleCancel} />
              ) : (
                <About user={userData.data.getUserById} />
              ))}{" "}
            {currentPage === "comments" && (
              <UserReviews user={userData.data.getUserById} />
            )}
          </section>
        </div>
        {!editMode && id === stringUserId  &&  <Button
              onClick={() => setEditMode(true)}
              variant={"link"}
              className="md:hidden hover:no-underline hover:opacity-70 text-accent"
            >
              Modifier mon profil
            </Button>}
      </section>

      <div className="hidden md:block md:w-1/5 h-full">
        <img
          src={img}
          alt="van"
          className="h-full w-full object-cover object-[75%_center]"
        />
      </div>
      
    </section>
  );
}
