import PageLayout from '../components/PageLayout';
import HeroSection from '../components/home/HeroSection';
import CardsSection from '../components/home/CardsSection';
import WhosUsingSection from '../components/home/WhosUsingSection';
import CouldYouUseSection from '../components/home/CouldYouUseSection';
import NewsAndViewsSection from '../components/home/NewsAndViewsSection';
import StatsBannerSection from '../components/home/StatsBannerSection';

export default async function HomeWebPage({ data }: { data: any }) {
  return (
    <PageLayout data={data} fullWidthContent={true}>
      <HeroSection />
      <CardsSection />
      <WhosUsingSection />
      <CouldYouUseSection />
      <NewsAndViewsSection />
      <StatsBannerSection />
    </PageLayout>
  );
}
