import { useGetUserByIdQuery } from "@/graphql/hooks";
import img from "/home-background.jpg";
import About from "./About";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function UserProfilePage() {
    const { id } = useParams()
    if (!id) throw new Error ("no id provided")
    const user = useGetUserByIdQuery({
        skip: !id,
        variables: {id: id!}
    })

    const [currentPage, setCurrentPage] = useState<"profile" | "comments">("profile")

    if (user.error) return <p>Une erreur s'est produite : {user.error.message}</p>
    if (user.loading) return <p>Chargement...</p>
    if (!user.data) return <p>Aucun utilisateur n'a été trouvé</p>

    return (


    <main 
        className="flex flex-col min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
    >
        <section className="h-screen w-full self-center flex flex-col items-center bg-white/80 md:w-2/3 md:bg-white">
            <menu className="flex w-full justify-between my-4">
                <div 
                    onClick={() => setCurrentPage("profile")} 
                    className={`w-1/2 text-center uppercase text-lg font-medium cursor-pointer pb-4
                        ${currentPage === "profile" ? "text-chart-1 border-b-4 border-chart-1" : "text-chart-3"}
                    `}>
                        A propos
                </div>
                <div 
                    onClick={() => setCurrentPage("comments")} 
                    className={`w-1/2 text-center uppercase text-lg font-medium cursor-pointer pb-4
                        ${currentPage === "comments" ? "text-chart-1 border-b-4 border-chart-1" : "text-chart-3"}
                        `}>
                        Commentaires
                </div>
            </menu>
            {currentPage === "profile" && <About user={user.data.getUserById}/>}
            {currentPage === "comments" && <p>Commentaires à implémenter</p>}
        </section>
    </main>
    )
}