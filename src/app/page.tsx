import { About } from "@/components/About";
import { Community } from "@/components/Community";
import { Contact } from "@/components/Contact";
import { Corporate } from "@/components/Corporate";
import { FutureReadyLearners } from "@/components/FutureReadyLearners";
import { Hero } from "@/components/Hero";
import { Industries } from "@/components/Industries";
import { Process } from "@/components/Process";
import { Solutions } from "@/components/Solutions";
import { WhyDrisyon } from "@/components/WhyDrisyon";

/*
 * Visual rhythm: light hero → dark solutions → light process → dark industries
 * → light learning/corporate → gradient statement → light community/about → dark contact.
 * Featured work lives on its own page: /work.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Solutions />
      <Process />
      <Industries />
      <FutureReadyLearners />
      <Corporate />
      <WhyDrisyon />
      <Community />
      <About />
      <Contact />
    </>
  );
}
