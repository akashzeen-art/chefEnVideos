import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const CONTINUE_WATCHING = [
  { id: 1, title: "Saveurs du Monde",       image: "/COOKING/i6.jpg",  video: VIDEOS[6],  progress: 65, episode: "S3 E4",  timeLeft: "28 min restantes" },
  { id: 2, title: "Le Grand Chef",           image: "/COOKING/i7.jpg",  video: VIDEOS[7],  progress: 42, episode: "S4 E7",  timeLeft: "44 min restantes" },
  { id: 3, title: "Recettes Secrètes",       image: "/COOKING/i8.jpg",  video: VIDEOS[8],  progress: 88, episode: "S5 E14", timeLeft: "7 min restantes"  },
  { id: 4, title: "Festin Sauvage",          image: "/COOKING/i9.jpg",  video: VIDEOS[9],  progress: 20, episode: "S1 E2",  timeLeft: "51 min restantes" },
  { id: 5, title: "L'Art de la Pâtisserie", image: "/COOKING/i10.jpg", video: VIDEOS[10], progress: 55, episode: "S2 E3",  timeLeft: "32 min restantes" },
  { id: 6, title: "Cuisine en Fête",         image: "/COOKING/i11.jpg", video: VIDEOS[11], progress: 30, episode: "S1 E5",  timeLeft: "48 min restantes" },
];

export const ContinueWatchingSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="relative py-10 md:py-16 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-4xl font-cinematic text-white mb-1">Continuer à regarder</h2>
            <div className="w-12 h-1 bg-red-500 rounded-full" />
          </motion.div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={sliderRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {CONTINUE_WATCHING.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group rounded-xl overflow-hidden bg-gray-900 cursor-pointer flex-shrink-0 w-64 md:w-72">
              <VideoCard image={item.image} video={item.video} title={item.title} className="relative aspect-video">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                  </div>
                </div>
              </VideoCard>
              <div className="h-1 bg-gray-700">
                <motion.div className="h-full bg-red-500" initial={{ width: 0 }} whileInView={{ width: `${item.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} />
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{item.timeLeft}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
