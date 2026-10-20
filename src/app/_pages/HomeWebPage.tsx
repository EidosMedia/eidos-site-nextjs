import PageLayout from '../components/PageLayout';

// Home page: navbar and footer only, content to be defined
export default async function HomeWebPage({ data }: { data: any }) {
  return (
    <PageLayout data={data} fullWidthContent={true}>
      {null}
    </PageLayout>
  );
}
