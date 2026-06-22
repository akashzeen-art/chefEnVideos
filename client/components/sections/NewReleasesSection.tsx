import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, Star, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const NEW_RELEASES = [
  { id: 1, title: "Saveurs du Monde",       image: "/COOKING/i31.jpg", video: VIDEOS[31], category: "Cuisine · Voyage",      rating: "4.9", year: "2024", desc: "Un voyage culinaire à travers les saveurs du monde." },
  { id: 2, title: "Chef en Ville",           image: "/COOKING/i32.jpg", video: VIDEOS[32], category: "Gastronomie",           rating: "4.8", year: "2024", desc: "Un chef. Une ville. Une passion sans limites." },
  { id: 3, title: "Festin Sauvage",          image: "/COOKING/i33.jpg", video: VIDEOS[33], category: "Nature & Cuisine",      rating: "4.7", year: "2024", desc: "Partez à la découverte des saveurs sauvages." },
  { id: 4, title: "Douceurs de Paris",       image: "/COOKING/i34.jpg", video: VIDEOS[34], category: "Pâtisserie",            rating: "4.6", year: "2024", desc: "Quand le sucre devient un art à part entière." },
  { id: 5, title: "Grillades & Flammes",     image: "/COOKING/i35.jpg", video: VIDEOS[35], category: "Barbecue",              rating: "4.8", year: "2024", desc: "Le feu, la viande, et la maîtrise du grill." },
];

export const NewReleasesSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <section className="relative py-10 md:py-16 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-zinc-950/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <h2 className="text-2xl md:text-4xl font-cinematic text-white">Nouvelles sorties</h2>
              <div className="w-12 h-1 bg-orange-500 rounded-full mt-1" />
            </div>
          </motion.div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={sliderRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {NEW_RELEASES.map((movie, i) => (
            <motion.div key={movie.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="group cursor-pointer flex-shrink-0 w-72 md:w-96 rounded-2xl overflow-hidden">
              <VideoCard image={movie.image} video={movie.video} title={movie.title} className="relative aspect-video rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-black rounded tracking-widest">NOUVEAU</div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-400 text-xs font-semibold">{movie.category}</span>
                    <span className="text-gray-500 text-xs">·</span>
                    <span className="text-gray-400 text-xs">{movie.year}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 text-xs">{movie.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-cinematic text-xl mb-1">{movie.title}</h3>
                  <p className="text-gray-400 text-xs mb-3 opacity-0 group-hover:opacity-100 transition-opacity">{movie.desc}</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-5 py-2 bg-white text-black font-bold rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-black" /> Regarder
                  </motion.button>
                </div>
              </VideoCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
