import { motion } from "framer-motion";
import { VideoCard } from "@/components/VideoCard";
import { VIDEOS } from "@/lib/videos";

const CATEGORIES = [
  { name: "Cuisine",      image: "/COOKING/i21.jpg", video: VIDEOS[21] },
  { name: "Pâtisserie",   image: "/COOKING/i22.jpg", video: VIDEOS[22] },
  { name: "Gastronomie", image: "/COOKING/i23.jpg", video: VIDEOS[23] },
  { name: "Barbecue",    image: "/COOKING/i24.jpg", video: VIDEOS[24] },
  { name: "Végétarien",  image: "/COOKING/i25.jpg", video: VIDEOS[25] },
  { name: "Desserts",    image: "/COOKING/i26.jpg", video: VIDEOS[26] },
  { name: "Street Food", image: "/COOKING/i27.jpg", video: VIDEOS[27] },
  { name: "Voyage",      image: "/COOKING/i28.jpg", video: VIDEOS[28] },
];

export const CategoriesSection = () => {
  return (
    <section id="categories" className="relative py-10 md:py-16 overflow-hidden bg-zinc-900">
      <div className="absolute inset-0">
        <img src="/COOKING/i29.jpg" alt="" className="w-full h-full object-cover opacity-10" />
      </div>
      <div className="absolute inset-0 bg-zinc-900/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-cinematic text-white mb-1">Nos catégories</h2>
          <div className="w-12 h-1 bg-red-500 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
            >
              <VideoCard
                image={cat.image}
                video={cat.video}
                title={cat.name}
                className="absolute inset-0 w-full h-full"
              >
                <div className="absolute inset-0 bg-black/20" />
                {/* Play button shown on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/40 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                    </svg>
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
