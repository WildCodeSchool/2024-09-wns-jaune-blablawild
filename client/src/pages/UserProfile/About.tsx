import { Separator } from "@/components/ui/separator";
import { User } from "@/graphql/hooks";

type Props = {
    user: Partial<User>
}

export default function About({user}: Props) {

    return (
        <section className="flex flex-col justify-center items-center gap-4 mt-6">
            <div className="flex flex-col w-full items-center md:flex-row-reverse md:justify-between">
                <img 
                    src={user.image || '/placeholder-portrait.png'} alt={`${user.firstname} ${user.lastname}`}
                    className="w-1/3 self-center rounded-full"/>
                
                <div className="flex flex-col items-center my-6 gap-6 md:my-6 md:gap-8 md:items-start text-black">
                    <p data-testid="user-fullname" className="font-semibold text-black">{`${user.firstname} ${user.lastname}`}</p>
                    <p>Pas de téléphone</p>
                    <p data-testid="user-email">{user.email}</p>
                    <p>Profil verifié</p>
                </div>
            </div>
            <Separator className="bg-[#949393]"/>
            <div className="flex flex-col items-center gap-6 md:gap-8 w-full md:items-start text-black">
                <p>Faible taux d'annulation</p>
                <p>Délai de réponse rapide</p>
                <p>Excellents avis</p>
            </div>
            <Separator className="bg-[#949393]"/>
            <div className="flex flex-col w-[75%] md:w-auto text-justify items-center gap-6 md:gap-8 md:items-start text-black pb-4">
                <h2 className="text-[#4e598c]">Description</h2>
                <p>Lorem ipsum dolor sit amet consectetur. Fermentum aenean pretium venenatis vitae. Eu in mauris nibh ac lorem purus aenean. Nisl eget consequat congue fringilla adipiscing libero nisl. Pellentesque ullamcorper eget aenean venenatis volutpat et purus.</p>
            </div>
        </section>
    )
}