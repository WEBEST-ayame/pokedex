import Link from "next/link";
import Image from "next/image";
import { Pokemon } from "@/app/lib/types";
import style from "./Card.module.css";

type CardProp = {
  data: Pokemon[];
  isSearch?: boolean;
};

export default function Card({ data, isSearch }: CardProp) {
  return (
    <ul className={style.listWrap}>
      {data.map((poke: Pokemon) => (
        <li key={poke.id}>
          <Link href={`/pokemon/${poke.id}`}>
            <Image
              src={poke.imageUrl}
              alt={poke.name}
              width={100}
              height={100}
            />
            {isSearch && <div className={style.pokeName}>{poke.name}</div>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
