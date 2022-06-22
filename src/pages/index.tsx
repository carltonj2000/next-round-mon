import type { NextPage } from "next";
import { getOptionsForVote } from "@/utils/getRandomPokemon";

const Home: NextPage = () => {
  const [first, second] = getOptionsForVote();
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-red-800" id="1">
          {first}
        </div>
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-red-800" id="2">
          {second}
        </div>
      </div>
    </div>
  );
};

export default Home;
