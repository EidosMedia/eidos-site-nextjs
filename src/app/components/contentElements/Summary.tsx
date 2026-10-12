import { ArticleModel } from '@/types/models';
import { findElementsInContentJson, renderContent } from '@/utilities/content';

type SummaryProps = {
  data: ArticleModel;
};

const Summary: React.FC<SummaryProps> = ({ data }) => {
  const summaryContent = findElementsInContentJson(['summary'], data.files.content.data)[0];

  if (!summaryContent) {
    return null;
  }

  return (
    <div className="summary-container mb-space-lg pb-space-lg border-b border-line">
      <div className="text-copy">{renderContent(summaryContent, data, undefined, 'text-lead')}</div>
    </div>
  );
};

export default Summary;
