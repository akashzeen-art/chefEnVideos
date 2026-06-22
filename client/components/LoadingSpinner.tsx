import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingSpinnerProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingSpinner = ({ onComplete, duration = 8 }: LoadingSpinnerProps) => {
  const [progress, setProgress]   = useState(0);
  const [exiting, setExiting]     = useState(false);
  const [visible, setVisible]     = useState(true);

  useEffect(() => {
    const exit = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 900);
    }, duration * 1000);

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (duration * 10);
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => { clearTimeout(exit); clearInterval(interval); };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background video */}
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-8"
          >
            <source
              src="https://cdn.builder.io/o/assets%2Fb5431c80ae374742b2b75bf23154548f%2F681f156fa7b8432d8863114c1cd71a78?alt=media&token=f6b1e15c-5c0c-4bc7-bff3-9d224f38c13e&apiKey=b5431c80ae374742b2b75bf23154548f"
              type="video/mp4"
            />
          </video>

          {/* Dark vignette overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Ambient red glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-500/60"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top:  `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y:       [0, -30 - Math.random() * 40, 0],
                opacity: [0, 0.8, 0],
                scale:   [0, 1.5, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat:   Infinity,
                delay:    Math.random() * 3,
                ease:     "easeInOut",
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* Outer pulsing ring */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-32 h-32 rounded-full border border-red-500/30"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute w-24 h-24 rounded-full border border-red-500/50"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
              />

              {/* Logo icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}
                className="relative w-20 h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/60"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-2xl border-2 border-dashed border-red-400/30"
                />
                <Play className="w-9 h-9 text-white fill-white relative z-10" />
              </motion.div>
            </div>

            {/* Brand logo */}
            <div className="flex gap-[2px]">
              <img src="/image.png" alt="On Cook" className="h-20 md:h-28 w-auto object-contain" />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-gray-400 text-sm md:text-base tracking-widest uppercase"
            >
              Divertissement Culinaire Premiumg
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="w-48 md:w-64"
            >
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-gray-600 text-xs">Chargement</span>
                <span className="text-gray-500 text-xs">{Math.round(progress)}%</span>
              </div>
            </motion.div>

            {/* Bouncing dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex gap-2"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-red-600/40 rounded-tl-lg"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-red-600/40 rounded-tr-lg"
          />
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-red-600/40 rounded-bl-lg"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-red-600/40 rounded-br-lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
