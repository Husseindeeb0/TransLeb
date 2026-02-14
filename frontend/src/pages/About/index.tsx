import { motion } from 'framer-motion';
import { 
  Users, Target, Rocket, ShieldCheck, 
  Mail, Phone, Send, Info, 
  MapPin, CheckCircle2, Heart 
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useSendContactEmailMutation } from '../../state/services/contact/contactAPI';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [sendContactEmail, { isLoading }] = useSendContactEmailMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await sendContactEmail(formData).unwrap();
      toast.success(response.message || t('common.saveSuccess', 'Message sent! We will get back to you soon.'));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.data?.message || t('common.error', 'Failed to send message.'));
    }
  };

  const fadeInUp: any = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const features = [
    {
      icon: Users,
      title: t('about.ourGoal.community.title'),
      description: t('about.ourGoal.community.desc'),
      color: "red"
    },
    {
      icon: ShieldCheck,
      title: t('about.ourGoal.security.title'),
      description: t('about.ourGoal.security.desc'),
      color: "green"
    },
    {
      icon: Rocket,
      title: t('about.ourGoal.tech.title'),
      description: t('about.ourGoal.tech.desc'),
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-inter overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/5 rounded-full blur-[120px] -mt-40" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">
              <Info size={14} className="text-red-600" />
              {t('about.badge')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase italic mb-8">
              {t('about.title')} <br />
              <span className="text-red-600">{t('about.titleMoves')}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-500 font-bold text-xl leading-relaxed italic">
              {t('about.quote')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="inline-flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200">
                  <Users size={24} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tight">{t('about.whoWeAre.title')}</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-600 font-bold text-lg leading-relaxed italic">
                  {t('about.whoWeAre.p1')}
                </p>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {t('about.whoWeAre.p2')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-3xl font-black text-red-600 mb-1">{t('about.whoWeAre.statDrivers')}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('about.whoWeAre.statDriversLabel')}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-3xl font-black text-green-600 mb-1">{t('about.whoWeAre.statRiders')}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('about.whoWeAre.statRidersLabel')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square bg-gray-900 rounded-[4rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-green-600/20 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-white text-center p-12">
                      <Heart size={80} className="mx-auto mb-8 text-red-600 fill-red-600 animate-pulse" />
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">{t('about.builtForLebanon.title')}</h3>
                      <p className="text-gray-400 font-bold italic leading-tight">{t('about.builtForLebanon.desc')}</p>
                   </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="text-white font-black uppercase text-[10px] tracking-[0.2em]">{t('about.builtForLebanon.verified')}</p>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Goal */}
      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-green-600/5 rounded-full blur-[150px] -mr-40 -mb-40" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-200">
                <Target size={24} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tight">{t('about.ourGoal.title')}</h2>
            </div>
            <p className="max-w-2xl mx-auto text-gray-500 font-bold text-xl italic leading-relaxed">
              {t('about.ourGoal.mission')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-white hover:-translate-y-2 transition-transform duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${
                  feature.color === 'red' ? 'bg-red-50 text-red-600' : 
                  feature.color === 'green' ? 'bg-green-50 text-green-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-4 leading-none">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed italic">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <motion.div {...fadeInUp}>
                <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 leading-none">
                  {t('about.contact.title')} <span className="text-red-600">{t('about.contact.titleTouch')}</span>
                </h2>
                <p className="text-gray-500 font-bold text-lg leading-relaxed italic">
                  {t('about.contact.desc')}
                </p>
              </motion.div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('about.contact.emailLabel')}</p>
                    <p className="text-xl font-black text-gray-900 italic uppercase leading-none">transleb84@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('about.contact.phoneLabel')}</p>
                    <p className="text-xl font-black text-gray-900 italic uppercase leading-none">+961 70 063 612</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('about.contact.visitLabel')}</p>
                    <p className="text-xl font-black text-gray-900 italic uppercase leading-none">{t('about.contact.visitValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <motion.div 
                 {...fadeInUp}
                 className="bg-white p-6 md:p-12 rounded-[4rem] shadow-2xl shadow-gray-200 border border-gray-100"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('about.contact.form.name')}</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-4 focus:outline-none focus:border-red-600/30 transition-all font-bold"
                         placeholder={t('about.contact.form.placeholderName')}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('about.contact.form.email')}</label>
                       <input 
                         type="email" 
                         required
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-4 focus:outline-none focus:border-red-600/30 transition-all font-bold"
                         placeholder={t('about.contact.form.placeholderEmail')}
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('about.contact.form.subject')}</label>
                     <input 
                       type="text" 
                       required
                       value={formData.subject}
                       onChange={(e) => setFormData({...formData, subject: e.target.value})}
                       className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-4 focus:outline-none focus:border-red-600/30 transition-all font-bold"
                       placeholder={t('about.contact.form.placeholderSubject')}
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('about.contact.form.message')}</label>
                     <textarea 
                       rows={4}
                       required
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-4 focus:outline-none focus:border-red-600/30 transition-all font-bold"
                       placeholder={t('about.contact.form.placeholderMessage')}
                     />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-xl active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('about.contact.form.sending') : t('about.contact.form.submit')}
                    <Send size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
