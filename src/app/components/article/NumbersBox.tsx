type NumbersBoxProps = {
  title?: string;
  items: { value: string; label: string }[];
};

// "By the numbers" box: key figures (value + label) on a primary background.
const NumbersBox = ({ title, items }: NumbersBoxProps) => (
  <section className="bg-primary text-inverse rounded-card p-space-xl">
    {title && <p className="text-lead mb-space-lg">{title}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-lg text-center">
      {items.map(({ value, label }) => (
        <div key={`${value}-${label}`} className="flex flex-col items-center gap-space-xs">
          <p className="text-h1 font-light">{value}</p>
          <p className="text-caption max-w-reading">{label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default NumbersBox;
