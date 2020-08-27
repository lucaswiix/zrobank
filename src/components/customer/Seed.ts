import { Seed } from '../../test/Types';
import { CustomerModel } from './Model';
import { ICustomer } from './Types';

const generator = keyGenerator();

export const CustomerSampleData: Partial<ICustomer> = {
  key: '1001',
  name: 'Lucas Wiix',
  email: 'lucas@zrobank.com.br',
  password:
    '$argon2i$v=19$m=4096,t=3,p=1$sRbYmlrX4Z309rc208C9vg$L1PniwtdfKfyYxBJHwWgk9Xu9ox/3ZYLnzKaJRif1ek',
};

export const CustomerSeed: Seed<ICustomer> = {
  model: CustomerModel,
  data: [
    {
      ...CustomerSampleData,
      key: generator.next().value || '',
    },
    {
      ...CustomerSampleData,
      email: 'mailzrobank1@mail.com.br',
      key: generator.next().value || '',
    },
  ] as Partial<ICustomer>[],
};

function* keyGenerator(): Iterator<string> {
  let currentKey = 1000;

  while (true) {
    yield String(currentKey++);
  }
}

export function createCustomerTokenData(data?: Partial<ICustomer>) {
  return {
    key: (data || CustomerSeed.data[0]).key,
    name: (data || CustomerSeed.data[0]).name,
    email: (data || CustomerSeed.data[0]).email,
  };
}
