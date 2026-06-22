import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const TOP_PICKS = [
  { id: 1,  title: "Saveurs du Monde",        image: "/COOKING/i1.jpg",  video: VIDEOS[1],  category: "Cuisine · Voyage",       rating: "4.8" },
  { id: 2,  title: "Le Grand Chef",            image: "/COOKING/i2.jpg",  video: VIDEOS[2],  category: "Compétition",            rating: "4.6" },
  { id: 3,  title: "Douceurs de Paris",        image: "/COOKING/i3.jpg",  video: VIDEOS[3],  category: "Pâtisserie",             rating: "4.5" },
  { id: 4,  title: "Grillades & Flammes",      image: "/COOKING/i4.jpg",  video: VIDEOS[4],  category: "Barbecue",               rating: "4.7" },
  { id: 5,  title: "Épices du Monde",          image: "/COOKING/i5.jpg",  video: VIDEOS[5],  category: "Cuisine Exotique",       rating: "4.4" },
  { id: 6,  title: "Secrets de Grand-Mère",    image: "/COOKING/i6.jpg",  video: VIDEOS[6],  category: "Cuisine Traditionnelle", rating: "4.3" },
  { id: 7,  title: "Chef en Ville",            image: "/COOKING/i7.jpg",  video: VIDEOS[7],  category: "Gastronomie",            rating: "4.9" },
  { id: 8,  title: "Festin Sauvage",           image: "/COOKING/i8.jpg",  video: VIDEOS[8],  category: "Nature & Cuisine",       rating: "4.2" },
  { id: 9,  title: "L'Art de la Pâtisserie",  image: "/COOKING/i9.jpg",  video: VIDEOS[9],  category: "Artisanat",              rating: "4.6" },
  { id: 10, title: "Cuisine en Fête",          image: "/COOKING/i10.jpg", video: VIDEOS[10], category: "Célébration",            rating: "4.9" },
  { id: 11, title: "Les Maîtres du Goût",      image: "/COOKING/i11.jpg", video: VIDEOS[11], category: "Gastronomie",            rating: "4.7" },
  { id: 12, title: "Recettes du Terroir",      image: "/COOKING/i12.jpg", video: VIDEOS[12], category: "Cuisine Régionale",      rating: "4.5" },
];

const PAGE_SIZE = 8;

export const TopPicksSection = () => {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const totalPages = Math.ceil(TOP_PICKS.length / PAGE_SIZE);
  const items = TOP_PICKS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (d: 1 | -1) => { setDir(d); setPage((p) => (p + d + totalPages) % totalPages); };

  return (
    <section className="relative py-10 md:py-16 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-4xl font-cinematic text-white mb-1">Sélection pour vous</h2>
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
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 text-xs">{movie.rating}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="flex-1 flex items-center justify-center gap-1 py-1 bg-red-600 text-white text-xs font-bold rounded-md">
                        <Play className="w-2.5 h-2.5 fill-white" /> Lire
                      </button>
                      <button className="px-1.5 py-1 bg-white/20 text-white rounded-md border border-white/30">
                        <Plus className="w-2.5 h-2.5" />
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
