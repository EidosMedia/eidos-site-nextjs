import Link from 'next/link';
import ArticleOverlay from './base/ArticleOverlay';
import ErrorBoundaryContainer from './base/ErrorBoundaryContainer/ErrorBoundaryContainer';
import { Key } from 'react';
import { getNewsImageUrl } from '@/utilities/news';

type SearchResultItemProps = {
  result: any;
  data: any;
  index: number;
  onChangeSelected: (id: string, nodeId: string, title: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const convertToDateString = (dateString: string) => {
  return new Date(dateString)
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .replace(/^(\d{1,2})/, d => {
      const n = parseInt(d, 10);
      const suffix =
        n === 1 || n === 21 || n === 31 ? 'st' : n === 2 || n === 22 ? 'nd' : n === 3 || n === 23 ? 'rd' : 'th';
      return `${n}${suffix}`;
    });
};

const SearchResultItem = ({ result, data, onChangeSelected, index }: SearchResultItemProps) => {
  var title, summary;
  if (result.nodeData.attributes?.teaser?.title) {
    title = result.nodeData.attributes.teaser.title;
  } else {
    title = result.nodeData.title;
  }
  if (result.nodeData.attributes?.teaser?.summary) {
    summary = result.nodeData.attributes.teaser.summary;
  } else {
    summary = result.nodeData.summary;
  }

  // Main / teaser / link image; without one, a neutral placeholder (no broken image icon)
  const imageUrl = getNewsImageUrl(result.nodeData, 'Wide_large') ?? getNewsImageUrl(result.nodeData, 'Wide_small');

  return (
    <div key={result.nodeData.id} className="py-space-lg">
      <div className="col-span-1 relative group">
        <div className="absolute top-space-3xs left-0 z-10 flex">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary cursor-pointer"
            id="sel{index}"
            onChange={onChangeSelected(`sel${index}`, result.nodeData.id, title)}
            defaultChecked={true}
          />
        </div>
        <ArticleOverlay data={data.root} viewStatus={data.viewStatus}>
          <ErrorBoundaryContainer>
            <Link className="no-underline" href={result.nodeData.url}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md md:gap-space-xl pl-space-xl">
                <div
                  id={`item${index}`}
                  className="md:col-span-7 order-2 md:order-1 flex flex-col gap-space-2xs relative max-h-50 overflow-hidden"
                  ref={el => {
                    if (el && el.scrollHeight > el.clientHeight && !el.dataset.showMoreInitialized) {
                      el.dataset.showMoreInitialized = 'true';
                      const btn = document.createElement('button');
                      btn.textContent = 'Show more';
                      btn.className =
                        'absolute bottom-0 right-0 bg-canvas pl-space-2xs text-body-sm font-text text-primary underline border-0 cursor-pointer';
                      btn.onclick = () => {
                        el.style.maxHeight = 'none';
                        btn.remove();
                      };
                      el.appendChild(btn);
                    }
                  }}
                >
                  <p className="text-caption text-copy-muted">
                    {convertToDateString(result.nodeData?.pubInfo?.publicationTime) || ''}
                  </p>
                  <p className="text-lead font-title text-heading group-hover:underline">
                    <span dangerouslySetInnerHTML={{ __html: title }} />
                  </p>
                  {result.highlights && result.highlights['_full_text.content.all'] ? (
                    result.highlights['_full_text.content.all'].map(
                      (reference: string, idx: Key | null | undefined) => (
                        <p key={idx} className="text-body-sm text-copy-muted italic">
                          ...
                          <span dangerouslySetInnerHTML={{ __html: reference.replaceAll('\n', ' ') }} />
                          ...
                        </p>
                      ),
                    )
                  ) : (
                    <p />
                  )}
                </div>
                <div id={`photo${index}`} className="md:col-span-5 order-1 md:order-2">
                  {imageUrl ? (
                    <img
                      alt=""
                      decoding="async"
                      src={imageUrl}
                      className="w-full aspect-video object-cover rounded-media bg-surface"
                    />
                  ) : (
                    <div className="w-full aspect-video rounded-media bg-surface" />
                  )}
                </div>
              </div>
            </Link>
          </ErrorBoundaryContainer>
        </ArticleOverlay>
      </div>
    </div>
  );
};

export default SearchResultItem;
