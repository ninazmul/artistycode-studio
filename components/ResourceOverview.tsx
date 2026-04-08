interface OverviewProps {
  description: string;
}

const ResourceOverview = ({ description }: OverviewProps) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Overview</h2>
    <p className="text-white/90 leading-relaxed whitespace-pre-line">
      {description}
    </p>
  </div>
);

export default ResourceOverview;
