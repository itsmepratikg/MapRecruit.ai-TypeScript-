
import React from 'react';
import { User } from '../../../components/Icons';
import { userService } from '../../../services/api';

export const RecentlyVisitedProfiles = () => {
  const [visits, setVisits] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchVisits = async () => {
      try {
        const data = await userService.getRecentVisits();
        setVisits(data);
      } catch (err) {
        console.error("Failed to fetch recent visits", err);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div className="space-y-3">
      {visits.map(visit => (
        <div key={visit._id || visit.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 font-bold text-sm">
              <User size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-slate-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {visit.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">{visit.type}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(visit.date || visit.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
