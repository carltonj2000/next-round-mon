import type { GetStaticProps } from "next";
import Image from "next/image";

import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";

type PokemonQueryResult = AsyncReturnType<typeof getPokemonOrdered>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex flex-col w-32 items-center">
      <Image width={64} height={64} src={pokemon.spriteUrl || ""} />
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>{pokemon._count.votesFor}+</div>
          <div>-{pokemon._count.votesAgainst}</div>
        </div>
        <div>{pokemon.name}</div>
      </div>
    </div>
  );
};
export const ResultsPage: React.FC<{ pokemon: PokemonQueryResult }> = ({
  pokemon,
}) => {
  return (
    <div className="flex flex-col max-w-4xl mx-auto items-center">
      <h1 className="text-3xl p-4">Results</h1>
      <div className="flex flex-row flex-wrap gap-2">
        {pokemon?.map((p) => (
          <PokemonListing key={p.id} pokemon={p} />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;

const getPokemonOrdered = async () =>
  await prisma.pokemon.findMany({
    orderBy: { votesFor: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: { select: { votesFor: true, votesAgainst: true } },
    },
  });

export const getStaticProps: GetStaticProps = async () => {
  const pokemon = await getPokemonOrdered();
  return { props: { pokemon }, revalidate: 60 };
};
