import { useParams } from 'react-router-dom';
import { useGetDayCardByIdQuery } from '../../state/services/dayCard/dayCardAPI';
import DayCardDetails from '../../components/DayCard/DayCardDetails';
import { AlertCircle } from 'lucide-react';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';

const DayCardDetailsPage = () => {
  const { t } = useTranslation();
  const { dayCardId } = useParams<{ dayCardId: string }>();
  const { data: card, isLoading, isError, refetch } = useGetDayCardByIdQuery(dayCardId || '');

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6 text-center">
        <div className="bg-red-50 p-12 rounded-[3rem] border-2 border-red-100 max-w-lg shadow-xl shadow-red-100/20">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">{t('daycard.details.error.title')}</h3>
            <p className="text-gray-500 font-medium mb-10">
                {t('daycard.details.error.desc')}
            </p>
            <button 
                onClick={() => refetch()}
                className="px-10 py-4 bg-red-600 text-white rounded-[1.5rem] font-bold shadow-lg shadow-red-200 hover:shadow-red-300 transition-all active:scale-95"
            >
                {t('daycard.details.error.retry')}
            </button>
        </div>
      </div>
    );
  }

  return <DayCardDetails card={card} />;
};

export default DayCardDetailsPage;
