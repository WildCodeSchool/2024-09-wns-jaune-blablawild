import img from "../../assets/home-background.jpg";
import About from "./About";

export default function UserProfilePage() {
    return (
    <main 
        className="flex flex-col h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
    >
        <section className="h-screen w-full self-center bg-white/80 md:w-2/3 md:bg-white">
            <div>
                <div>A propos</div>
                <div>Commentaires</div>
            </div>
            <About />
        </section>
    </main>
    )
}