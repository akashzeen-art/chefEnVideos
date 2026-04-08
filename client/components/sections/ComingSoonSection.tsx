import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const COMING_SOON = [
  { id: 1, title: "Saveurs du Monde II",    image: "/COOKING/i37.jpg", video: VIDEOS[37], category: "Cuisine · Voyage"  },
  { id: 2, title: "Le Grand Chef Saison 2", image: "/COOKING/i38.jpg", video: VIDEOS[38], category: "Compétition"        },
  { id: 3, title: "Recettes Secrètes II",   image: "/COOKING/i39.jpg", video: VIDEOS[39], category: "Gastronomie"        },
  { id: 4, title: "Chef en Ville Saison 2", image: "/COOKING/i40.jpg", video: VIDEOS[40], category: "Cuisine Urbaine"    },
  { id: 5, title: "Festin Sauvage II",      image: "/COOKING/i41.jpg", video: VIDEOS[41], category: "Nature & Cuisine"   },
];

export const ComingSoonSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section id="coming-soon" className="relative py-10 md:py-16 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-4xl font-cinematic text-white mb-1">Bientôt disponible</h2>
            <div className="w-12 h-1 bg-red-500 rounded-full" />
          </motion.div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={sliderRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {COMING_SOON.map((movie, i) => (
            <motion.div key={movie.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer flex-shrink-0 w-64 md:w-80 rounded-xl overflow-hidden bg-gray-900">
              <VideoCard image={movie.image} video={movie.video} title={movie.title} className="relative aspect-video">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">{movie.category}</span>
                </div>
              </VideoCard>
              <div className="p-3">
                <h3 className="text-white font-cinematic text-sm">{movie.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
