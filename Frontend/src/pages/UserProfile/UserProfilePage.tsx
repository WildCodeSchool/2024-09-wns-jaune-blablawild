import { useGetUserByIdQuery } from "@/graphql/hooks";
import img from "/home-background.jpg";
import About from "./About";
import { useParams } from "react-router-dom";
import { useState } from "react";
import UserReviews from "./UserReviews";

export default function UserProfilePage() {
    const { id } = useParams();
    if (!id) throw new Error("no id provided");
    
    const user = useGetUserByIdQuery({
        skip: !id,
        variables: {id: id!}
    });
    
    const [currentPage, setCurrentPage] = useState<"profile" | "comments">("profile");
    
    if (user.error) return <p>Une erreur s'est produite : {user.error.message}</p>;
    if (user.loading) return <p>Chargement...</p>;
    if (!user.data) return <p>Aucun utilisateur n'a été trouvé</p>;
    
    return (
        <main
            className="flex flex-col min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
        >
            <section className="h-screen w-full self-center flex flex-col items-center bg-white/80 md:w-2/3 md:bg-white md:px-24">
                <div className="w-full mt-14">
                    <h1 className="text-[#595959] text-[36px] text-left px-6 md:px-0">Mon profil</h1>
                </div>
                
                <menu className="flex w-full justify-between my-4 mt-6">
                    <div
                        onClick={() => setCurrentPage("profile")}
                        className={`w-1/2 text-center uppercase text-base font-medium cursor-pointer pb-4
                            ${currentPage === "profile" ? "text-accent border-b-3 border-accent" : "text-[#595959] opacity-90 border-b-2 border-border-grey"}
                        `}
                    >
                        A propos
                    </div>
                    <div
                        onClick={() => setCurrentPage("comments")}
                        className={`w-1/2 text-center uppercase text-base font-medium cursor-pointer pb-4
                            ${currentPage === "comments" ? "text-accent border-b-3 border-accent" : "text-[#595959] opacity-90 border-b-2 border-border-grey"}
                        `}
                    >
                        Commentaires
                    </div>
                </menu>
                
                {currentPage === "profile" && <About user={user.data.getUserById}/>}
                {currentPage === "comments" && <UserReviews user={user.data.getUserById}/>}
            </section>
        </main>
    );
}