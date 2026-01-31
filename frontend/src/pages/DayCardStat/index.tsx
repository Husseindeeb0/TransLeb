import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Search, 
  ArrowLeft, 
  Download, 
  MapPin, 
  Phone, 
  User as UserIcon,
  Calendar,
  Loader2,
  AlertCircle,
  Bus,
  CheckCircle2,
  Filter as FilterIcon
} from 'lucide-react';
import { useGetPassengerFormsQuery, useUpdatePassengerFormMutation } from '../../state/services/passengerForm/passengerFormAPI';
import { useGetDayCardByIdQuery } from '../../state/services/dayCard/dayCardAPI';
import toast from 'react-hot-toast';
import { formatTimeToAMPM, timeToMinutes } from '../../helpers';

const DayCardStat = () => {
  const { dayCardId } = useParams<{ dayCardId: string }>();
  const navigate = useNavigate();
  
  // Queries & Mutations
  const { data: dayCard, isLoading: isCardLoading } = useGetDayCardByIdQuery(dayCardId || '');
  const { data: response, isLoading: isPassLoading, isError, refetch } = useGetPassengerFormsQuery(dayCardId || '');
  const [updatePassenger, { isLoading: isUpdating }] = useUpdatePassengerFormMutation();

  // Local State
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'unassigned' | 'assigned'>('all');

  const passengers = response?.data || [];
  const busSchedules = dayCard?.busTimers || [];

  // Get unique bus times for the dropdown
  const uniqueBusTimes = useMemo(() => {
    const times = busSchedules.map(b => b.time);
    return [...new Set(times)].sort();
  }, [busSchedules]);

  // Aggregate total capacity per unique time slot
  const capacityPerTime = useMemo(() => {
    return busSchedules.reduce((acc, bus) => {
      acc[bus.time] = (acc[bus.time] || 0) + bus.capacity;
      return acc;
    }, {} as Record<string, number>);
  }, [busSchedules]);

  const filteredPassengers = useMemo(() => {
    return passengers.filter((p) => {
      const pTime = timeToMinutes(p.desiredTime);
      const start = timeToMinutes(startTime);
      const end = timeToMinutes(endTime);
      
      const matchesTime = pTime >= start && pTime <= end;
      const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.phoneNumber.includes(searchQuery) ||
                            p.livingPlace.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAssignment = assignmentFilter === 'all' || 
                                (assignmentFilter === 'unassigned' && !p.assignedBusTime) ||
                                (assignmentFilter === 'assigned' && p.assignedBusTime);

      return matchesTime && matchesSearch && matchesAssignment;
    });
  }, [passengers, startTime, endTime, searchQuery, assignmentFilter]);

  const totalPassengerSeats = useMemo(() => {
    return filteredPassengers.reduce((sum, p) => sum + p.passengerCount, 0);
  }, [filteredPassengers]);

  // Bus assignment summary (current usage)
  const busLoadSummary: Record<string, number> = useMemo(() => {
    const summary = uniqueBusTimes.reduce((acc, time) => {
      acc[time] = passengers.filter(p => p.assignedBusTime === time)
                            .reduce((sum, p) => sum + p.passengerCount, 0);
      return acc;
    }, {} as Record<string, number>);
    
    const unassigned = passengers.filter(p => !p.assignedBusTime)
                                .reduce((sum, p) => sum + p.passengerCount, 0);
                                
    return { ...summary, unassigned };
  }, [passengers, uniqueBusTimes]);

  const handleAssignBus = async (formId: string, assignedBusTime: string | null) => {
    try {
      await updatePassenger({
        formId,
        assignedBusTime: assignedBusTime === "unassigned" ? null : assignedBusTime
      }).unwrap();
      toast.success('Passenger assignment updated');
    } catch (err) {
      toast.error('Failed to update assignment');
    }
  };

  const isLoading = isCardLoading || isPassLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="font-bold text-gray-500">Loading reservation data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border-2 border-red-50/50 text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Connection Failed</h2>
          <p className="text-gray-500 font-medium mb-8">We couldn't fetch the passenger statistics. Please check your connection.</p>
          <button 
            onClick={() => refetch()}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-2xl transition-all hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Passenger Statistics</h1>
              <p className="text-sm font-medium text-gray-400">Detailed overview of all reservations</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600/5 text-red-600 rounded-2xl font-bold border border-red-600/10 hover:bg-red-600/10 transition-all">
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content (List & Filters) */}
          <div className="lg:col-span-8">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <Users className="text-red-500 mb-4" size={24} />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Passengers</p>
                <h3 className="text-4xl font-black">{filteredPassengers.length}</h3>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 border-2 border-gray-50 shadow-sm relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/5 rounded-full -ml-16 -mb-16 blur-2xl" />
                <Calendar className="text-green-600 mb-4" size={24} />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Seats Booked</p>
                <h3 className="text-4xl font-black text-gray-900">{totalPassengerSeats}</h3>
              </motion.div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-[2.5rem] p-8 mb-10 border-2 border-gray-50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Search Passengers</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Name, Phone or Pickup Location..."
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 rounded-2xl transition-all focus:outline-none font-bold placeholder:text-gray-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assignment Filter</label>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                    {(['all', 'unassigned', 'assigned'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setAssignmentFilter(mode)}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                          assignmentFilter === mode 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Range Start</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                    <input 
                      type="time" 
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 rounded-2xl transition-all focus:outline-none font-bold"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Range End</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                    <input 
                      type="time" 
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 rounded-2xl transition-all focus:outline-none font-bold"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredPassengers.map((passenger, index) => (
                  <motion.div
                    key={passenger._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-[2rem] p-6 border transition-all group ${
                      passenger.assignedBusTime 
                      ? 'border-green-100 bg-green-50/10 shadow-sm' 
                      : 'border-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          passenger.assignedBusTime 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                        }`}>
                          <UserIcon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold text-gray-900 truncate">{passenger.fullName}</h4>
                             {passenger.assignedBusTime && (
                               <div className="flex items-center gap-1 px-2 py-0.5 bg-green-600 text-[8px] font-black text-white uppercase tracking-widest rounded-full">
                                 <CheckCircle2 size={10} />
                                 Assigned
                               </div>
                             )}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                             <div className="flex items-center gap-1">
                               <MapPin size={12} className="text-red-500" />
                               <span className="truncate">{passenger.livingPlace}</span>
                             </div>
                             <a 
                               href={`https://wa.me/${passenger.phoneNumber.replace(/[^0-9]/g, '')}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer"
                               title="Chat on WhatsApp"
                             >
                               <Phone size={12} className="text-green-600" />
                               <span>{passenger.phoneNumber}</span>
                             </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-xl">
                          <span className="text-xs font-black">{passenger.passengerCount}</span>
                          <span className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">Seats</span>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Desired Time</span>
                          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                            <Clock size={14} />
                            {formatTimeToAMPM(passenger.desiredTime)}
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bus Assignment</span>
                            <div className="relative">
                               <select 
                                 disabled={isUpdating}
                                 className={`pl-10 pr-4 py-2 rounded-xl text-sm font-bold appearance-none cursor-pointer focus:outline-none transition-all ${
                                    passenger.assignedBusTime 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200'
                                 }`}
                                 value={passenger.assignedBusTime || 'unassigned'}
                                 onChange={(e) => handleAssignBus(passenger._id || passenger.formId || '', e.target.value)}
                               >
                                 <option value="unassigned">Not Assigned</option>
                                 {uniqueBusTimes.map(time => (
                                   <option key={time} value={time}>{formatTimeToAMPM(time)}</option>
                                 ))}
                               </select>
                               <Bus className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
                            </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredPassengers.length === 0 && (
                <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No Passengers Found</h3>
                  <p className="text-gray-500 font-medium">Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Bus Summary) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-gray-50 shadow-sm sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-100">
                  <Bus size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900">Bus Loading</h3>
                   <p className="text-xs font-medium text-gray-400">Total assigned seats per bus</p>
                </div>
              </div>

              <div className="space-y-6">
                {uniqueBusTimes.map((time) => (
                  <div key={time} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black text-gray-900">{formatTimeToAMPM(time)}</span>
                      <span className="text-xs font-black text-red-600">
                        {busLoadSummary[time] || 0} / {capacityPerTime[time] || 0} Seats
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((busLoadSummary[time] || 0) / (capacityPerTime[time] || 1)) * 100, 100)}%` }}
                        className={`h-full rounded-full ${
                           (busLoadSummary[time] || 0) >= (capacityPerTime[time] || 0) ? 'bg-red-600' : 'bg-gradient-to-r from-red-600 to-green-600'
                        }`}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-gray-50">
                   <div className="flex justify-between items-center bg-amber-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                         <AlertCircle className="text-amber-600" size={18} />
                         <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Unassigned</span>
                      </div>
                      <span className="text-xl font-black text-amber-600">{busLoadSummary.unassigned}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayCardStat;
