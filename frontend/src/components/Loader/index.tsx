import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-100/30 rounded-full blur-[120px]" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          {/* Outer glow/ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-[3px] border-green-600/10 rounded-[1.5rem]"
          />

          {/* Main spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 border-t-[3px] border-green-600 rounded-[1.5rem]"
          />

          {/* Inner pulse */}
          <motion.div
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-4 bg-gradient-to-br from-green-600 to-red-600 rounded-xl blur-sm"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            TransLeb
          </h2>
          <div className="flex gap-1">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-1.5 h-1.5 bg-green-600 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-1.5 h-1.5 bg-green-600 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-1.5 h-1.5 bg-green-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
