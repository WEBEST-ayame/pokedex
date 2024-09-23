import Image from "next/image";
import style from "./page.module.css";

export default function Home() {
  return (
    <div className={style.homeWrapper}>
      <div className={style.homeInner}>
        <div className={style.logoImageWrap}>
          <Image
            src="/image/pokemon_logo.png"
            alt="pokemon"
            width={999}
            height={258}
          />
        </div>
        <p className={style.homeText}>
          PokéAPIをつかった
          <br className={style.phoneBr} />
          ポケモン図鑑で
          <br className={style.phoneBr} />
          遊んでみてね！
        </p>
      </div>
    </div>
  );
}
