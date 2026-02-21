import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Clock, Users, Send, Loader2, CheckCircle2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useSubmitPassengerFormMutation, 
  useUpdatePassengerFormMutation, 
  useIsFormExistsQuery,
  useDeletePassengerFormMutation
} from '../../state/services/passengerForm/passengerFormAPI';
import type { SubmitPassengerFormRequest } from '../../types/passengerFormTypes';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

interface PassengerFormProps {
  dayCardId: string;
  isLocked?: boolean;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ dayCardId, isLocked }) => {
  const { t, i18n } = useTranslation();
  const { data: existenceData, isLoading: isCheckingExists, refetch: refetchExists } = useIsFormExistsQuery(dayCardId);
  const [submitForm, { isLoading: isSubmitting }] = useSubmitPassengerFormMutation();
  const [updateForm, { isLoading: isUpdating }] = useUpdatePassengerFormMutation();
  const [deleteForm, { isLoading: isDeleting }] = useDeletePassengerFormMutation();
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
      toast.error(t('daycard.passengerForm.lockedError'));
      return;
    }

    // Phone validation
    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 8) {
      toast.error(t('daycard.passengerForm.phoneError'));
      return;
    }

    try {
      if (formId) {
        // Partial Update logic
        const updateData: any = { formId };
        const existing = existenceData?.data as any;
        let hasChanged = false;

        if (formData.fullName !== (existing?.fullName || "")) {
          updateData.fullName = formData.fullName;
          hasChanged = true;
        }
        if (formData.phoneNumber !== (existing?.phoneNumber || "")) {
          updateData.phoneNumber = formData.phoneNumber;
          hasChanged = true;
        }
        if (formData.livingPlace !== (existing?.livingPlace || "")) {
          updateData.livingPlace = formData.livingPlace;
          hasChanged = true;
        }
        if (formData.desiredTime !== (existing?.desiredTime || "")) {
          updateData.desiredTime = formData.desiredTime;
          hasChanged = true;
        }
        if (formData.passengerCount !== (existing?.passengerCount || 1)) {
          updateData.passengerCount = formData.passengerCount;
          hasChanged = true;
        }

        if (hasChanged) {
          await updateForm(updateData).unwrap();
          toast.success(t('daycard.passengerForm.updateSuccess'));
        } else {
          toast(t('daycard.passengerForm.noChanges'), { icon: 'ℹ️' });
        }
      } else {
        const response = await submitForm({ ...formData, dayCardId }).unwrap();
        setFormId(response.formId);
        toast.success(t('daycard.passengerForm.submitSuccess'));
      }
      setIsSubmitted(true);
      setIsEditing(false);
    } catch (err) {
      toast.error(t('daycard.passengerForm.saveError'));
      console.error(err);
    }
  };

  const handleDeleteReservation = async () => {
    if (!formId) return;
    if (window.confirm(t('daycard.passengerForm.confirmDelete', 'Are you sure you want to cancel your reservation?'))) {
      try {
        await deleteForm(formId).unwrap();
        toast.success(t('daycard.passengerForm.deleteSuccess', 'Reservation cancelled'));
        refetchExists();
        setIsSubmitted(false);
        setFormId(null);
        setFormData({
            fullName: '',
            phoneNumber: '',
            livingPlace: '',
            desiredTime: '',
            passengerCount: 1,
        });
      } catch (err) {
        toast.error(t('daycard.passengerForm.deleteError', 'Failed to cancel reservation'));
      }
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
        <h3 className="text-2xl font-black text-gray-900 mb-2">{t('daycard.passengerForm.savedTitle')}</h3>
        <p className="text-gray-500 font-medium mb-8">
          {t('daycard.passengerForm.savedDesc')}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to={`/${i18n.language}/sharelocation/${dayCardId}`}
            className="px-8 py-5 bg-gradient-to-r from-red-700 to-green-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto w-full group"
          >
            <MapPin size={18} className="group-hover:animate-bounce" />
            {t('daycard.passengerForm.shareLocationBtn', 'Share Live Location')}
          </Link>

          <button
            onClick={() => {
              setIsEditing(true);
              setIsSubmitted(false);
            }}
            className="px-8 py-4 bg-gray-50 text-gray-400 border-2 border-gray-100 rounded-[1.5rem] font-bold hover:bg-white hover:text-gray-900 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto w-full"
          >
            {formId ? t('daycard.passengerForm.editBtn') : t('daycard.passengerForm.editAgain')}
          </button>

          <button
            onClick={handleDeleteReservation}
            disabled={isDeleting}
            className="px-8 py-4 bg-red-50 text-red-600 border-2 border-red-100 rounded-[1.5rem] font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto w-full"
          >
            <Trash2 size={18} />
            {t('daycard.passengerForm.deleteBtn', 'Cancel Reservation')}
          </button>
        </div>
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
            {formId ? t('daycard.passengerForm.updateTitle') : t('daycard.passengerForm.title')}
          </h2>
          <p className="text-gray-500 font-medium">
            {formId ? t('daycard.passengerForm.updateSubtitle') : t('daycard.passengerForm.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">{t('daycard.passengerForm.nameLabel')}</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                disabled={isLocked}
                placeholder={t('daycard.passengerForm.namePlaceholder')}
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all font-bold"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">{t('daycard.passengerForm.phoneLabel')}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  disabled={isLocked}
                  placeholder={t('daycard.passengerForm.phonePlaceholder')}
                  pattern="^\+?[0-9]{8,15}$"
                  title="Phone number must be between 8 and 15 digits"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-green-600/30 focus:ring-4 focus:ring-green-600/5 transition-all font-bold"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Only allow + at the very beginning and digits elsewhere
                    let cleaned = val.replace(/[^\d+]/g, '');
                    if (cleaned.includes('+') && cleaned.indexOf('+') !== 0) {
                      cleaned = cleaned.replace(/\+/g, '');
                    }
                    // Limit to 15 digits (standard max for international numbers)
                    const digitsOnly = cleaned.replace(/\+/g, '');
                    if (digitsOnly.length > 15) {
                      cleaned = (cleaned.startsWith('+') ? '+' : '') + digitsOnly.slice(0, 15);
                    }
                    setFormData({ ...formData, phoneNumber: cleaned });
                  }}
                />
                <p className="text-[10px] text-gray-400 font-bold ml-1 mt-1 opacity-70 italic">
                  {t('daycard.passengerForm.phoneFormatHint')}
                </p>
              </div>
            </div>

            {/* Passenger Count */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">{t('daycard.passengerForm.passengersLabel')}</label>
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
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">{t('daycard.passengerForm.pickupLabel')}</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-700 transition-colors">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                required
                disabled={isLocked}
                placeholder={t('daycard.passengerForm.pickupPlaceholder')}
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:ring-4 focus:ring-red-600/5 transition-all font-bold"
                value={formData.livingPlace}
                onChange={(e) => setFormData({ ...formData, livingPlace: e.target.value })}
              />
            </div>
          </div>

          {/* Desired Time */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">{t('daycard.passengerForm.timeLabel')}</label>
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
              {t('daycard.passengerForm.timeHint')}
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
                {formId ? t('daycard.passengerForm.update') : t('daycard.passengerForm.submit')}
              </>
            )}
          </button>

          {isLocked && (
            <p className="text-center text-sm font-bold text-red-500 mt-4 flex items-center justify-center gap-2">
              <Clock size={14} />
              {t('daycard.passengerForm.closed')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PassengerForm;
