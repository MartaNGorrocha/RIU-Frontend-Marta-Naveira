import { HERO_UNIVERSES } from "../constants/hero.constants";

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

export type HeroFormMode = 'create' | 'edit' | 'detail';

export type HeroUniverse = typeof HERO_UNIVERSES[number];
