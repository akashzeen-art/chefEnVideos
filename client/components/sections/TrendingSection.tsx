import { useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const TRENDING = [
  { id: 1, title: "Saveurs du Monde",       image: "/COOKING/i11.jpg", video: VIDEOS[11], category: "Cuisine · Voyage",      rating: "4.8", rank: 1 },
  { id: 2, title: "Le Grand Chef",           image: "/COOKING/i12.jpg", video: VIDEOS[12], category: "Compétition",           rating: "4.6", rank: 2 },
  { id: 3, title: "Douceurs de Paris",       image: "/COOKING/i13.jpg", video: VIDEOS[13], category: "Pâtisserie",            rating: "4.5", rank: 3 },
  { id: 4, title: "Grillades & Flammes",     image: "/COOKING/i14.jpg", video: VIDEOS[14], category: "Barbecue",              rating: "4.7", rank: 4 },
  { id: 5, title: "Épices du Monde",         image: "/COOKING/i15.jpg", video: VIDEOS[15], category: "Cuisine Exotique",      rating: "4.4", rank: 5 },
  { id: 6, title: "Secrets de Grand-Mère",   image: "/COOKING/i16.jpg", video: VIDEOS[16], category: "Cuisine Traditionnelle",rating: "4.3", rank: 6 },
  { id: 7, title: "Chef en Ville",           image: "/COOKING/i17.jpg", video: VIDEOS[17], category: "Gastronomie",           rating: "4.9", rank: 7 },
];

export const TrendingSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section id="trending" className="relative py-10 md:py-16 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/75 to-zinc-950/90" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
            <div>
              <h2 className="text-2xl md:text-4xl font-cinematic text-white">Tendances du moment</h2>
              <div className="w-12 h-1 bg-red-500 rounded-full mt-1" />
            </div>
          </motion.div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={sliderRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {TRENDING.map((movie, i) => (
            <motion.div key={movie.id} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }} className="relative flex-shrink-0 w-64 md:w-80 group cursor-pointer">
              <span className="absolute -left-1 bottom-8 text-6xl md:text-8xl font-black text-white/10 select-none leading-none z-10">{movie.rank}</span>
              <VideoCard image={movie.image} video={movie.video} title={movie.title} className="relative aspect-video rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-red-400 font-semibold mb-0.5">{movie.category}</p>
                  <h3 className="text-white font-cinematic text-sm leading-tight">{movie.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">{movie.rating}</span>
                  </div>
                </div>
              </VideoCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
