interface NoTripsFoundProps {
  readonly departure: string;
  readonly arrival: string;
}

export function NoTripsFound({ departure, arrival }: NoTripsFoundProps) {
  return (
    <section className="p-10 min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <p className="md:text-xl">
          {`Aucun trajet trouvé de ${departure} à ${arrival} pour cette période.`}
        </p>
      </div>
    </section>
  );
}
