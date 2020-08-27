import { Seed } from '../../test/Types';
import { CustomerSeed } from '../customer/Seed';
import { PropertyModel } from './Model';
import { IProperty } from './Types';

const generator = keyGenerator();

export const PropertySampleData: Partial<IProperty> = {
  key: '1001',
  title: 'Imovel casa linda',
  latitude: -8.0278468,
  longitude: -34.8982076,
  customer_key: CustomerSeed.data[0].key,
};

export const PropertySeed: Seed<IProperty> = {
  model: PropertyModel,
  data: [
    {
      ...PropertySampleData,
      key: generator.next().value || '',
    },
    {
      ...PropertySampleData,
      title: 'Pedro barreto casa',
      latitude: -8.043057,
      longitude: -34.899628,
      key: generator.next().value || '',
    },
  ] as Partial<IProperty>[],
};

function* keyGenerator(): Iterator<string> {
  let currentKey = 1000;

  while (true) {
    yield String(currentKey++);
  }
}
