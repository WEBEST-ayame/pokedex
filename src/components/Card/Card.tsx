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
      {data.map((poke: Pokemon, index) => (
        <li key={index}>
          <Link href={`/pokemon/${poke.id}`}>
            <Image
              src={poke.imageUrl}
              alt={poke.name}
              width={100}
              height={100}
              onError={(e) => {
                console.error(`Image failed to load for ${poke.name}, using fallback`);
                e.currentTarget.src = "/image/no_image.jpg";
              }}
            />
            {isSearch && <div className={style.pokeName}>{poke.name}</div>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
