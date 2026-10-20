import type { NumberedCard } from '@/utilities/articleBlocks';

// Grid of numbered cards (number, title, text), built from a "01. Title. Text" table in the article body.
const NumberedCards = ({ cards }: { cards: NumberedCard[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
    {cards.map(card => (
      <div
        key={card.number}
        className="flex flex-col gap-space-md bg-canvas border border-line rounded-card shadow-md p-space-lg"
      >
        <p className="text-body text-copy-muted">{card.number}</p>
        <div className="flex flex-col gap-space-2xs">
          <p className="text-body font-title text-heading">{card.title}</p>
          <p className="text-body text-copy-muted">{card.text}</p>
        </div>
      </div>
    ))}
  </div>
);

export default NumberedCards;
