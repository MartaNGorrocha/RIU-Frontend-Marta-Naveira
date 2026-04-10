export type HeroUniverse = 'Marvel' | 'DC';

export interface Hero {
  id: number;
  name: string;
  alias: string;
  universe: HeroUniverse;
  powerLevel: number;
  city: string;
  active: boolean;
}
