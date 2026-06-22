import { motion } from "framer-motion";
import { Play, Plus, Clock, Calendar } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

export const FeaturedSection = () => {
  return (
    <section className="relative py-12 md:py-24 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img src="/COOKING/i19.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-25">
          <source src={VIDEOS[19]} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-4 md:space-y-6">
            <span className="inline-block px-3 py-1 bg-red-600/20 border border-red-500 text-red-400 text-xs font-bold rounded-full tracking-widest uppercase">Émission Vedette</span>
            <h2 className="text-4xl md:text-6xl font-cinematic text-white leading-tight">Collection Gastronomique</h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">Découvrez notre sélection de recettes exclusives et d'émissions culinaires. Vivez la gastronomie comme jamais avec des chefs de renommée mondiale.</p>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-500" /> 45 min</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500" /> 2024</span>
              <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">4K</span>
              <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">HDR</span>
            </div>
            <div className="flex gap-3 pt-1">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-5 py-3 md:px-8 md:py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 text-sm md:text-base">
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-white" /> Regarder
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all text-sm md:text-base">
                <Plus className="w-4 h-4 md:w-5 md:h-5" /> Ma liste
              </motion.button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="rounded-2xl overflow-hidden shadow-2xl">
            <VideoCard image="/COOKING/i20.jpg" video={VIDEOS[20]} title="Collection Gastronomique" className="relative aspect-video rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50">
                  <Play className="w-7 h-7 md:w-8 md:h-8 fill-white text-white ml-1" />
                </motion.div>
              </div>
            </VideoCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
