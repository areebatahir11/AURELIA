import Hero from "@/features/home/Hero";
import FeaturedCollection from "@/features/home/FeaturedCollection";
import BrandShowcase from "@/features/home/brandshowcase";
import WhyAurelia from "@/features/home/whyaurelia";
import Stats from "@/features/home/stats";
import Testimonials from "@/features/home/testimonials";
import CTA from "@/features/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <BrandShowcase />
      <WhyAurelia />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}