type InformationCardProps = {
  title: string;
  text: string;
  index: number;
};

export const InformationCard = ({
  title,
  text,
  index,
}: InformationCardProps) => (
  <section className="flex flex-col w-9/12 text-center md:text-start">
    <h1
      className={`${
        index % 2 === 1 ? "text-forecast" : "text-accent"
      } font-semibold text-[16px] lg:text-[18px] mb-3`}
    >
      {title}
    </h1>
    <p className="text-black text-[12px] lg:text-[14px]">{text}</p>
  </section>
);
