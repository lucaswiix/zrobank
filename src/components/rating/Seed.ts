import { Seed } from '../../test/Types';
import { CustomerSeed } from '../customer/Seed';
import { PropertySeed } from '../property/Seed';
import { RatingModel } from './Model';
import { IRating } from './Types';

const generator = keyGenerator();

export const RatingSampleData: Partial<IRating> = {
  key: '1001',
  customer_key: CustomerSeed.data[0].key,
  property_key: PropertySeed.data[0].key,
  description: 'Imovel muito bacana',
  rating: 4,
};

export const RatingSeed: Seed<IRating> = {
  model: RatingModel,
  data: [
    {
      ...RatingSampleData,
      key: generator.next().value || '',
    },
    {
      ...RatingSampleData,
      description: undefined,
      rating: 2,
      key: generator.next().value || '',
    },
  ] as Partial<IRating>[],
};

function* keyGenerator(): Iterator<string> {
  let currentKey = 1000;

  while (true) {
    yield String(currentKey++);
  }
}
