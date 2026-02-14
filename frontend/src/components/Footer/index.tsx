import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Twitter, Instagram, Facebook, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentLang = i18n.language || 'en';

  const footerLinks = {
    company: [
      { name: t('footer.links.about'), path: `/${currentLang}/about` },
      { name: t('footer.links.support'), path: `/${currentLang}/about#contact` },
      { name: t('footer.links.terms'), path: `/${currentLang}/` },
    ],
    services: [
      { name: t('footer.links.drivers'), path: `/${currentLang}/home` },
      { name: t('footer.links.profile'), path: `/${currentLang}/profile` },
    ],
    social: [
      { icon: Facebook, href: '#', name: 'Facebook' },
      { icon: Instagram, href: '#', name: 'Instagram' },
      { icon: Twitter, href: '#', name: 'Twitter' },
      { icon: Github, href: '#', name: 'Github' },
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-12 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -mr-60 -mt-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] -ml-60 -mb-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-5">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <Link to={`/${currentLang}/`} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-gray-200">
                  <span className="text-white font-black text-2xl italic leading-none">T</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-lg border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                Trans<span className="text-red-600">Leb</span>
              </span>
            </Link>
            
            <p className="text-gray-500 font-bold leading-relaxed max-w-sm italic">
              {t('footer.slogan')}
            </p>

            <div className="flex items-center gap-4">
              {footerLinks.social.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-xl hover:shadow-red-200 transition-all duration-500 group"
                  aria-label={social.name}
                >
                  <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">{t('footer.sections.company')}</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 font-bold hover:text-red-600 transition-colors flex items-center group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">{t('footer.sections.services')}</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 font-bold hover:text-red-600 transition-colors flex items-center group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">{t('footer.sections.contact')}</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{t('footer.contacts.phone')}</p>
                  <p className="text-gray-900 font-bold leadnig-tight">+961 70 063 612</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{t('footer.contacts.email')}</p>
                  <p className="text-gray-900 font-bold leading-tight">transleb84@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-gray-400 font-bold text-sm italic">
            <span>© {currentYear} TransLeb. {t('footer.bottom.rights')}</span>
          </div>
          <div className="flex gap-8">
            <Link to={`/${currentLang}/`} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">{t('footer.bottom.privacy')}</Link>
            <Link to={`/${currentLang}/`} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">{t('footer.bottom.cookie')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
