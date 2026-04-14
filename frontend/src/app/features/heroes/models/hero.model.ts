export type HeroUniverse = 'Marvel' | 'DC';

export interface HeroListItem {
  id: string;
  name: string;
  alias: string;
  universe: HeroUniverse;
  powerLevel: number;
  city: string;
  active: boolean;
}

export interface Hero extends HeroListItem {
  superPower: string;
  description: string;
}
