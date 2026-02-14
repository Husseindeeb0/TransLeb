import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Clock, LayoutGrid, ListTodo, CalendarCheck, Archive, Users } from 'lucide-react';
import type { DayCard as DayCardType, DayCardFormData, BusSchedule } from '../../types/dayCardTypes';
import { useTranslation } from 'react-i18next';

interface DayCardFormProps {
  initialData?: DayCardType | null;
  onSubmit: (data: DayCardFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DayCardForm: React.FC<DayCardFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [date, setDate] = useState(
    initialData ? new Date(initialData.date).toISOString().split('T')[0] : ''
  );
  const [busTimers, setBusTimers] = useState<BusSchedule[]>(
    initialData?.busTimers?.map(item => 
      typeof item === 'string' ? { time: item, capacity: 30 } : item
    ) || []
  );
  const [newTime, setNewTime] = useState('');
  const [newCapacity, setNewCapacity] = useState<number>(30);
  const [formState, setFormState] = useState(initialData?.formState || 'open');

  const handleAddTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime) {
      setBusTimers([...busTimers, { time: newTime, capacity: newCapacity }].sort((a, b) => a.time.localeCompare(b.time)));
      setNewTime('');
      setNewCapacity(30);
    }
  };

  const removeTime = (index: number) => {
    setBusTimers(busTimers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: DayCardFormData = {
      dayCardId: initialData?.dayCardId,
    };

    let hasChanged = false;

    // Check Date
    const newDateStr = new Date(date).toISOString().split('T')[0];
    const oldDateStr = initialData ? new Date(initialData.date).toISOString().split('T')[0] : '';
    
    if (!initialData || newDateStr !== oldDateStr) {
      data.date = new Date(date);
      hasChanged = true;
    }

    // Check formState
    if (!initialData || formState !== initialData.formState) {
      data.formState = formState;
      hasChanged = true;
    }

    // Check busTimers
    if (!initialData || JSON.stringify(busTimers) !== JSON.stringify(initialData.busTimers)) {
      data.busTimers = busTimers;
      hasChanged = true;
    }

    if (hasChanged) {
      onSubmit(data);
    } else {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden"
    >
      {/* Decorative Gradient Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-green-500 to-red-600 opacity-20" />

      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          {initialData ? t('daycard.form.updateTitle') : t('daycard.form.createTitle')}
        </h2>
        <p className="text-gray-500 font-medium">
          {t('daycard.form.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date Picker */}
          <div className="space-y-3">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">
              {t('daycard.form.selectDate')}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors">
                <Calendar size={20} />
              </div>
              <input
                type="date"
                required
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600/30 transition-all font-bold text-gray-900"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Form State Selector */}
          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">
              {t('daycard.form.statusLabel')}
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'open', label: 'Open', icon: LayoutGrid, 
                  active: 'bg-blue-50 border-blue-600/30 text-blue-700 ring-blue-600/5',
                  iconColor: 'text-blue-600'
                },
                { id: 'planning', label: 'Planning', icon: ListTodo, 
                  active: 'bg-amber-50 border-amber-600/30 text-amber-700 ring-amber-600/5',
                  iconColor: 'text-amber-600'
                },
                { id: 'scheduled', label: 'Scheduled', icon: CalendarCheck, 
                  active: 'bg-green-50 border-green-600/30 text-green-700 ring-green-600/5',
                  iconColor: 'text-green-600'
                },
                { id: 'archived', label: 'Archived', icon: Archive, 
                  active: 'bg-gray-100 border-gray-400/30 text-gray-700 ring-gray-400/5',
                  iconColor: 'text-gray-500'
                },
              ].map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => setFormState(state.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-6 rounded-3xl border-2 transition-all font-bold ${
                    formState === state.id
                      ? `${state.active} ring-4`
                      : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-white'
                  }`}
                >
                  <state.icon size={24} className={formState === state.id ? state.iconColor : ''} />
                  <span className="text-xs">{t(`daycard.states.${state.id}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bus Timers Section */}
        <div className="space-y-4">
          <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">
            {t('daycard.form.timersLabel')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative group col-span-1 lg:col-span-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                <Clock size={20} />
              </div>
              <input
                type="time"
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:border-green-600/30 transition-all font-bold text-gray-900"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="relative group col-span-1 lg:col-span-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                <Users size={20} />
              </div>
              <input
                type="number"
                placeholder={t('daycard.form.capacityPlaceholder')}
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:border-green-600/30 transition-all font-bold text-gray-900"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
              />
            </div>

            <button
              type="button"
              onClick={handleAddTime}
              className="px-8 bg-gray-900 text-white rounded-2xl font-bold hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {t('daycard.form.addBus')}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <AnimatePresence>
              {busTimers.map((bus, index) => (
                <motion.div
                  key={`${bus.time}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-between gap-6 text-gray-700 font-bold shadow-sm min-w-[150px]"
                >
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-black">{t('daycard.form.time')}</span>
                    <span className="text-sm">{bus.time}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-black">{t('daycard.form.cap')}</span>
                    <span className="text-sm">{bus.capacity}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTime(index)}
                    className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {busTimers.length === 0 && (
              <p className="text-sm text-gray-400 italic ml-1">{t('daycard.form.noTimes')}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4.5 border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading || !date}
            className="flex-2 py-4.5 bg-gradient-to-r from-red-700 to-green-600 text-white rounded-2xl font-bold hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isLoading ? t('daycard.form.saving') : initialData ? t('daycard.form.update') : t('daycard.form.create')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default DayCardForm;
