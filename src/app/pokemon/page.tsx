"use client";
import { useEffect, useState } from "react";
import { getPokemonList } from "../lib/pokeapi"; // 相対パス
import { Pokemon } from "../lib/types";
import Container from "@/components/container/Container";
import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/Pagination/Pagenation";
import Card from "@/components/Card/Card";

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // ページの初期値を1に変更
  const [totalPages, setTotalPages] = useState(1); // 総ページ数
  const limit = 20;

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      try {
        const { pokemon: pokemonData, totalCount } = await getPokemonList(
          limit,
          page // ページ番号を渡す
        );

        setPokemon(pokemonData);
        const totalPage = Math.ceil(totalCount / limit); // 呼び出し側でページ数を計算
        setTotalPages(totalPage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleLastPage = () => {
    if (page < totalPages) {
      setPage(totalPages);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleFirstPage = () => {
    if (page > 1) {
      setPage(1);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Container>
        <Card data={pokemon} />
        <Pagination
          handleFirstPage={handleFirstPage}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handleLastPage={handleLastPage}
          page={page} // 0基準のページ番号に対応
          totalPages={totalPages} // 総ページ数も0基準に対応
        />
      </Container>
    </div>
  );
}
