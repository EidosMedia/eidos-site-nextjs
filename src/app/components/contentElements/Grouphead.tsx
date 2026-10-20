import React from 'react';
import { ArticleModel } from '@/types/models';
import { findElementsInContentJson, renderContent } from '@/utilities/content';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = { title: string; href: string };

type GroupheadProps = {
  data: ArticleModel;
  breadcrumbs?: BreadcrumbItem[];
  theme?: 'light' | 'dark';
  publicationDate?: string;
};

const Grouphead: React.FC<GroupheadProps> = ({ data, breadcrumbs, theme = 'light', publicationDate }) => {
  const isDark = theme === 'dark';
  return (
    <div className="flex flex-col gap-space-sm">
      {/* BREADCRUMB */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={`flex items-center gap-space-2xs text-caption ${isDark ? 'text-inverse/80' : 'text-copy-muted'}`}>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isDark ? 'text-inverse/60' : 'text-copy-subtle'}`} />}
              <a
                href={crumb.href}
                className={`transition-colors ${isDark ? 'text-inverse underline hover:text-inverse/70' : 'hover:text-primary'}`}
              >
                {crumb.title}
              </a>
            </React.Fragment>
          ))}
        </div>
      )}
      {/* OVERHEAD & TITLE */}
      <div className={isDark ? '[&_*]:!text-inverse' : ''}>
        {renderContent(
          findElementsInContentJson(['grouphead'], data.files.content.data)[0],
          data,
          undefined,
          'flex flex-col gap-space-sm',
        )}
      </div>
      {/* PUBLICATION DATE */}
      {publicationDate && (
        <p className={`text-body-sm font-text ${isDark ? 'text-inverse/80' : 'text-copy-muted'}`}>
          Published on {publicationDate}
        </p>
      )}
    </div>
  );
};

export default Grouphead;
