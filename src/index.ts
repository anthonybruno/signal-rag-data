import { createCollection } from './scripts/createCollection';

async function setup(): Promise<void> {
  await createCollection();
}

void setup();
