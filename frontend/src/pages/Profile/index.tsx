import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Loader2, 
  Camera, Edit3, Save, Briefcase, 
  ShieldCheck, Calendar, Clock, ChevronRight
} from 'lucide-react';
import { useGetMeQuery, useUpdateProfileMutation } from '../../state/services/user/userAPI';
import { useGetDayCardsQuery } from '../../state/services/dayCard/dayCardAPI';
import toast from 'react-hot-toast';

const Profile = () => {
  const { data: user, isLoading, refetch } = useGetMeQuery();
  const { data: dayCards, isLoading: isLoadingCards } = useGetDayCardsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    region: '',
    description: '',
    profileImage: '',
    coverImage: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        region: user.region || '',
        description: user.description || '',
        profileImage: user.profileImage || '',
        coverImage: user.coverImage || ''
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const updatePayload: any = {};
      if (formData.name !== user?.name) updatePayload.name = formData.name;
      if (formData.email !== user?.email) updatePayload.email = formData.email;
      if (formData.phoneNumber !== user?.phoneNumber) updatePayload.phoneNumber = formData.phoneNumber;
      if (formData.region !== user?.region) updatePayload.region = formData.region;
      if (formData.description !== user?.description) updatePayload.description = formData.description;
      if (formData.profileImage !== user?.profileImage) updatePayload.profileImage = formData.profileImage;
      if (formData.coverImage !== user?.coverImage) updatePayload.coverImage = formData.coverImage;

      if (Object.keys(updatePayload).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateProfile(updatePayload).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refetch();
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type === 'profile' ? 'profileImage' : 'coverImage']: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4 font-inter">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-red-600" />
        </motion.div>
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-inter">
      {/* Cover Section */}
      <div className="relative h-[300px] md:h-[380px] w-full group overflow-hidden">
        {formData.coverImage ? (
          <img 
            src={formData.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {isEditing && (
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white/20 transition-all shadow-2xl"
            >
              <Camera size={16} />
              Change Cover Image
            </button>
          )}
        </div>
        <input 
          type="file" 
          hidden 
          ref={coverInputRef} 
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'cover')}
        />

        {/* Action Buttons */}
        <div className="absolute top-8 right-8 flex gap-4 z-20">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl hover:shadow-red-200 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Avatar & Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 relative overflow-hidden">
              {/* Profile Image */}
              <div className="relative mb-8 mx-auto w-40 h-40">
                <div className="w-full h-full rounded-[2.5rem] bg-gray-900 p-2 shadow-inner overflow-hidden relative">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-[2rem]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-black">
                      {formData.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  
                  {isEditing && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-[2rem]"
                    >
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                />
                
                {/* Badge */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl text-white">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="text-center">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full text-center bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 focus:outline-none focus:border-red-600/30 font-black text-2xl mb-2"
                  />
                ) : (
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase italic">
                    {user?.name}
                  </h2>
                )}
                <div className="flex items-center justify-center gap-2 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  <Briefcase size={12} className="text-red-600" />
                  {user?.role} partner
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                  <Mail size={18} />
                </div>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-red-600/30 font-bold text-sm"
                  />
                ) : (
                  <p className="font-bold text-gray-700 text-sm">{user?.email}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <Phone size={18} />
                </div>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="+961 XX XXX XXX"
                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-green-600/30 font-bold text-sm"
                  />
                ) : (
                  <p className="font-bold text-gray-700 text-sm">{user?.phoneNumber || 'Not set'}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <MapPin size={18} />
                </div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="e.g. Beirut & Mount Lebanon"
                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-600/30 font-bold text-sm"
                  />
                ) : (
                  <p className="font-bold text-gray-700 text-sm">{user?.region || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Description & Day Cards */}
          <div className="lg:col-span-8 space-y-10">
            {/* Description */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-bl-[3rem]" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Edit3 size={18} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">About</h3>
                </div>
                
                {isEditing ? (
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about yourself and your services..."
                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl p-6 focus:outline-none focus:border-red-600/30 font-bold text-gray-700 leading-relaxed"
                  />
                ) : (
                  <p className="text-gray-600 font-bold leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                    "{formData.description || "No description yet."}"
                  </p>
                )}
              </div>
            </div>

            {/* Day Cards Section */}
            {user?.role === 'driver' && (
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">My Schedules</h3>
                </div>

                {isLoadingCards ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                  </div>
                ) : dayCards && dayCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dayCards.map((card) => {
                      const formattedDate = new Date(card.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                      return (
                        <motion.div
                          key={card.dayCardId}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -4 }}
                          className="relative group"
                        >
                          <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border-l-4 border-t border-r border-b-4 border-l-red-600 border-b-green-600 border-t-gray-100 border-r-gray-100 transition-all duration-300 group-hover:shadow-xl" />
                          
                          <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                  <Calendar size={16} className="text-red-600" />
                                </div>
                                <div>
                                  <p className="font-black text-gray-900">{formattedDate}</p>
                                  <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                    <Clock size={12} />
                                    {card.busTimers.length} times
                                  </div>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                card.formState === 'scheduled' ? 'bg-green-50 text-green-600' : 
                                card.formState === 'planning' ? 'bg-amber-50 text-amber-600' :
                                card.formState === 'open' ? 'bg-blue-50 text-blue-600' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {card.formState}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {card.busTimers.slice(0, 3).map((bus, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-100"
                                >
                                  {bus.time}
                                </span>
                              ))}
                              {card.busTimers.length > 3 && (
                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100">
                                  +{card.busTimers.length - 3}
                                </span>
                              )}
                            </div>

                            <Link 
                              to={`/day-card/${card.dayCardId}`}
                              className="flex items-center gap-1 text-red-600 font-black text-[10px] uppercase tracking-wider group/btn"
                            >
                              View Details
                              <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">No schedules created yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;