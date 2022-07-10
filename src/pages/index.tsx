import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";

const btn =
  "mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const [ids, idsSet] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);
  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    idsSet(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    !secondPokemon.isLoading &&
    firstPokemon.data &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      {dataLoaded && (
        <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
          <PokemonListing pokemon={firstPokemon.data} cb={voteForRoundest} />
          <div className="p-8">Vs</div>
          <PokemonListing pokemon={secondPokemon.data} cb={voteForRoundest} />
        </div>
      )}
      {!dataLoaded && <img src="/rings.svg" className="w-48" />}

      <div className="w-full text-xl text-center flex items-center justify-center gap-10">
        <a href="https://github.com/carltonj2000/next-round-mon">GitHub</a>
        <div className="text-2xl  text-green-300">
          <Link href="/results">
            <a>Results</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing = ({
  pokemon,
  cb,
}: {
  pokemon: PokemonFromServer;
  cb: (id: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        width={256}
        height={256}
        // src={pokemon.sprites.front_default || ""}
        src={pokemon.spriteUrl || ""}
        className="w-64 h-64"
      />
      <div className="text-xl capitalize mt-[-2rem] py-2">{pokemon.name}</div>
      <button onClick={() => cb(pokemon.id)} className={btn}>
        Rounder
      </button>
    </div>
  );
};
