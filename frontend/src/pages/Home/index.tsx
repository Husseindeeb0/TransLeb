import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, ArrowRight, Loader2, Users } from 'lucide-react';
import { useGetAllDriversQuery } from '../../state/services/user/userAPI';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { data: drivers, isLoading, isError } = useGetAllDriversQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredDrivers = drivers?.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4 font-inter">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-red-600" />
        </motion.div>
        <p className="font-black text-gray-500 text-lg uppercase tracking-widest">Finding Drivers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 text-center font-inter">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-red-50 max-w-lg">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">Error Loading Drivers</h3>
          <p className="text-gray-500 font-medium mb-10">
            We encountered a problem fetching our driver partners. Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-inter">
      {/* Hero Section */}
      <div className="relative bg-gray-900 pt-32 pb-24 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] -mr-80 -mt-80 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px] -ml-80 -mb-80 animate-pulse opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-gray-300 mb-10 inline-block shadow-xl">
              Partner network
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9] uppercase italic">
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">Premium</span> Drivers
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
                  placeholder="Who are you looking for?"
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
        <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex items-center gap-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100/50 shadow-inner">
                    <Users className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h4 className="text-3xl font-black text-gray-900">{filteredDrivers?.length}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Fleet</p>
                </div>
            </div>
            {/* Design accents */}
            <div className="hidden md:block col-span-2 bg-gradient-to-r from-red-600 to-green-600 p-px rounded-[2.5rem]">
                <div className="bg-white/90 backdrop-blur-xl h-full w-full rounded-[2.5rem] px-10 flex items-center justify-between">
                    <div className="flex gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified background</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">24/7 Availability</span>
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
                  className="relative bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100/50 cursor-pointer overflow-hidden h-full flex flex-col group-hover:-translate-y-4 group-hover:shadow-[0_45px_70px_-25px_rgba(0,0,0,0.15)] group-hover:border-red-100 transition-all duration-700 ease-out"
                  onClick={() => navigate(`/profile/${driver._id}`)}
                >
                  {/* Card Header Color - Placeholder for Image */}
                  <div className="h-40 w-full relative overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-700 ease-out">
                     <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-green-600 opacity-20" />
                     {/* Pattern Overlay */}
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                  </div>

                  {/* Profile Avatar Overlap */}
                  <div className="relative -mt-16 px-10 flex items-end justify-between mb-8">
                    <div className="w-28 h-28 bg-white p-2 rounded-[2.5rem] shadow-xl relative z-10 group-hover:rotate-6 transition-transform duration-500">
                        <div className="w-full h-full bg-gray-900 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-green-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                           <span className="relative z-10">
                             {driver.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                           </span>
                        </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-10 pb-12 flex flex-col flex-1">
                    <div className="mb-10">
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 group-hover:text-red-600 transition-colors uppercase italic leading-none">
                        {driver.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Official partner</span>
                        </div>
                    </div>
                    
                    <div className="space-y-6 mb-12">
                      <div className="flex items-center gap-5 group/item transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-500">
                          <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Service Region</p>
                            <p className="text-base font-bold text-gray-700">{driver.region || 'Beirut District'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 group/item transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all duration-500">
                          <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Contact Number</p>
                            <p className="text-base font-bold text-gray-700">{driver.phoneNumber || '+961 XX XXX XXX'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-50 relative overflow-hidden flex items-center justify-between">
                         <div className="flex flex-col">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5 leading-none">Verification</p>
                            <span className="text-xs font-black text-green-600">ID SEALED</span>
                         </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-red-600 transition-colors">
                            Explore Profile
                            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-red-600 transition-all duration-500">
                                <ArrowRight size={16} />
                            </div>
                        </div>
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
            <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">No Match Found</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-12">
              We couldn't find any drivers matching "<span className="text-red-600 font-black">{searchQuery}</span>". 
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-12 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl active:scale-95"
            >
              Reset Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
