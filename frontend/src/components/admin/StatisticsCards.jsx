import { ChartBarIcon, InboxIcon, SearchIcon, CheckCircleIcon, SparklesIcon } from '../common/Icons';

const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      title: 'Total candidatures',
      value: statistics.total,
      Icon: ChartBarIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Soumis',
      value: statistics.byStatut?.soumis || 0,
      Icon: InboxIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'En examen',
      value: statistics.byStatut?.examen || 0,
      Icon: SearchIcon,
      color: 'bg-orange-500',
    },
    {
      title: 'Admis',
      value: statistics.byStatut?.admis || 0,
      Icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Récentes (24h)',
      value: statistics.recent,
      Icon: SparklesIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.Icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-full p-3 text-white`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;

