import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  MessageCircle, 
  Users, 
  Calendar, 
  Smartphone, 
  TrendingUp, 
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white font-inter overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/transbg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 font-black text-[10px] uppercase tracking-widest mb-6 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Connecting Lebanon
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                TRANSIT MADE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-500">SIMPLE.</span>
              </h1>
              <p className="text-xl text-gray-300 font-medium mb-12 max-w-xl leading-relaxed">
                Empowering passengers with real-time schedules and direct driver communication. Experience the next generation of Lebanese transportation.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link 
                  to={isAuthenticated ? "/home" : "/signup"} 
                  className="px-10 py-5 bg-white text-gray-900 rounded-[1.5rem] font-black uppercase text-[12px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                >
                  Get Started Now
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  to="/home" 
                  className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-[1.5rem] font-black uppercase text-[12px] tracking-widest hover:bg-white/20 transition-all active:scale-95"
                >
                  Browse Drivers
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-1 h-12 bg-gradient-to-b from-red-600 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-[12px] font-black text-red-600 uppercase tracking-widest mb-4">The Challenge</h2>
              <h3 className="text-5xl font-black text-gray-900 leading-tight mb-8">
                Frustrated with the <br />
                <span className="text-gray-400 italic">Unknown?</span>
              </h3>
              <div className="space-y-8">
                {[
                  { 
                    icon: <Clock className="text-red-500" />, 
                    title: "Endless Waiting", 
                    desc: "Standing for hours not knowing when the next bus or van will pass." 
                  },
                  { 
                    icon: <ShieldAlert className="text-red-500" />, 
                    title: "Zero Predictability", 
                    desc: "Traditional transit in Lebanon lacks established digital schedules." 
                  },
                  { 
                    icon: <Smartphone className="text-red-500" />, 
                    title: "Disconnected Service", 
                    desc: "No easy way to reach drivers directly to check availability." 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex-shrink-0 h-14 w-14 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-[13px] tracking-widest mb-1">{item.title}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              style={{ perspective: 1000 }}
              initial={{ rotateY: 10, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-[3rem] p-4 shadow-3xl border border-gray-100 relative z-10">
                <div className="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8">
                    <TrendingUp className="text-red-600" size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-4">Old Systems Are Failing</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Lebanon's transport infrastructure deserves more than just luck. It's time to bridge the gap between technology and the road.
                  </p>
                </div>
              </div>
              {/* Decorative background blocks */}
              <div className="absolute -top-10 -right-10 w-full h-full bg-red-100 rounded-[3rem] -z-10" />
              <div className="absolute -bottom-10 -left-10 w-full h-full bg-green-50 rounded-[3rem] -z-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Goals */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <motion.div {...fadeInUp}>
            <h2 className="text-[12px] font-black text-green-600 uppercase tracking-widest mb-4">Our Purpose</h2>
            <h3 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
              A Mission to Move <br />
              <span className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">Every Lebanese Citzen.</span>
            </h3>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="text-white" />,
              bg: "bg-red-600",
              title: "Transparency",
              desc: "Providing clear, real-time data for every route and scheduled time."
            },
            {
              icon: <Users className="text-white" />,
              bg: "bg-gray-900",
              title: "Community",
              desc: "Building a trust-based ecosystem between drivers and their passengers."
            },
            {
              icon: <TrendingUp className="text-white" />,
              bg: "bg-green-600",
              title: "Efficiency",
              desc: "Reducing wait times and optimizing fuel for drivers through better planning."
            }
          ].map((goal, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50"
            >
              <div className={`${goal.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg`}>
                {goal.icon}
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-4">{goal.title}</h4>
              <p className="text-gray-500 font-medium leading-relaxed">{goal.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What we provide Section */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] -mr-64 -mt-64 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 blur-[150px] -ml-64 -mb-64 rounded-full" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-[12px] font-black text-red-500 uppercase tracking-widest mb-4">The Solution</h2>
            <h3 className="text-5xl font-black mb-8 leading-tight">Everything You Need <br /> To Travel Smarter</h3>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Calendar />, 
                title: "DayCards", 
                desc: "Drivers publish their daily availability and scheduled timers instantly." 
              },
              { 
                icon: <MessageCircle />, 
                title: "Direct Chat", 
                desc: "One-click access to talk with your driver via WhatsApp for quick coordination." 
              },
              { 
                icon: <ShieldCheck />, 
                title: "Verified Drivers", 
                desc: "Each driver on our platform is vetted for safety and professional reliability." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group text-center"
              >
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-red-600 transition-colors">
                  {i === 0 ? <Calendar size={32} /> : i === 1 ? <MessageCircle size={32} /> : <ShieldCheck size={32} />}
                </div>
                <h4 className="font-black text-[15px] uppercase tracking-widest mb-4">{feature.title}</h4>
                <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative px-6">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[4rem] text-center overflow-hidden relative border border-white/5">
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-red-700/40 to-transparent" />
          
          <div className="relative z-10 py-24 px-8">
            <motion.div {...fadeInUp}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1] uppercase">
                READY TO <br />
                <span className="text-gray-400">Join the movement?</span>
              </h2>
              <p className="text-gray-400 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Whether you're a driver looking to reach more passengers or a passenger seeking a reliable schedule, TransLeb is built for you.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to={isAuthenticated ? "/home" : "/signup"} 
                  className="w-full sm:w-auto px-12 py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-[14px] tracking-widest hover:bg-red-700 hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  {isAuthenticated ? "Go to Home" : "Create Your Account"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
