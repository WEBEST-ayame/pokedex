"use client";
import { useState, useEffect } from "react";
import {
  findMaxPokemonId,
  findNextPokemonId,
  findPreviousPokemonId,
  getPokemonDetailsInJapanese,
} from "../../lib/pokeapi";
import style from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Container from "@/components/container/Container";
import Loading from "@/components/Loading/Loading";
import { PokemonDetails } from "@/app/lib/types";

export default function PokemonDetail({ params }: { params: { id: string } }) {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [maxPokemonId, setMaxPokemonId] = useState<number | null>(null);
  const [nextPokemonId, setNextPokemonId] = useState<number | null>(null);
  const [prevPokemonId, setPrevPokemonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // データのローディング状態を管理
  const [imageLoaded, setImageLoaded] = useState(false); // 画像のロード状態を管理

  useEffect(() => {
    // データ取得
    async function fetchPokemonDetails() {
      setLoading(true); // データ取得前にローディング開始
      try {
        const pokemonData = await getPokemonDetailsInJapanese(Number(params.id));
        const maxId = await findMaxPokemonId();
        const nextId = await findNextPokemonId(Number(params.id));
        const prevId = await findPreviousPokemonId(Number(params.id));

        setPokemon(pokemonData);
        setMaxPokemonId(maxId);
        setNextPokemonId(nextId);
        setPrevPokemonId(prevId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // データが取得できたらローディング解除
      }
    }

    fetchPokemonDetails();
  }, [params.id]);

  // 画像が読み込まれたらコールバックを呼び出す
  const handleImageLoad = () => {
    setImageLoaded(true); // 画像が完全に読み込まれたら状態を更新
  };

  // データが読み込まれていない場合はローディングを表示
  if (loading) {
    return <Loading />;
  }

  // データがない場合の処理
  if (!pokemon) {
    return <p>ポケモンのデータが見つかりませんでした。</p>;
  }

  // 画像の読み込みが完了するまでローディングを表示
  return (
    <Container>
      <div className={style.wrapper}>
        <div className={style.mainContent}>
          <div className={style.imageWrap}>
            {!imageLoaded && (
              /* 画像がロードされていない場合はローディング */
              <div className={style.imageLoading}>
                <Loading />
              </div>
            )}
            <Image
              src={pokemon.imageUrl}
              alt={pokemon.name}
              width={100}
              height={100}
              onLoadingComplete={handleImageLoad} // 画像読み込み完了時に呼ばれる（（なくてもいいけど、画像が描画されるまで何も表示されないのが気になる場合は実装）
              onError={(e) => (e.currentTarget.src = "/image/no_image.jpg")}
            />
          </div>
          <div className={style.textContent}>
            <div className={style.number}>NO.{("0000" + pokemon.id).slice(-5)}</div>
            <h2>{pokemon.name}</h2>
            <p>分類：{pokemon.genus}</p>
            <p>タイプ：{pokemon.types}</p>
            <p>高さ：{Number(pokemon.height) / 10}m</p>
            <p>重さ：{Number(pokemon.weight) / 10}kg</p>
            <p>
              特製：{pokemon.ability}
              <br />
              {pokemon.abilityDescription}
            </p>
          </div>
          {pokemon.id !== 1 && (
            <Link
              href={`/pokemon/${prevPokemonId}`}
              className={`${style.pageTransitionButton} ${style.prevButton}`}
            >
              <ArrowBackIcon />
            </Link>
          )}
          {Number(pokemon.id) !== maxPokemonId && (
            <Link
              href={`/pokemon/${nextPokemonId}`}
              className={`${style.pageTransitionButton} ${style.nextButton}`}
            >
              <ArrowForwardIcon />
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}
