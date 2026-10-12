import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Navbar from '../components/Navbar';
import { WebpageModel } from '@/types/models/WebpageModel';
import DefaultSectionItemsRenderer from '../components/DefaultSectionItemsRenderer';
import Footer from '../components/Footer';
import HomeWebPage from './HomeWebPage';

type PageProps = {
  data: PageData<WebpageModel>;
};

const Landing: React.FC<PageProps> = ({ data }) => {
  return <HomeWebPage data={data} />;
};

export default Landing;
