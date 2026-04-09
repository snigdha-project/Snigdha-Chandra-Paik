import Hero from "@/components/about/Hero";
import Skills from "@/components/about/Skills";
import Parents from "@/components/about/Parents";
import Gurudev from "@/components/about/Gurudev";
import Favorites from "@/components/about/Favorites";

export default function Home() {
  return (
    <main>
      <Hero />
      <Skills />
      <Parents />
      <Gurudev />
      <Favorites />
      {/* Other sections like Projects, About, etc. will go here */}
    </main>
  );
}
