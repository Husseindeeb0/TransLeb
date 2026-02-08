import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Search, 
  ArrowLeft, 
  MessageCircle, 
  ExternalLink,
  Info,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { useGetUserDetailsQuery } from '../../state/services/user/userAPI';
import { useGetDayCardsQuery } from '../../state/services/dayCard/dayCardAPI';
import DayCard from '../../components/DayCard/DayCard';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const DriverProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: driver, isLoading: userLoading, isError: userError } = useGetUserDetailsQuery(userId || '');
  const { data: cards, isLoading: cardsLoading } = useGetDayCardsQuery(userId || '');

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    
    // Sort from newest to oldest
    const sorted = [...cards].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (!searchQuery) return sorted;

    return sorted.filter(card => {
      const dateStr = new Date(card.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).toLowerCase();
      return dateStr.includes(searchQuery.toLowerCase());
    });
  }, [cards, searchQuery]);

  const handleWhatsAppClick = () => {
    if (driver?.phoneNumber) {
      const formattedPhone = driver.phoneNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    } else {
      toast.error('Driver phone number not available');
    }
  };

  if (userLoading || cardsLoading) return <Loader />;

  if (userError || !driver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <Info className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Driver Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">We couldn't find the driver profile you're looking for. It might have been deleted or the link is incorrect.</p>
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-inter">
      {/* Hero Section / Cover */}
      <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={driver.coverImage || '/placeholder-cover.webp'} 
            alt="Cover" 
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = '/placeholder-cover.webp')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </motion.div>

        <div className="absolute top-8 left-6 md:left-12">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold text-sm border border-white/20 hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl ring-1 ring-gray-100 bg-gray-50">
                <img 
                  src={driver.profileImage || '/placeholder-avatar.webp'} 
                  alt={driver.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/placeholder-avatar.webp')}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  {driver.name}
                </h1>
                <span className="px-5 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200">
                  {driver.role}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-gray-100 p-2 rounded-xl">
                    <MapPin size={20} className="text-red-600" />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wide">
                    {driver.region || 'All Lebanon'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <button 
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-2 group transition-all"
                  >
                    <div className="bg-green-100 p-2 rounded-xl group-hover:scale-110 transition-transform">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <span className="font-bold text-sm text-gray-600 group-hover:text-green-600 uppercase tracking-wide">
                      {driver.phoneNumber}
                    </span>
                  </button>
                </div>
              </div>

              <p className="text-gray-500 font-medium leading-relaxed max-w-3xl">
                {driver.description || "Passionate about providing safe and timely transportation for all passengers. Always on schedule and ready to cover your daily needs across lebanon regions."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-3 px-10 py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl shadow-green-100 hover:shadow-green-200 transition-all uppercase text-[11px] tracking-widest"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Schedules Section */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Driver's Schedule</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Browse through all available schedules for this driver.</p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent focus:border-red-600/10 rounded-[2rem] shadow-xl shadow-gray-100/50 focus:outline-none transition-all font-bold placeholder:text-gray-400"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredCards.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCards.map((card) => (
                <DayCard key={card.dayCardId} card={card} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-20 border-2 border-gray-50 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8">
                <LayoutGrid className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Schedules Found</h3>
              <p className="text-gray-500 max-w-sm font-medium">Try searching for a different date or check back later for new updates.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverProfile;
