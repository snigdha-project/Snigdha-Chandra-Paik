import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Tech from "@/components/home/TechSection";
import Projects from "@/components/home/Projects";
import Hobbies from "@/components/home/Hobbies";
import Blogs from "@/components/home/Blogs";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Tech />
      <Projects />
      <Hobbies />
      <Blogs />
      {/* Other sections like Projects, About, etc. will go here */}
    </main>
  );
}
