import { ValidationError } from 'class-validator';

export const buildDescription = (fields: ValidationError[]) =>
  fields
    .reduce(
      (agg, curr) => [...agg, ...Object.values(curr.constraints)],
      [] as string[]
    )
    .join(', ');
