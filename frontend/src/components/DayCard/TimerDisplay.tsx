import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import type { BusSchedule } from '../../types/dayCardTypes';
import { formatTimeToAMPM } from '../../helpers';
import { useTranslation } from 'react-i18next';

interface TimerDisplayProps {
  timers: BusSchedule[];
  formState: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timers, formState }) => {
  const { t } = useTranslation();
  const isDecided = timers.length > 0;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden h-full flex flex-col">
      {/* Decorative Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-red-600 opacity-20" />

      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{t('daycard.timerDisplay.title')}</h2>
        <p className="text-gray-500 font-medium">{t('daycard.timerDisplay.subtitle')}</p>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {isDecided ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {timers.map((bus, index) => (
              <motion.div
                key={`${bus.time}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] hover:border-green-600/20 hover:bg-white transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                  <Clock size={24} />
                </div>
                <span className="text-2xl font-black text-gray-900">{formatTimeToAMPM(bus.time)}</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                   <Users size={12} className="text-red-500" />
                   {bus.capacity} {t('daycard.timerDisplay.capacity')}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-10 px-6 bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <AlertCircle size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('daycard.timerDisplay.notDecidedTitle')}</h3>
            <p className="text-gray-500 font-medium max-w-[250px]">
              {t('daycard.timerDisplay.notDecidedDesc')}
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${formState === 'scheduled' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <CheckCircle2 size={16} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black block">{t('daycard.timerDisplay.status')}</span>
            <span className="text-sm font-black text-gray-900 capitalize">{t(`daycard.states.${formState}`)}</span>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black block">{t('daycard.timerDisplay.totalTrips')}</span>
          <span className="text-2xl font-black text-gray-900">{timers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
