import * as trpc from "@trpc/server";
import { z } from "zod";

import { PokemonClient } from "pokenode-ts";
import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      // if using remote db
      // const pokemonApiConnection = new PokemonClient();
      // const pokemon = await pokemonApiConnection.getPokemonById(input.id);
      // return { sprites: pokemon.sprites, name: pokemon.name, id: input.id };
      // if using local db
      const pokemon = await prisma.pokemon.findFirst({
        where: { id: input.id },
      });
      if (!pokemon)
        throw new Error(`Pokemon does not exist with id = ${input.id}`);
      return pokemon;
    },
  })
  .mutation("cast-vote", {
    input: z.object({ votedFor: z.number(), votedAgainst: z.number() }),
    async resolve({ input }) {
      const vote = await prisma.vote.create({ data: { ...input } });
      return { success: true, vote };
    },
  });

export type AppRouter = typeof appRouter;
