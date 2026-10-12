import Link from 'next/link';
import { BaseModel, PageData, Site } from '@eidosmedia/neon-frontoffice-ts-sdk';
import clsx from 'clsx';

export default function Navbarsite({ data }: { data: Site }) {
  return (
    <nav className="w-full h-20 bg-canvas sticky top-0">
      <div className="container mx-auto px-space-sm h-full">
        <div className="flex justify-center items-center h-full">
          <Link className="flex items-center" href="/">
            <img src={data.logoUrl} alt={''} className="h-20" />
          </Link>
          <ul className="hidden md:flex gap-x-space-md">
            {data.root.items.map(item => (
              <li key={item.id}>
                <Link href={item.path} className={clsx(false && 'text-primary')}>
                  <span className="text-lead">{item.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search">
                <span className="text-lead">🔍 Search</span>
              </Link>
            </li>
          </ul>
          <button />
        </div>
      </div>
    </nav>
  );
}
