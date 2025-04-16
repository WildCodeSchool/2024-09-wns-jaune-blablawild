import { Separator } from "@/components/ui/separator";
import { User } from "@/graphql/hooks";

type Props = {
    user: Partial<User>
}

export default function About({user}: Props) {

    return (
        <section className="flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col mt-6 w-full items-center md:flex-row-reverse md:justify-between md:mt-0">
                <img 
                    src={user.image || '/placeholder-portrait.png'} alt={`${user.firstname} ${user.lastname}`}
                    className="w-1/3 self-center rounded-full border-chart-3 border-6"/>
                
                <div className="flex flex-col items-center my-4 gap-4 md:items-start">
                    <p data-testid="user-fullname" className="font-semibold text-chart-3">{`${user.firstname} ${user.lastname}`}</p>
                    <p>Pas de téléphone</p>
                    <p data-testid="user-email">{user.email}</p>
                    <p>Profil verifié</p>
                </div>
            </div>
            <Separator className="bg-chart-3"/>
            <div className="flex flex-col items-center gap-4 w-full md:items-start">
                <p>Faible taux d'annulation</p>
                <p>Délai de réponse rapide</p>
                <p>Excellents avis</p>
            </div>
            <Separator className="bg-chart-3"/>
            <div className="flex flex-col items-center gap-4 md:items-start">
                <h2>Description</h2>
                <p>Lorem ipsum dolor sit amet consectetur. Fermentum aenean pretium venenatis vitae. Eu in mauris nibh ac lorem purus aenean. Nisl eget consequat congue fringilla adipiscing libero nisl. Pellentesque ullamcorper eget aenean venenatis volutpat et purus.</p>
            </div>
        </section>
    )
}