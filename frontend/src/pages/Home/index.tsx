import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, ArrowRight, Users } from 'lucide-react';
import { useGetAllDriversQuery } from '../../state/services/user/userAPI';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { data: drivers, isLoading, isError } = useGetAllDriversQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredDrivers = drivers?.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 text-center font-inter">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-red-50 max-w-lg">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">{t('home.error.title')}</h3>
          <p className="text-gray-500 font-medium mb-10">
            {t('home.error.desc')}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            {t('home.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 font-inter">
      {/* Hero Section */}
      <div className="relative bg-gray-900 pt-20 pb-24 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] -mr-80 -mt-80 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px] -ml-80 -mb-80 animate-pulse opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-gray-300 mb-10 inline-block shadow-xl">
              {t('home.hero.badge')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9] uppercase italic">
              {t('home.hero.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">{t('home.hero.titlePremium')}</span> {t('home.hero.titleDrivers')}
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative group mt-16 px-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/50 to-green-600/50 rounded-[4rem] blur-xl opacity-0 group-focus-within:opacity-40 transition duration-700" />
              <div className="relative flex items-center bg-white/5 backdrop-blur-2xl rounded-[4rem] p-2 border border-white/10 shadow-2xl overflow-hidden">
                 <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30" />
                <div className="pl-10 pr-4">
                  <Search className="w-6 h-6 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder={t('home.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-6 text-lg text-white font-bold bg-transparent outline-none placeholder:text-gray-500 transition-all"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Drivers List Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        {/* Stats Section with sleek design */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex items-center gap-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100/50 shadow-inner">
                    <Users className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h4 className="text-3xl font-black text-gray-900">{filteredDrivers?.length}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('home.stats.fleet')}</p>
                </div>
            </div>
            {/* Design accents */}
            <div className="hidden md:block col-span-2 bg-gradient-to-r from-red-600 to-green-600 rounded-[2.5rem]">
                <div className="bg-white/90 backdrop-blur-xl h-full w-full rounded-[2.5rem] px-10 flex justify-between">
                    <div className="flex justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('home.stats.verified')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('home.stats.availability')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Improved Grid with New Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode='popLayout'>
            {filteredDrivers?.map((driver, index) => (
              <motion.div
                key={driver._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group h-full"
              >
                <div 
                  className="relative bg-white rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100/50 h-full flex flex-col group-hover:-translate-y-2 group-hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out"
                >
                  {/* Card Header Illustration/Image */}
                  <div className="h-32 w-full relative overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-700 ease-out rounded-t-[3rem]">
                     {driver.coverImage ? (
                        <img 
                          src={driver.coverImage} 
                          alt={`${driver.name} cover`} 
                          className="w-full h-full object-cover"
                        />
                     ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-green-600 opacity-20" />
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                        </>
                     )}
                  </div>

                  {/* Profile Avatar Overlap */}
                  <div className="relative -mt-14 px-8 flex items-end justify-between mb-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-[2rem] shadow-xl relative z-10 group-hover:rotate-3 transition-transform duration-500">
                        <div className="w-full h-full bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black relative overflow-hidden">
                           {driver.profileImage ? (
                              <img 
                                src={driver.profileImage} 
                                alt={driver.name} 
                                className="w-full h-full object-cover rounded-[1.4rem]"
                              />
                           ) : (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-green-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10">
                                  {driver.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </>
                           )}
                        </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-8 pb-5 flex flex-col flex-1 relative z-10">
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-red-600 transition-colors uppercase italic leading-none mb-2">
                              {driver.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.25em]">{t('home.card.status')}</span>
                            </div>
                          </div>
                          <div className="bg-gray-100 text-gray-900 p-2 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                             <Users size={14} />
                          </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="group/item flex items-center gap-5 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-red-50 group-hover/item:text-red-600 group-hover/item:scale-105 transition-all duration-500 shadow-sm border border-gray-100">
                          <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('home.card.regionLabel')}</p>
                            <p className="text-base font-bold text-gray-800 tracking-tight leading-none">{driver.region || t('home.card.regionFallback')}</p>
                        </div>
                      </div>

                      <div className="group/item flex items-center gap-5 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-green-50 group-hover/item:text-green-600 group-hover/item:scale-105 transition-all duration-500 shadow-sm border border-gray-100">
                          <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('home.card.contactLabel')}</p>
                            <p className="text-base font-bold text-gray-800 tracking-tight leading-none">{driver.phoneNumber || '+961 XX XXX XXX'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-2 border-t border-dashed border-gray-100 relative flex items-center justify-end">
                        <button 
                          onClick={() => navigate(`/${currentLang}/profile/${driver._id}`)}
                          className="flex items-center gap-4 group/btn cursor-pointer transition-transform duration-300 active:scale-95"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-0 group-hover/btn:opacity-100 transition-all duration-500 translate-x-2 group-hover/btn:translate-x-0">
                              {t('home.card.viewProfile')}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-gray-900/20 group-hover/btn:scale-110 group-hover/btn:bg-red-600 group-hover/btn:shadow-red-600/30 transition-all duration-500 relative">
                                <ArrowRight size={16} className="group-hover/btn:rotate-[-45deg] transition-transform duration-500 relative z-10" />
                            </div>
                        </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredDrivers?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/50"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-gray-100 shadow-inner">
                <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">{t('home.empty.title')}</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-12">
              {t('home.empty.desc')} "<span className="text-red-600 font-black">{searchQuery}</span>". 
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-12 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl active:scale-95"
            >
              {t('home.empty.reset')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
