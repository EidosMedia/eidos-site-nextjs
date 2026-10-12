import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { extractPlainText } from '@/utilities/content';

type AuthorCardProps = {
  photoUrl?: string;
  name?: string;
  role?: string;
  bioElements: ContentElement[];
};

export default function AuthorCard({ photoUrl, name, role, bioElements }: AuthorCardProps) {
  const bioParagraphs = bioElements.filter(el => {
    if (el.nodeType !== 'p') return false;
    const text = extractPlainText(el).trim();
    return text.length > 0 && !/^_+$/.test(text);
  });

  if (!bioParagraphs.length && !photoUrl && !name) return null;

  return (
    <div id="author-section" className="bg-surface-muted rounded-xl border border-line p-space-lg my-space-2xl">
      <div className="flex items-start gap-space-sm mb-space-sm">
        {photoUrl ? (
          <img src={photoUrl} alt={name || 'Author'} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-line flex-shrink-0" />
        )}
        {name && (
          <div className="flex flex-col">
            <p className="eyebrow text-primary mb-space-xs">About the author</p>
            <p className="text-h3 text-heading">{name}</p>
            {role && <p className="text-body-sm text-copy-muted mt-space-3xs">{role}</p>}
          </div>
        )}
      </div>
      {bioParagraphs.length > 0 && (
        <div className="flex flex-col gap-space-sm">
          {bioParagraphs.map((el, i) => (
            <p key={i} className="text-body text-copy">
              {extractPlainText(el)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
