import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { VIDEOS } from "@/lib/videos";

const BANNERS = [
  { image: "/COOKING/i1.jpg",  video: VIDEOS[1],  title: "Saveurs du Monde",      genre: "Cuisine · Voyage",        desc: "Un voyage culinaire époustouflant à travers les saveurs du monde entier." },
  { image: "/COOKING/i2.jpg",  video: VIDEOS[2],  title: "Le Grand Chef",          genre: "Compétition · Cuisine",   desc: "Dans les cuisines les plus prestigieuses, un chef hors pair relève tous les défis." },
  { image: "/COOKING/i3.jpg",  video: VIDEOS[3],  title: "Recettes Secrètes",      genre: "Drame · Gastronomie",     desc: "Quand les recettes ancestrales révèlent leurs secrets, la magie opère." },
  { image: "/COOKING/i4.jpg",  video: VIDEOS[4],  title: "Festin Sauvage",         genre: "Aventure · Nature",       desc: "Partez à la découverte des ingrédients sauvages là où la nature est reine." },
  { image: "/COOKING/i5.jpg",  video: VIDEOS[5],  title: "L'Art de la Pâtisserie", genre: "Artisanat · Passion",     desc: "Au-delà des fourneaux se cache un art qui transforme la farine en chef-d'œuvre." },
];

export const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % BANNERS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[index];

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-end pb-16 md:pb-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
          <video key={banner.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={banner.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl space-y-3 md:space-y-5"
          >
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full tracking-widest uppercase">
              {banner.genre}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-cinematic text-white leading-none">
              {banner.title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-lg line-clamp-2 md:line-clamp-none">{banner.desc}</p>
            <div className="flex gap-3 pt-1">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-5 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all text-sm md:text-base">
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" /> Lire maintenant
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-5 py-3 md:px-8 md:py-4 bg-white/20 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all backdrop-blur-sm text-sm md:text-base">
                <Info className="w-4 h-4 md:w-5 md:h-5" /> Plus d'infos
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-10">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-red-500" : "w-2 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
};
