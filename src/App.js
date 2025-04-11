import { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import dynamic from "next/dynamic";
import { StaticRouter } from "react-router-dom/server";

// Bileşenimiz mouse hareketlerini takip eder ve koordinatları ekrana yazdırır.
// Bazı eksiklikler ve olası hatalar bulunuyor.

// Görevler:
// 1. useEffect içinde eklenen event listener, bileşen kaldırıldığında (unmount) temizlenmiyor.
//    - cleanup fonksiyonunu ekleyerek, bileşen kaldırıldığında event listener'ın kaldırılmasını sağlayın.
// 2. Mevcut kodda, "Can't perform a React state update on an unmounted component" hatası oluşabilir.
//    - Bu hatayı neden alabiliriz? Kodda değişiklik yapmadan nasıl önleyebiliriz?
// 3. Mouse'un X ve Y koordinatları state'te tutuluyor, ancak performans açısından gereksiz güncellemeler olabilir.
//    - Bunu optimize etmek için ne yapılabilir?

// Bonus:
// - React bileşeni Next.js veya başka bir SSR (Server-Side Rendering) ortamında çalıştırıldığında,
//   "document is not defined" hatası alınabilir.
//   - Bunun sebebi nedir? window nesnesi yalnızca tarayıcıda bulunduğuna göre, SSR uyumlu hale getirmek için ne yapmalıyız?
// - Tailwind CSS kullanılarak, mouse koordinatlarını ekranda bir tooltip efektiyle gösterecek stil ekleyin.
// - Tailwind’in eklenti sistemi ile özel bir shadow-glow efekti tanımlayın ve nasıl eklendiğini açıklayın.

// SSR'siz dinamik bileşen
const MousePosition = dynamic(() => import("./MousePosition"), { ssr: false });

export default function App({ location }) {
  const isBrowser = typeof window !== "undefined";

  return (
    <div className="flex justify-center flex-col items-center py-8">
      <h1 className="text-2xl font-bold pb-4">🐭</h1>
      {isBrowser ? (
        <BrowserRouter>
          <nav className="flex justify-center max-w-sm p-4 pb-8 space-x-4">
            <Link className="underline" to="/">
              Home
            </Link>
            <Link className="underline" to="/about">
              About
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<MousePosition />} />
            <Route
              path="/about"
              element={<h1>Mouse&apos;unuzu takip edin!</h1>}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <StaticRouter location={location}>
          <Routes>
            <Route
              path="/about"
              element={<h1>Bu sadece sunucuda çalışıyor!</h1>}
            />
          </Routes>
        </StaticRouter>
      )}
    </div>
  );
}

// MousePosition bileşeni (dinamik olarak yüklenir)
function MousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      console.log("Updating state");
    };

    window.addEventListener("pointermove", handleMove);

    return () => {
      console.log("Unmounted");
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div
        className="absolute bg-gray-600 border-2 rounded-md text-white p-5 opacity-50 border-gray-900 shadow-toolkit"
        style={{ left: `${position.x + 20}px`, top: `${position.y + 20}px` }}
      >
        <div>
          X position: <strong>{position.x.toFixed(2)}</strong>
        </div>
        <div>
          Y position: <strong>{position.y.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
