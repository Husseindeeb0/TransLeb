import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Clock, Users, Send, Loader2, CheckCircle2, Save } from 'lucide-react';
import { 
  useSubmitPassengerFormMutation, 
  useUpdatePassengerFormMutation, 
  useIsFormExistsQuery
} from '../../state/services/passengerForm/passengerFormAPI';
import type { SubmitPassengerFormRequest } from '../../types/passengerFormTypes';
import toast from 'react-hot-toast';

interface PassengerFormProps {
  dayCardId: string;
  availableTimes: string[];
  isLocked?: boolean;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ dayCardId, availableTimes, isLocked }) => {
  const { data: existenceData, isLoading: isCheckingExists } = useIsFormExistsQuery(dayCardId);
  const [submitForm, { isLoading: isSubmitting }] = useSubmitPassengerFormMutation();
  const [updateForm, { isLoading: isUpdating }] = useUpdatePassengerFormMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<SubmitPassengerFormRequest, 'dayCardId'>>({
    fullName: '',
    phoneNumber: '',
    livingPlace: '',
    desiredTime: '',
    passengerCount: 1,
  });

  // Sync with existing form if it exists
  useEffect(() => {
    if (existenceData?.exists && existenceData.data && typeof existenceData.data !== 'string') {
      const form = existenceData.data;
      setFormData({
        fullName: form.fullName || "",
        phoneNumber: form.phoneNumber || "",
        livingPlace: form.livingPlace || "",
        desiredTime: form.desiredTime || "",
        passengerCount: form.passengerCount || 1,
      });
      setFormId(form.formId || form._id || null);
    }
  }, [existenceData]);

  const isLoading = isSubmitting || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error('This form is currently not accepting submissions.');
      return;
    }

    try {
      if (formId) {
        await updateForm({ ...formData, formId }).unwrap();
        toast.success('Your reservation has been updated!');
      } else {
        const response = await submitForm({ ...formData, dayCardId }).unwrap();
        setFormId(response.formId);
        toast.success('Your request has been submitted successfully!');
      }
      setIsSubmitted(true);
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to save request. Please try again.');
      console.error(err);
    }
  };

  if (isCheckingExists) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center h-full shadow-lg border-2 border-gray-50">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
      </div>
    );
  }

  if ((isSubmitted || formId) && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border-2 border-green-100 h-full flex flex-col justify-center"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Reservation Saved!</h3>
        <p className="text-gray-500 font-medium mb-8">
          We've recorded your details. You can update them at any time before the trip.
        </p>
        <button
          onClick={() => {
            setIsEditing(true);
            setIsSubmitted(false);
          }}
          className="px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          {formId ? 'Edit My Reservation' : 'Edit Again'}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden h-full">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/5 rounded-full -ml-32 -mb-32 blur-3xl" />

      <div className="relative">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {formId ? 'Update Reservation' : 'Book Your Ride'}
          </h2>
          <p className="text-gray-500 font-medium">
            {formId ? 'Adjust your reservation details below.' : 'Please fill in your details to reserve a seat.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                disabled={isLocked}
                placeholder="John Doe"
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all font-bold"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  disabled={isLocked}
                  placeholder="+961 00 000 000"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 transition-all font-bold"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Passenger Count */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Passengers</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
                  <Users size={18} />
                </div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  disabled={isLocked}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-gray-900/30 focus:ring-4 focus:ring-gray-900/5 transition-all font-bold"
                  value={formData.passengerCount}
                  onChange={(e) => setFormData({ ...formData, passengerCount: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Living Place */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Pickup Location</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-700 transition-colors">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                required
                disabled={isLocked}
                placeholder="e.g. Beirut, Hamra St."
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all font-bold"
                value={formData.livingPlace}
                onChange={(e) => setFormData({ ...formData, livingPlace: e.target.value })}
              />
            </div>
          </div>

          {/* Desired Time */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Desired Pickup Time</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                <Clock size={18} />
              </div>
              <input
                type="time"
                required
                disabled={isLocked}
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 transition-all font-bold"
                value={formData.desiredTime}
                onChange={(e) => setFormData({ ...formData, desiredTime: e.target.value })}
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">
              * Enter your preferred time for pickup.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="w-full py-5 bg-gradient-to-r from-red-700 to-green-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {formId ? <Save size={18} /> : <Send size={18} />}
                {formId ? 'Update My Reservation' : 'Submit Reservation'}
              </>
            )}
          </button>

          {isLocked && (
            <p className="text-center text-sm font-bold text-red-500 mt-4 flex items-center justify-center gap-2">
              <Clock size={14} />
              Reservations are currently closed for this card.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PassengerForm;
