import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Edit3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DayCard as DayCardType } from '../../types/dayCardTypes';

interface DayCardProps {
  card: DayCardType;
  onEdit: (card: DayCardType) => void;
  onDelete: (id: string) => void;
}

const DayCard: React.FC<DayCardProps> = ({ card, onEdit, onDelete }) => {
  const formattedDate = new Date(card.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="relative group h-full"
    >
      {/* Custom Borders - Thick in some edges, multi-color */}
      <div className="absolute inset-0 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-l-8 border-t-2 border-r-2 border-b-8 border-l-red-600 border-b-green-600 border-t-red-600/20 border-r-green-600/20 transition-all duration-300 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]" />
      
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(card)}
              className="p-2 hover:bg-green-50 rounded-xl text-green-600 transition-colors"
              title="Edit Card"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => onDelete(card.dayCardId)}
              className="p-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
              title="Delete Card"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
            {formattedDate}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Clock size={16} />
            <span className="text-sm font-medium">
              {card.busTimers.length} Scheduled Times
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {card.busTimers.slice(0, 3).map((bus, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100/50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100"
              >
                {bus.time}
              </span>
            ))}
            {card.busTimers.length > 3 && (
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">
                +{card.busTimers.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
              Status
            </span>
            <span className={`text-sm font-bold ${
              card.formState === 'scheduled' ? 'text-green-600' : 
              card.formState === 'planning' ? 'text-amber-500' :
              card.formState === 'open' ? 'text-blue-600' :
              'text-gray-500'
            }`}>
              {card.formState.charAt(0).toUpperCase() + card.formState.slice(1)}
            </span>
          </div>
          <div className="flex gap-4">
            <Link 
              to={`/day-card-stats/${card.dayCardId}`}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-wider transition-colors"
            >
              Stats
            </Link>
            <Link 
              to={`/day-card/${card.dayCardId}`}
              className="flex items-center gap-1 text-red-600 font-black text-xs uppercase tracking-wider group/btn"
            >
              View Details
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DayCard;
