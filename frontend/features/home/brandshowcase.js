// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { brandService } from "@/services/brand.service";
// import SectionHeader from "@/components/ui/SectionHeader";
// import { fadeUp, staggerContainer } from "@/animations/variants";
// import { EASE } from "@/constants/animationConfig";

// function BrandLogo({ brand }) {
//   const [imageFailed, setImageFailed] = useState(false);
//   // Convention-based path — drop a file named exactly "<brand-slug>.png" into
//   // public/logos/ and it appears automatically, no code or database edit needed.
//   const logoPath = `/logos/${brand.slug}.jpg`;

//   if (!imageFailed) {
//     return (
//       <motion.img
//         src={logoPath}
//         alt={brand.name}
//         onError={() => setImageFailed(true)}
//         initial={{ scale: 0.85, opacity: 0 }}
//         whileInView={{ scale: 1, opacity: 0.7 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6, ease: EASE.luxury }}
//         whileHover={{ scale: 1.08, opacity: 1 }}
//         className="h-12 w-auto object-contain grayscale transition-[filter] duration-500 group-hover:grayscale-0"
//       />
//     );
//   }

//   return (
//     <span className="font-display text-3xl tracking-wide text-ivory/40 transition-colors duration-500 group-hover:text-gold">
//       {brand.name.charAt(0)}
//     </span>
//   );
// }

// export default function BrandShowcase() {
//   const [brands, setBrands] = useState([]);

//   useEffect(() => {
//     brandService.getAll().then(({ data }) => setBrands(data));
//   }, []);

//   return (
//     <section className="border-t border-hairline px-6 py-28 lg:px-12">
//       <div className="mx-auto max-w-7xl">
//         <SectionHeader
//           eyebrow="Our Marques"
//           title="Your Favourite Brands, One Standard"
//           description="Every marque in our collection is chosen for what it represents, not just what it sells."
//         />

//         <motion.div
//           variants={staggerContainer(0.08)}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.2 }}
//           className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
//         >
//           {brands.map((brand) => (
//             <motion.div key={brand.id} variants={fadeUp}>
//               <Link href={`/brands/${brand.slug}`} className="group relative block">
//                 <motion.div
//                   whileHover={{ y: -6 }}
//                   transition={{ duration: 0.4, ease: EASE.luxury }}
//                   className="relative flex h-56 flex-col items-center justify-center gap-4 overflow-hidden border border-hairline p-6 text-center transition-colors duration-500 group-hover:border-gold/40 group-hover:bg-surface group-hover:shadow-[0_20px_60px_-15px_rgba(169,121,63,0.25)]"
//                 >
//                   <div className="flex h-14 items-center justify-center">
//                     <BrandLogo brand={brand} />
//                   </div>

//                   <div>
//                     <p className="font-display text-lg text-ivory transition-colors duration-300 group-hover:text-gold">
//                       {brand.name}
//                     </p>
//                     <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
//                       {brand.country}
//                     </p>
//                   </div>

//                   {/* Gold underline that grows in from center on hover */}
//                   <motion.span
//                     initial={{ scaleX: 0 }}
//                     whileHover={{ scaleX: 1 }}
//                     className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-center bg-gold"
//                   />
//                 </motion.div>
//               </Link>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { brandService } from "@/services/brand.service";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { EASE } from "@/constants/animationConfig";

function BrandLogo({ brand }) {
  const [imageFailed, setImageFailed] = useState(false);

  const logoPath = `/logos/${brand.slug}.jpg`;

  if (!imageFailed) {
    return (
      <motion.img
        src={logoPath}
        alt={brand.name}
        onError={() => setImageFailed(true)}
        initial={{ scale: 0.85, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE.luxury }}
        className="
          max-h-24
          lg:max-h-28
          max-w-[170px]
          object-contain
          grayscale
          transition-all
          duration-700
          group-hover:scale-110
          group-hover:grayscale-0
        "
      />
    );
  }

  return (
    <span className="font-display text-5xl text-gold">
      {brand.name.charAt(0)}
    </span>
  );
}

export default function BrandShowcase() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    brandService.getAll().then(({ data }) => setBrands(data));
  }, []);

  return (
    <section className="relative border-t border-hairline py-32 px-6 lg:px-12 overflow-hidden">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />

      <div className="mx-auto max-w-7xl relative">

        <SectionHeader
          eyebrow="Our Marques"
          title="Your Favourite Brands, One Standard"
          description="Every marque in our collection is chosen for what it represents, not just what it sells."
        />

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {brands.map((brand) => (
            <motion.div key={brand.id} variants={fadeUp}>
              <Link
                href={`/brands/${brand.slug}`}
                className="group block"
              >
                <motion.div
                  whileHover={{
                    y: -10,
                    transition: {
                      duration: 0.45,
                      ease: EASE.luxury,
                    },
                  }}
                  className="
                    relative
                    flex
                    h-80
                    flex-col
                    items-center
                    justify-center
                    overflow-hidden
                    border
                    border-hairline
                    bg-transparent
                    transition-all
                    duration-700

                    hover:border-gold/50
                    hover:bg-surface/60
                    hover:shadow-[0_25px_80px_-20px_rgba(169,121,63,0.28)]
                  "
                >
                  {/* Gold Glow */}
                  <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                    <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
                  </div>

                  {/* Logo */}
                  <div className="relative flex h-36 w-full items-center justify-center">
                    <BrandLogo brand={brand} />
                  </div>

                  {/* Divider */}
                  <div className="mb-6 h-px w-14 bg-gold/40 transition-all duration-700 group-hover:w-24" />

                  {/* Brand */}
                  <h3 className="
                    font-display
                    text-2xl
                    text-ivory
                    transition-all
                    duration-500
                    group-hover:text-gold
                  ">
                    {brand.name}
                  </h3>

                  {/* Country */}
                  <p className="
                    mt-4
                    font-mono
                    text-xs
                    uppercase
                    tracking-[0.35em]
                    text-graphite
                  ">
                    {brand.country}
                  </p>

                  {/* Bottom Gold Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      w-full
                      origin-center
                      bg-gold
                    "
                  />

                  {/* Corner Accent */}
                  <div className="
                    absolute
                    right-4
                    top-4
                    h-2
                    w-2
                    rounded-full
                    bg-gold/30
                    transition-all
                    duration-700
                    group-hover:scale-150
                    group-hover:bg-gold
                  " />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}