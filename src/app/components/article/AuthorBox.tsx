import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';

type AuthorBoxProps = {
  name?: string;
  role?: string;
  photoUrl?: string;
  bio: ContentElement[];
  data: ArticleModel;
};

// "About the Author" box at the end of the article; the sidebar "Author" link points to it (#author).
const AuthorBox = ({ name, role, photoUrl, bio, data }: AuthorBoxProps) => (
  <section id="author" className="relative bg-surface-muted rounded-card p-space-xl scroll-mt-space-lg">
    {photoUrl && (
      <img
        src={photoUrl}
        alt={name || 'Author'}
        className="absolute -top-space-md right-space-xl w-28 h-28 rounded-full object-cover"
      />
    )}
    <p className="text-body text-heading mb-space-md">About the Author</p>
    {name && <p className="text-lead text-heading">{name}</p>}
    {role && <p className="text-body text-copy-muted">{role}</p>}
    {bio.length > 0 && (
      <div className="flex flex-col gap-space-md mt-space-md text-body text-copy-muted [&_p]:m-0">
        {bio.map(el => renderContent(el, data))}
      </div>
    )}
  </section>
);

export default AuthorBox;
