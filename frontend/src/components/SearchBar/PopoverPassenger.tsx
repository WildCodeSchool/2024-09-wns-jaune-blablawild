import { CircleMinus, CirclePlus } from "lucide-react";

type PopoverPassengerProps = {
  count: number;
  setCount: (value: number) => void;
};

export default function PopoverPassenger({
  count,
  setCount,
}: PopoverPassengerProps) {
  return (
    <section className="flex justify-between items-center rounded-2xl p-2 h-[40px]">
      <p className="text-foreground font-semibold">{`Passager${
        count > 1 ? "s" : ""
      }`}</p>
      <div className="flex items-center justify-center gap-4">
        <CircleMinus
          className={`text-secondary ${
            count <= 1 ? "opacity-30 cursor-default" : "cursor-pointer"
          }`}
          onClick={() => {
            if (count > 1) setCount(count - 1);
          }}
        />
        <p className="text-foreground text-xl font-semibold">{count}</p>
        <CirclePlus
  className="text-secondary cursor-pointer" 
  onClick={() => setCount(count + 1)}
        />
      </div>
    </section>
  );
}
