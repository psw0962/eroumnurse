import { useState, useEffect } from "react";

export function useKakaoMap() {
  const [loaded, setLoaded] = useState(() => {
    return !!(window.kakao && window.kakao.maps && window.kakao.maps.Map);
  });

  useEffect(() => {
    if (loaded) return;

    const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
    const SCRIPT_ID = "kakao-map-sdk";

    let script = document.getElementById(SCRIPT_ID);

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
    }

    const onLoad = () => {
      window.kakao.maps.load(() => {
        setLoaded(true);
      });
    };

    script.addEventListener("load", onLoad);

    return () => {
      script.removeEventListener("load", onLoad);
    };
  }, [loaded]);

  return loaded;
}
