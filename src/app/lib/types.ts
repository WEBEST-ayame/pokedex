export type Pokemon = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  count: number;
  sprites: Sprites;
};

export type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  genus: string;
  ability: string;
  imageUrl: string;
  types: PokemonType[];
  abilityDescription: string;
  count: number;
};

export type PokemonType = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type Language = {
  name: string;
  url: string;
};

export type PokemonName = {
  name: string;
  language: Language;
};

export type PokemonGenus = {
  genus: string;
  language: Language;
};

export type Sprites = {
  front_default: string | null;
  other?: {
    home?: {
      front_default: string | null;
    };
    "official-artwork"?: {
      front_default: string | null;
    };
  };
};
