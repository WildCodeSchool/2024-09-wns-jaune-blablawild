import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <div className="flex flex-col p-4 gap-4 md:gap-8 h-screen items-center justify-center ">
      <h1 className="text-7xl">Drive Up</h1>
      <p className="text-lg w-1/2 text-center">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore
        quibusdam impedit vero deleniti ducimus doloremque laboriosam, tenetur
        minus neque ipsam laborum eos aliquam dicta eum facere iusto autem quae.
      </p>
      <div className="flex gap-4">
        <Input placeholder="Type something" className="" />
        <Button size="lg" variant="secondary">
          Click me
        </Button>
        <Badge>Badge</Badge>
      </div>
    </div>
  );
}

export default App;
