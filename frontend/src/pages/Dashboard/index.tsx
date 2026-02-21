import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, LayoutGrid, AlertCircle } from 'lucide-react';
import { 
  useGetDayCardsQuery, 
  useCreateDayCardMutation, 
  useUpdateDayCardMutation, 
  useDeleteDayCardMutation 
} from '../../state/services/dayCard/dayCardAPI';
import DayCard from '../../components/DayCard/DayCard';
import DayCardForm from '../../components/DayCard/DayCardForm';
import type { DayCard as DayCardType, DayCardFormData, CreateDayCardRequest, UpdateDayCardRequest } from '../../types/dayCardTypes';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: cards, isLoading, isError, refetch } = useGetDayCardsQuery(user?._id || "");
  const [createCard, { isLoading: isCreating }] = useCreateDayCardMutation();
  const [updateCard, { isLoading: isUpdating }] = useUpdateDayCardMutation();
  const [deleteCard] = useDeleteDayCardMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<DayCardType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateOrUpdate = async (formData: DayCardFormData) => {
    try {
      if (editingCard) {
        await updateCard({
          ...formData,
          dayCardId: editingCard.dayCardId
        } as UpdateDayCardRequest).unwrap();
        toast.success(t('dashboard.toast.updateSuccess'));
      } else {
        await createCard({
          ...formData,
          driverId: user?._id || user?.id || ''
        } as CreateDayCardRequest).unwrap();
        toast.success(t('dashboard.toast.createSuccess'));
      }
      setIsFormOpen(false);
      setEditingCard(null);
    } catch (err) {
      toast.error(t('dashboard.toast.error'));
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('dashboard.confirmDelete'))) {
      try {
        await deleteCard(id).unwrap();
        toast.success(t('dashboard.toast.deleteSuccess'));
      } catch (err) {
        toast.error(t('dashboard.toast.deleteError'));
      }
    }
  };

  const filteredCards = cards?.filter(card => 
    new Date(card.date).toLocaleDateString(i18n.language).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-500 font-medium">
              {t('dashboard.subtitle')}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingCard(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold shadow-2xl shadow-gray-200 hover:shadow-gray-300 transition-all"
          >
            <Plus size={20} />
            {t('dashboard.addNew')}
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {isFormOpen ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <DayCardForm
                initialData={editingCard}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingCard(null);
                }}
                isLoading={isCreating || isUpdating}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="relative w-full md:w-96 group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder={t('dashboard.searchPlaceholder')}
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-red-600/20 rounded-2xl shadow-sm focus:outline-none transition-all font-bold placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Grid with custom border styling on empty state or main container */}
              <div className="relative">
                {isLoading ? (
                  <Loader />
                ) : isError ? (
                  <div className="bg-red-50 border-2 border-red-100 p-12 rounded-[2.5rem] flex flex-col items-center text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{t('dashboard.error.title')}</h3>
                    <p className="text-gray-500 mb-8 font-medium">{t('dashboard.error.desc')}</p>
                    <button 
                      onClick={() => refetch()}
                      className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200"
                    >
                      {t('dashboard.error.retry')}
                    </button>
                  </div>
                ) : filteredCards && filteredCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCards.map((card) => (
                      <DayCard
                        key={card.dayCardId}
                        card={card}
                        showStats={true}
                        onEdit={(card) => {
                          setEditingCard(card);
                          setIsFormOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="relative p-20 rounded-[3rem] overflow-hidden group">
                    {/* Special Corner Borders Design */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-red-600 rounded-tl-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-green-600 rounded-br-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                        <LayoutGrid className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{t('dashboard.empty.title')}</h3>
                      <p className="text-gray-500 font-medium max-w-sm mb-10">
                        {t('dashboard.empty.desc')}
                      </p>
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-10 py-4 bg-gradient-to-r from-red-700 to-green-600 text-white rounded-[1.5rem] font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95"
                      >
                        {t('dashboard.empty.cta')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
