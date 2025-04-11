export function PriceOverlay({ price }: Readonly<{ price: number }>) {
  return (
    <>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="text-5xl">{price}€</div>
        <div className="text-sm text-center text-primary">
          Réservation instantanée
        </div>
      </div>
    </>
  );
}
