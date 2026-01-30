import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, Share2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DayCard as DayCardType } from '../../types/dayCardTypes';
import TimerDisplay from './TimerDisplay';
import PassengerForm from '../PassengerForm';

interface DayCardDetailsProps {
  card: DayCardType;
}

const DayCardDetails: React.FC<DayCardDetailsProps> = ({ card }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(card.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Decide if form is locked (e.g., if archived or if no timers yet?)
  const isLocked = card.formState === 'archived';

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header / Navigation Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group"
          >
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </div>
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <button className="p-3 text-gray-400 hover:text-red-600 transition-colors">
              <Share2 size={20} />
            </button>
            <div className="h-6 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver</p>
                <p className="text-sm font-bold text-gray-900">Hussein Deeb</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                HD
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Main Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] bg-gray-900 p-8 md:p-16 text-white overflow-hidden mb-12 shadow-2xl shadow-gray-200"
        >
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-red-600/20 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-widest text-red-100">
                  Daily Schedule
                </span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  card.formState === 'scheduled' ? 'bg-green-600/20 border border-green-500/30 text-green-100' : 'bg-amber-600/20 border border-amber-500/30 text-amber-100'
                }`}>
                  {card.formState}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                {formattedDate}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span className="font-bold">Trip Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="font-bold">Route: South - Beirut</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
              <div className="text-center">
                <p className="text-4xl font-black mb-1">{card.busTimers.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Planned Trips</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <p className="text-4xl font-black mb-1">24</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Seats Left</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Timer Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TimerDisplay timers={card.busTimers} formState={card.formState} />
            
            {/* Additional Info Helper */}
            <div className="mt-10 p-8 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[2.5rem] flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                <Info size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 mb-1">Important Notice</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Departure times might slightly vary depending on traffic conditions. 
                  Please be at the pickup location 10 minutes before the scheduled time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Passenger Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PassengerForm 
              dayCardId={card.dayCardId} 
              availableTimes={card.busTimers} 
              isLocked={isLocked}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DayCardDetails;
