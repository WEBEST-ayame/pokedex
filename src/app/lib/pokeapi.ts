import { Pokemon, PokemonGenus, PokemonName, Sprites } from "./types";

// 画像と総数は全ページで使うため、関数化してidで取得
const getImageUrl = (sprites: Sprites): string => {
  // 1. official-artworkがあるか確認
  if (sprites.other?.["official-artwork"]?.front_default) {
    return sprites.other["official-artwork"].front_default;
  }

  // 2. homeのfront_defaultを確認
  if (sprites.other?.home?.front_default) {
    return sprites.other.home.front_default;
  }

  // 4. sprites直下のfront_defaultを確認
  if (sprites.front_default) {
    return sprites.front_default;
  }

  // 5. それもない場合はno imageの画像を表示
  return "/image/no_image.jpg";
};

// ポケモンの総数を取得する関数
export const getCount = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon count");
  }
  const data = await response.json();
  return data.count;
};

// 一覧取得
export const getPokemonList = async (limit = 20, page = 1) => {
  // 全ポケモンの総数を取得
  const totalPokemonCount = await getCount();

  // 現在のページ用にデータを取得 (page - 1) * limit に修正
  const offset = (page - 1) * limit;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  // 各ポケモンの詳細情報を取得し、spritesを使って画像URLを取得
  const pokemonList = await Promise.all(
    data.results.map(async (pokemon: Pokemon) => {
      const pokemonDetailResponse = await fetch(pokemon.url); // 各ポケモンの詳細情報を取得
      const pokemonDetail = await pokemonDetailResponse.json();

      return {
        ...pokemon,
        id: Number(pokemon.url.match(/\/(\d+)\/$/)?.[1]),
        imageUrl: getImageUrl(pokemonDetail.sprites), // ポケモンの詳細からspritesを使用
      };
    })
  );

  return {
    pokemon: pokemonList, // 全ポケモン
    totalCount: totalPokemonCount, // 全ポケモンの総数
  };
};

// 最大id検索
// すべてのポケモンIDを取得して最大のIDを探す関数
export const findMaxPokemonId = async () => {
  const totalPokemonCount = await getCount(); // 総ポケモン数を取得
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemonCount}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  // ポケモンのURLからIDを抽出
  const allIds = data.results.map((pokemon: Pokemon) => {
    return Number(pokemon.url.match(/\/(\d+)\/$/)?.[1]);
  });

  // すべてのIDの中から最大のIDを見つける
  const maxId = Math.max(...allIds);

  return maxId;
};

// 詳細データ取得（日本語がなければ英語を使用）
export const getPokemonDetailsInJapanese = async (id: number) => {
  try {
    // 1. ポケモンの基本情報を取得
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon details for id ${id}`);
    }
    const data = await response.json();

    // 2. speciesのURLから詳細情報を取得
    let speciesData = null;
    const speciesResponse = await fetch(data.species.url);

    // 3. speciesデータを取得
    if (speciesResponse.ok) {
      speciesData = await speciesResponse.json();
    } else {
      throw new Error(`Failed to fetch species data for Pokémon with id ${id}`);
    }

    // typesとabilityのAPIリクエストを並行して実行
    const [typesResponse, abilityResponse] = await Promise.all([
      fetch(data.types[0].type.url),
      fetch(data.abilities[0].ability.url),
    ]);

    if (!typesResponse.ok || !abilityResponse.ok) {
      throw new Error(
        `Failed to fetch additional details for Pokémon with id ${id}`
      );
    }

    const typesData = await typesResponse.json();
    const abilityData = await abilityResponse.json();

    // 4. 日本語の情報を取得、失敗した場合は英語名を使用
    const japaneseName =
      speciesData?.names?.find(
        (name: PokemonName) => name.language.name === "ja"
      )?.name || data.name; // speciesデータから日本語名があればそれを使用、なければ英語名

    const japaneseGenus =
      speciesData?.genera?.find(
        (name: PokemonGenus) => name.language.name === "ja"
      )?.genus || "分類なし";

    const japaneseTypes =
      typesData.names.find((name: PokemonName) => name.language.name === "ja")
        ?.name || data.types[0].type.name;

    const japaneseAbility =
      abilityData.names.find((name: PokemonName) => name.language.name === "ja")
        ?.name || data.abilities[0].ability.name;

    const japaneseAbilityDescription =
      abilityData.flavor_text_entries.find(
        (entry: PokemonName) => entry.language.name === "ja"
      )?.flavor_text || "説明なし";

    return {
      ...data,
      name: japaneseName,
      genus: japaneseGenus,
      imageUrl: getImageUrl(data.sprites),
      types: japaneseTypes,
      ability: japaneseAbility,
      abilityDescription: japaneseAbilityDescription,
    };
  } catch (error) {
    console.error(error);
    return null; // エラー時はnullを返す
  }
};

// ポケモンの日本語名で部分一致検索する関数
export const searchPokemonByJapaneseName = async (
  query: string,
  page = 1 // 初期値を1に設定
) => {
  const filteredPokemon: Pokemon[] = [];

  const totalPokemonCount = await getCount(); // 総数取得

  // 全ポケモンデータを取得
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemonCount}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  // ひらがなをカタカナに変換する関数
  function convertHiraganaToKatakana(query: string) {
    return query.replace(/[\u3041-\u3096]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) + 0x60);
    });
  }

  // ひらがなをカタカナに変換
  const katakanaQuery = convertHiraganaToKatakana(query);

  // すべてのポケモンの詳細を取得して検索
  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: Pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      if (!pokemonResponse.ok) return null;
      const pokemonData = await pokemonResponse.json();

      const speciesResponse = await fetch(pokemonData.species.url);
      if (!speciesResponse.ok) return null;
      const speciesData = await speciesResponse.json();

      // 日本語名を取得。なければ英語名を使用
      const japaneseName =
        speciesData.names.find(
          (name: PokemonName) => name.language.name === "ja"
        )?.name || speciesData.name;

      return {
        name: japaneseName,
        id: speciesData.id,
        sprites: pokemonData.sprites,
        imageUrl: getImageUrl(pokemonData.sprites),
      };
    })
  );

  // クエリとの一致をフィルタリング
  pokemonDetails.forEach((pokemon) => {
    if (pokemon && pokemon.name.includes(katakanaQuery)) {
      filteredPokemon.push(pokemon);
    }
  });

  return {
    pokemon: filteredPokemon, // ページに対応するポケモンを返す
    totalCount: filteredPokemon.length, // 検索結果の総数を返す
    currentPage: page,
  };
};
