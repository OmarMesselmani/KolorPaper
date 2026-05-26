import Hero from "@/components/Hero";
import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <>
      {/* We render Hero directly so it doesn't flash. It doesn't rely on async data fetching. */}
      <Hero />
      <GridSkeleton />
    </>
  );
}
