export function PriceOverlay({ price, capacity }: Readonly<{ price: number, capacity: number }>) {
  return (
    <>
      <div className="absolute inset-0 bg-black/40" />
      {capacity > 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="text-2xl md:text-5xl">{price}€</div>
          <div className="text-[10px] md:text-sm text-center text-primary">
            Réservation instantanée
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl md:text-5xl text-white p-2 text-center">
            Complet
          </div>
        </div>
      )}
    </>
  );
}