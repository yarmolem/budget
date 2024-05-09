import { z } from "zod";

export const searchInput = z.string().optional();

export const paginationInput = z
  .object({
    page: z.number().default(1),
    pageSize: z.number().default(10),
  })
  .optional();

export const exampleSchema = z.object({
  age: z.number().optional(),
  name: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

const example = {
  OR: [{ name: { eq: "CRISTIAN" }, age: { gt: 18 } }],
};

export const getAllInput = () => {
  return z
    .object({
      search: searchInput,
      pagination: paginationInput,
      filters: z.object({
        AND: z.array(z.object({})).optional(),
        OR: z.array(z.object({})).optional(),
      }),
    })
    .optional();
};
