import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import AboutPage from '../_pages/AboutPage';
import Article from '../_pages/Article';
import ArticleLongform from '../_pages/ArticleLongform';
import DefaultLanding from '../_pages/DefaultLanding';
import DefaultSection from '../_pages/DefaultSection';
import LatestNews from '../_pages/LatestNews';
import NewsArticle from '../_pages/NewsArticle';
import Newsroom from '../_pages/Newsroom';
import Updater from '../_pages/Updater';
import UpdaterArticle from '../_pages/UpdaterArticle';
import UpdaterTopic from '../_pages/UpdaterTopic';
import HomeWebPage from '../_pages/HomeWebPage';
import Liveblog from '../_pages/Liveblog';
import SearchPage from '../_pages/SearchPage';
import SectionWebPage from '../_pages/SectionWebPage';
import WebpageColumnsLayout from '../_pages/WebpageColumnsLayout';
import LoggedUserBar from '../components/LoggedUserOverlay/LoggedUserBar';
import type { Metadata } from 'next';
import { getAuthOptions } from '@/utilities/security';
import TempEntryPage from '../components/baseComponents/TempEntryPage';
import LoginPage from '../_pages/LoginPage';
import NewsCategory from '../_pages/NewsCategory';
import { isNewsCategorySlug, getNewsCategory } from '@/utilities/newsCategories';
import { isUpdaterTopicSlug } from '@/utilities/updaterTopics';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentHeaders = await headers();
  const hostname = currentHeaders.get('x-neon-backend-url');
  const siteName = currentHeaders.get('x-neon-site-name');
  const viewStatus = currentHeaders.get('x-neon-view-status') as string;
  const path = currentHeaders.get('x-neon-pathname') as string;
  const slug = (await params).slug || [];
  const id = (await searchParams)?.id;

  if (slug && slug.length === 1) {
    const site = await connection.findSite(siteName ?? '');

    switch (slug[0]) {
      case 'ui':
        return <TempEntryPage />;

      case 'search':
        if (site) {
          return (
            <div className="root" data-theme={site.root.attributes?.theme}>
              <LoggedUserBar data={{ siteData: { ...site, viewStatus } }} />
              <SearchPage data={site} />
            </div>
          );
        }
      case 'about':
        if (site) {
          return (
            <div className="root" data-theme={site.root.attributes?.theme}>
              <LoggedUserBar data={{ siteData: { ...site, viewStatus } }} />
              <AboutPage data={site} />
            </div>
          );
        }
      case 'login':
        if (site) {
          return (
            <div className="root" data-theme={site.root.attributes?.theme}>
              <LoggedUserBar data={{ siteData: { ...site, viewStatus } }} />
              <LoginPage data={site} />
            </div>
          );
        }
    }
  }

  const auth = await getAuthOptions();
  const url = resolveUrl(hostname, path, id as string);

  let pageData;

  try {
    pageData = await connection.makePageRequest(url, auth, {
      redirect: 'manual',
      cache: 'no-cache',
    });
  } catch (error: any) {
    if (error.status === 404) {
      // No content lives at this exact path. If the last segment names one of the
      // Newsroom news categories, try rendering it as a filtered view of the parent
      // section instead (e.g. /about-eidosmedia/newsroom/news-release/).
      const lastSegment = slug[slug.length - 1];
      if (slug.length > 1 && isNewsCategorySlug(lastSegment)) {
        const parentJson = await loadParentSection(hostname, slug, id as string, auth);
        if (parentJson) {
          return (
            <div className="root" data-theme={parentJson.siteNode?.attributes?.theme}>
              <LoggedUserBar
                data={{
                  ...parentJson,
                  editUrl: `${process.env.NEON_APP_URL}/neon/app/neon.html#open/${parentJson.model.data.id}`,
                }}
              />
              <NewsCategory data={parentJson} category={lastSegment} />
            </div>
          );
        }
      }
      notFound();
    }

    // handle 401 and 403 unauthorized
    if (error.status === 401 || error.status === 403 || error.status === 410) {
      notFound();
    }
  }

  if (!pageData) {
    notFound();
  }

  // handle redirection
  if (pageData.status > 300 && pageData.status < 400) {
    const newLocation = pageData.headers.get('Location') as string;
    redirect(newLocation);
  }

  const pageDataJSON = await pageData.json();
  console.log('Current page model', pageDataJSON);

  if (process.env.NODE_ENV === 'development' && pageData.status >= 500) {
    throw new Error(pageDataJSON.model.data.trace);
  }

  const siteLive = await connection.findSite(siteName ?? '', 'live');
  const sitePreview = await connection.findSite(siteName ?? '', 'preview');

  pageDataJSON.liveHost = siteLive?.root.hostname;
  pageDataJSON.previewHost = sitePreview?.root.hostname;

  // A category section created in Neon (e.g. /about-eidosmedia/newsroom/news-release/) is rendered
  // as a filtered view of the parent Newsroom, merged with the articles published in the section itself.
  // Same for an Updater topic section (e.g. /updater/technology/): the topic page, built from the parent Updater.
  const categorySlug = slug[slug.length - 1];
  const isEidosmediaSubsection =
    pageDataJSON?.siteData?.siteName === 'Eidosmedia' &&
    pageDataJSON?.model?.data?.sys?.baseType === 'section' &&
    slug.length > 1;
  const isUpdaterTopicSection = isEidosmediaSubsection && slug[0] === 'updater' && isUpdaterTopicSlug(categorySlug);
  const newsroomParent =
    isEidosmediaSubsection && isNewsCategorySlug(categorySlug)
      ? await loadParentSection(hostname, slug, id as string, auth)
      : undefined;
  const updaterParent = isUpdaterTopicSection ? await loadParentSection(hostname, slug, id as string, auth) : undefined;

  const resolvePage = () => {
    const baseType = pageDataJSON?.model?.data?.sys?.baseType as string;
    const type = pageDataJSON?.model?.data?.sys?.type as string;
    const currentSiteName = pageDataJSON?.siteData?.siteName as string;
    const isEidosmedia = currentSiteName === 'Eidosmedia';
    const pageUrl = (pageDataJSON?.model?.data?.url ?? '') as string;
    const isNewsroomArticle = isEidosmedia && /\/newsroom\//.test(pageUrl);
    // "Insights - The Updater" blog, a different section from the Newsroom
    const isUpdaterSection = isEidosmedia && /^\/updater\//.test(pageUrl);
    const eidosmediaArticle = isNewsroomArticle ? (
      <NewsArticle data={pageDataJSON} />
    ) : isUpdaterSection ? (
      <UpdaterArticle data={pageDataJSON} />
    ) : (
      <LatestNews data={pageDataJSON} />
    );
    console.log('Resolving page for baseType:', baseType);
    console.log('Resolving page for type:', type);
    //console.log('Page Data JSON:', JSON.stringify(pageDataJSON));
    switch (baseType) {
      case 'webpage':
        return <WebpageColumnsLayout data={pageDataJSON} />;

      case 'sectionwebpage':
        return <SectionWebPage data={pageDataJSON} />;

      case 'homewebpage':
        return <HomeWebPage data={pageDataJSON} />;

      case 'section':
        if (newsroomParent && isNewsCategorySlug(categorySlug)) {
          return <NewsCategory data={newsroomParent} category={categorySlug} sectionData={pageDataJSON} />;
        }
        if (updaterParent && isUpdaterTopicSlug(categorySlug)) {
          return <UpdaterTopic data={updaterParent} topic={categorySlug} />;
        }
        if (isUpdaterSection) return <Updater data={pageDataJSON} />;
        return isEidosmedia ? <Newsroom data={pageDataJSON} /> : <DefaultSection data={pageDataJSON} />;

      case 'site':
        return <DefaultLanding data={pageDataJSON} />;

      case 'liveblog':
        return <Liveblog data={pageDataJSON} />;

      case 'article':
        switch (type) {
          case 'longform':
            return <ArticleLongform data={pageDataJSON} />;
          default:
            return isEidosmedia ? eidosmediaArticle : <Article data={pageDataJSON} />;
        }

      default:
        return isEidosmedia ? eidosmediaArticle : <Article data={pageDataJSON} />;
    }
  };

  return (
    <div className="root" data-theme={pageDataJSON.siteNode.attributes.theme}>
      <LoggedUserBar
        data={{
          ...pageDataJSON,
          editUrl: `${process.env.NEON_APP_URL}/neon/app/neon.html#open/${pageDataJSON.model.data.id}`,
        }}
      />
      {resolvePage()}
    </div>
  );
}

function resolveUrl(hostname: string | null, path: string, id?: string | null) {
  const baseUrl = `${hostname}${path}`;
  return id !== undefined && id ? `${baseUrl.replace(/\/$/, '')}/${id}` : baseUrl;
}

// Parent listing section (Newsroom, Updater) of a category URL, or undefined if it isn't an Eidosmedia section.
async function loadParentSection(
  hostname: string | null,
  slug: string[],
  id: string | undefined,
  auth: Awaited<ReturnType<typeof getAuthOptions>>,
) {
  const parentPath = '/' + slug.slice(0, -1).join('/') + '/';
  try {
    const parentResponse = await connection.makePageRequest(resolveUrl(hostname, parentPath, id), auth, {
      redirect: 'manual',
      cache: 'no-cache',
    });
    const parentJson = await parentResponse.json();
    const isNewsroom =
      parentJson?.model?.data?.sys?.baseType === 'section' && parentJson?.siteData?.siteName === 'Eidosmedia';
    return isNewsroom ? parentJson : undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const currentHeaders = await headers();

  const hostname = currentHeaders.get('x-neon-backend-url');
  const path = currentHeaders.get('x-neon-pathname') as string;
  const slug = (await params).slug || [];
  const id = (await searchParams)?.id;
  const auth = await getAuthOptions();

  const url = resolveUrl(hostname, path, id as string);
  try {
    let title;

    if (slug && slug.length === 1) {
      switch (slug[0]) {
        case 'search':
          return { title: 'Search' };
        case 'about':
          return { title: 'About' };
        case 'login':
          return { title: 'Login' };
      }
    }
    const pageData = await connection.makePageRequest(url, auth, {
      redirect: 'manual',
      cache: 'no-cache',
    });

    if (pageData.status == 200) {
      const pageDataJSON = await pageData.json();

      if (!title) {
        title = pageDataJSON.model.data.title;
      }

      return {
        title: `${pageDataJSON.siteData.siteName} - ${title}`,
        description: pageDataJSON.model.data.summary,
      };
    } else {
      return {
        title: 'Error',
        description: 'Failed to generate metadata.',
      };
    }
  } catch (error) {
    const lastSegment = slug[slug.length - 1];
    if (slug.length > 1 && isNewsCategorySlug(lastSegment)) {
      try {
        const parentPath = '/' + slug.slice(0, -1).join('/') + '/';
        const parentUrl = resolveUrl(hostname, parentPath, id as string);
        const parentResponse = await connection.makePageRequest(parentUrl, auth, {
          redirect: 'manual',
          cache: 'no-cache',
        });
        const parentJson = await parentResponse.json();
        const categoryLabel = getNewsCategory(lastSegment)?.plural;
        if (categoryLabel) {
          return {
            title: `${parentJson.siteData.siteName} - ${categoryLabel}`,
            description: `${categoryLabel} from ${parentJson.model.data.title}`,
          };
        }
      } catch (fallbackError) {
        console.warn('Error generating category metadata:', fallbackError);
      }
    }

    console.warn('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'Failed to generate metadata.',
    };
  }
}
