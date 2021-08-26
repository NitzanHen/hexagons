import z from 'zod';

const PointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).min(180)
})

export const isPoint = (input: unknown): input is Point => PointSchema.safeParse(input).success;

export interface Point extends z.infer<typeof PointSchema> { }