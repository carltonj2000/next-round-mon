import { useState } from "react";
import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { inferQueryResponse } from "./api/trpc/[trpc]";

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

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading &&
          !secondPokemon.isLoading &&
          firstPokemon.data &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                cb={voteForRoundest}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                cb={voteForRoundest}
              />
            </>
          )}
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
      <img src={pokemon.sprites.front_default || ""} className="w-64 h-64" />
      <div className="text-xl capitalize mt-[-2rem]">{pokemon.name}</div>
      <button onClick={() => cb(pokemon.id)} className={btn}>
        Rounder
      </button>
    </div>
  );
};
