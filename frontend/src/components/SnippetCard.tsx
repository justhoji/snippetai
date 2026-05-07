interface SnippetCardProps {
  title: string;
  language: string;
  summary: string;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, language, summary }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-indigo-600 px-2 py-1 bg-indigo-50 rounded group-hover:bg-indigo-100 transition-colors">
          {language}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {summary}
      </p>
    </div>
  );
};

export default SnippetCard;
