import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const POPULAR = [
  { id: 1,  title: "Cuisine du Soleil",       image: "/COOKING/i21.jpg", video: VIDEOS[21], category: "Méditerranée",          rating: "4.7" },
  { id: 2,  title: "Tempura & Sushi",         image: "/COOKING/i22.jpg", video: VIDEOS[22], category: "Cuisine Japonaise",     rating: "4.5" },
  { id: 3,  title: "Saveurs Marines",         image: "/COOKING/i23.jpg", video: VIDEOS[23], category: "Fruits de Mer",         rating: "4.6" },
  { id: 4,  title: "Minuit en Cuisine",       image: "/COOKING/i24.jpg", video: VIDEOS[24], category: "Compétition",           rating: "4.8" },
  { id: 5,  title: "L'Heure du Brunch",       image: "/COOKING/i25.jpg", video: VIDEOS[25], category: "Brunch & Petit-Déj",    rating: "4.4" },
  { id: 6,  title: "Maître Boucher",          image: "/COOKING/i26.jpg", video: VIDEOS[26], category: "Viandes & Charcuterie", rating: "4.9" },
  { id: 7,  title: "Velours & Chocolat",      image: "/COOKING/i27.jpg", video: VIDEOS[27], category: "Chocolaterie",          rating: "4.3" },
  { id: 8,  title: "Tempête de Saveurs",      image: "/COOKING/i28.jpg", video: VIDEOS[28], category: "Fusion",                rating: "4.6" },
  { id: 9,  title: "Street Food Tour",        image: "/COOKING/i40.jpg", video: VIDEOS[40], category: "Street Food",           rating: "4.5" },
  { id: 10, title: "La Dernière Recette",     image: "/COOKING/i41.jpg", video: VIDEOS[41], category: "Drame Culinaire",       rating: "4.7" },
  { id: 11, title: "Route des Épices",        image: "/COOKING/i29.jpg", video: VIDEOS[29], category: "Voyage Culinaire",      rating: "4.4" },
  { id: 12, title: "Écho des Saveurs",        image: "/COOKING/i30.jpg", video: VIDEOS[30], category: "Gastronomie",           rating: "4.8" },
];

const PAGE_SIZE = 8;

export const PopularSection = () => {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const totalPages = Math.ceil(POPULAR.length / PAGE_SIZE);
  const items = POPULAR.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (d: 1 | -1) => { setDir(d); setPage((p) => (p + d + totalPages) % totalPages); };

  return (
    <section className="relative py-10 md:py-16 overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 bg-zinc-900/85" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-4xl font-cinematic text-white mb-1">Populaire sur On Cook</h2>
            <div className="w-12 h-1 bg-red-500 rounded-full" />
          </motion.div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">{page + 1} / {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} disabled={page === 0} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => go(1)} disabled={page === totalPages - 1} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.35 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((movie) => (
              <div key={movie.id} className="group cursor-pointer rounded-xl overflow-hidden">
                <VideoCard image={movie.image} video={movie.video} title={movie.title} className="relative aspect-video rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-red-400 text-xs font-semibold">{movie.category}</p>
                    <h3 className="text-white font-cinematic text-xs mb-1 leading-tight">{movie.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 text-xs">{movie.rating}</span>
                      </div>
                      <button className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-md">
                        <Play className="w-2.5 h-2.5 fill-white" /> Lire
                      </button>
                    </div>
                  </div>
                </VideoCard>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => { setDir(i > page ? 1 : -1); setPage(i); }} className={`h-1 rounded-full transition-all duration-300 ${i === page ? "w-6 bg-red-500" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
};
