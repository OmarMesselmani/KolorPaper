import Hero from "@/components/Hero";
import { HomeSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <>
      <Hero />
      <HomeSkeleton />
    </>
  );
}
