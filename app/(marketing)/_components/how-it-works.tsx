const items = [
  {
    index: 1,
    title: "Create your Event",
    description:
      "Tell us what you're planning ? event type, date, guest count, and budget. Takes less than 2 minutes.",
  },
  {
    index: 2,
    title: "Compare and Negotiate",
    description:
      "Browse verified vendors and venues, compare prices, chat directly, and negotiate the best deal for your event.",
  },
  {
    index: 3,
    title: "Book and Pay Securely",
    description:
      "Confirm your booking with a protected deposit. Your payment stays secure until the job is done.",
  },
];

const Item = ({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) => {
  return (
    <div className="max-w-md flex flex-col items-center justify-center gap-2">
      <p className="font-bold text-lg size-8 flex items-center justify-center rounded-full bg-neutral-100">
        {index}
      </p>
      <h4 className="text-lg text-neutral-800 font-semibold">{title}</h4>
      <p className="prose-body ">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="w-full">
      <h2 className="heading-2">How it works</h2>
      <div className="flex items-center justify-around flex-wrap gap-4">
        {items
          .sort((a, b) => a.index - b.index)
          .map((item) => (
            <Item {...item} key={item.index} />
          ))}
      </div>
    </section>
  );
};

export default HowItWorks;
