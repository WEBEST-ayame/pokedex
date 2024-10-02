import { Pokemon, PokemonGenus, PokemonName, PokemonType, Sprites } from "./types";

// 共通のAPIリクエスト関数
const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
};

// ポケモンの基本情報と species 情報を取得する関数
const getPokemonDetails = async (pokemonUrl: string) => {
  const pokemonData = await fetchData(pokemonUrl); // ポケモンデータを取得
  const speciesData = await fetchData(pokemonData.species.url); // speciesデータを取得
  return { pokemonData, speciesData }; // 両方を返す
};

// 画像と総数は全ページで使うため、関数化してidで取得
const getImageUrl = (sprites: Sprites): string => {
  if (sprites.other?.["official-artwork"]?.front_default) {
    return sprites.other["official-artwork"].front_default;
  }
  if (sprites.other?.home?.front_default) {
    return sprites.other.home.front_default;
  }
  if (sprites.front_default) {
    return sprites.front_default;
  }
  return "/image/no_image.jpg";
};

// ポケモンの総数を取得する関数
export const getCount = async () => {
  const data = await fetchData("https://pokeapi.co/api/v2/pokemon");
  return data.count;
};

// ポケモン詳細情報を取得する共通関数
const getPokemonWithImageUrl = async (pokemonUrl: string) => {
  const { pokemonData, speciesData } = await getPokemonDetails(pokemonUrl);
  const imageUrl = getImageUrl(pokemonData.sprites);

  return {
    name:
      speciesData.names.find((name: PokemonName) => name.language.name === "ja")?.name ||
      speciesData.name,
    id: speciesData.id,
    imageUrl,
    sprites: pokemonData.sprites,
  };
};

// 一覧取得
export const getPokemonList = async (limit = 20, page = 1) => {
  const totalPokemonCount = await getCount();
  const offset = (page - 1) * limit;
  const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  const pokemonList = await Promise.all(
    data.results.map((pokemon: Pokemon) => getPokemonWithImageUrl(pokemon.url))
  );

  return {
    pokemon: pokemonList,
    totalCount: totalPokemonCount,
  };
};

// 共通のIDリストを取得する関数
export const getPokemonIdList = async () => {
  const totalPokemonCount = await getCount(); // 総ポケモン数を取得
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemonCount}`);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  // URLからすべてのポケモンIDを抽出
  const allIds = data.results.map((pokemon: Pokemon) =>
    Number(pokemon.url.match(/\/(\d+)\/$/)?.[1])
  );

  return allIds;
};

// 最大IDを取得する関数
export const findMaxPokemonId = async () => {
  const allIds = await getPokemonIdList(); // すべてのポケモンIDを取得
  return Math.max(...allIds); // 最大のIDを返す
};

// 次のポケモンIDを取得する関数
export const findNextPokemonId = async (currentId: number) => {
  const allIds = await getPokemonIdList(); // すべてのポケモンIDを取得
  const nextIds = allIds.filter((id: number) => id > currentId); // 現在のIDより大きいものを取得
  return Math.min(...nextIds); // 最小のIDを返す（次のポケモンID）
};

// 前のポケモンIDを取得する関数
export const findPreviousPokemonId = async (currentId: number) => {
  const allIds = await getPokemonIdList(); // すべてのポケモンIDを取得
  const prevIds = allIds.filter((id: number) => id < currentId); // 現在のIDより小さいものを取得
  return Math.max(...prevIds); // 最大のIDを返す（前のポケモンID）
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
      throw new Error(`Failed to fetch additional details for Pokémon with id ${id}`);
    }

    const abilityData = await abilityResponse.json();

    // 4. 日本語の情報を取得、失敗した場合は英語名を使用
    const japaneseName =
      speciesData?.names?.find((name: PokemonName) => name.language.name === "ja")?.name ||
      data.name; // speciesデータから日本語名があればそれを使用、なければ英語名

    const japaneseGenus =
      speciesData?.genera?.find((name: PokemonGenus) => name.language.name === "ja")?.genus ||
      "分類なし";

    // タイプが複数ある場合を考慮して、すべてのタイプ名をマッピングし、コンマ区切りで結合
    const japaneseTypes = await Promise.all(
      data.types.map(async (typeInfo: PokemonType) => {
        const typeResponse = await fetch(typeInfo.type.url);
        const typeData = await typeResponse.json();
        return (
          typeData.names.find((name: PokemonName) => name.language.name === "ja")?.name ||
          typeInfo.type.name
        );
      })
    ).then((types) => types.join("、 "));

    const japaneseAbility =
      abilityData.names.find((name: PokemonName) => name.language.name === "ja")?.name ||
      data.abilities[0].ability.name;

    const japaneseAbilityDescription =
      abilityData.flavor_text_entries.find((entry: PokemonName) => entry.language.name === "ja")
        ?.flavor_text || "説明なし";

    return {
      ...data,
      name: japaneseName,
      genus: japaneseGenus,
      imageUrl: getImageUrl(data.sprites),
      types: japaneseTypes, // 複数のタイプに対応
      ability: japaneseAbility,
      abilityDescription: japaneseAbilityDescription,
    };
  } catch (error) {
    console.error(error);
    return null; // エラー時はnullを返す
  }
};

// ポケモンの日本語名で部分一致検索する関数
export const searchPokemonByJapaneseName = async (query: string, page = 1) => {
  const totalPokemonCount = await getCount();
  const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemonCount}`);

  const convertHiraganaToKatakana = (query: string) =>
    query.replace(/[\u3041-\u3096]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60));

  const katakanaQuery = convertHiraganaToKatakana(query);

  const pokemonDetails = await Promise.all(
    data.results.map((pokemon: Pokemon) => getPokemonWithImageUrl(pokemon.url))
  );

  const filteredPokemon = pokemonDetails.filter(
    (pokemon) => pokemon && pokemon.name.includes(katakanaQuery)
  );

  return {
    pokemon: filteredPokemon,
    totalCount: filteredPokemon.length,
    currentPage: page,
  };
};
