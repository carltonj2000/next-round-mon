import { PokemonClient } from "pokenode-ts";

import { prisma } from "../src/backend/utils/prisma";

const doBackfill = async () => {
  const pokeApi = new PokemonClient();
  const allPokemon = await pokeApi.listPokemons(1, 493);
  const formattedPokemon = allPokemon.results.map((p, i) => ({
    id: i + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      i + 1
    }.png`,
  }));

  for (let i = 0; i < formattedPokemon.length; i++) {
    await prisma.pokemon.create({ data: { ...formattedPokemon[i] } });
  }
};

doBackfill();
