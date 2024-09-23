"use client";
import { useState, useEffect } from "react";
import { searchPokemonByJapaneseName } from "../lib/pokeapi"; // 修正した検索関数をインポート
import { Pokemon } from "../lib/types";
import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/Pagination/Pagenation";
import style from "./page.module.css";
import Container from "@/components/container/Container";
import Card from "@/components/Card/Card";

export default function PokemonSearch() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 実際に検索に使うクエリ
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]); // 全検索結果を保存
  const [currentPage, setCurrentPage] = useState(1); // 初期値を1に戻す
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10; // 1ページあたりの表示件数

  useEffect(() => {
    if (searchQuery === "") {
      setAllPokemon([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    async function fetchPokemon() {
      setLoading(true);
      const result = await searchPokemonByJapaneseName(searchQuery);
      console.log(result);
      setAllPokemon(result.pokemon); // 全件を保存
      setTotalPages(Math.ceil(result.pokemon.length / limit));
      setLoading(false);
    }

    fetchPokemon();
  }, [searchQuery]);

  // ページのデータをスライスして表示
  const paginatedPokemon = allPokemon.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleSearch = () => {
    setSearchQuery(query); // 入力されたクエリで検索を実行
    setCurrentPage(1); // 検索時にページをリセット
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  return (
    <Container>
      <div className={style.inputWrap}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // 文字を入力しても検索は実行されない
          placeholder="ポケモンを検索"
          className={style.input}
        />
        <button
          onClick={handleSearch}
          type="button"
          className={style.searchButton}
        >
          検索
        </button>
      </div>
      <div className={style.note}>※カタカナかひらがなで入力してください</div>

      {loading && <Loading />}

      {!loading && paginatedPokemon.length > 0 && (
        <div className={style.resultBox}>
          <Card data={paginatedPokemon} isSearch />
        </div>
      )}

      {!loading && paginatedPokemon.length === 0 && searchQuery !== "" && (
        <p className={style.noData}>結果が見つかりませんでした。</p>
      )}

      {!loading && allPokemon.length > 0 && (
        <Pagination
          handleFirstPage={handleFirstPage}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handleLastPage={handleLastPage}
          page={currentPage}
          totalPages={totalPages}
        />
      )}
    </Container>
  );
}
