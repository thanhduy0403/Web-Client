import React from "react";

function Footer() {
  return (
    <>
      <div className="w-full h-auto bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Cột 1 */}
            <div>
              <h1 className="text-2xl text-white font-semibold mb-3">
                Fashion Hub
              </h1>
              <p className="opacity-90 text-sm leading-relaxed text-white">
                Cung cấp sản phẩm chất lượng, giao hàng toàn quốc.
              </p>
              <div className="gap-3 pt-3 flex ">
                <span className="border px-3 py-1 rounded-full text-sm font-bold bg-blue-600/20 text-white">
                  Uy tín
                </span>
                <span className="border px-3 py-1 rounded-full text-sm font-bold bg-blue-600/20 text-white">
                  Nhanh chóng
                </span>
              </div>
              <span className="mt-2 inline-block border px-3 py-1 rounded-full text-sm font-bold bg-purple-600/20 text-white">
                Ưu đãi tốt
              </span>
            </div>

            {/* Cột 2 */}
            <div>
              <h1 className="text-2xl text-white font-semibold mb-3">
                Liên kết
              </h1>
              <ul className="text-sm space-y-3 text-white">
                <li className="hover:underline cursor-pointer">→ Cửa hàng</li>
                <li className="hover:underline cursor-pointer">
                  → Về chúng tôi
                </li>
                <li className="hover:underline cursor-pointer">→ Liên hệ</li>
                <li className="hover:underline cursor-pointer">→ Chính sách</li>
              </ul>
            </div>

            {/* Cột 3 */}
            <div>
              <h1 className="text-2xl text-white font-semibold mb-3">
                Liên hệ
              </h1>
              <p className="text-sm text-white">📞 0706021404</p>
              <p className="text-sm text-white">
                ✉️ nguyenthanhduy0429@gmail.com
              </p>
              <p className="text-sm mt-2 leading-relaxed text-white">
                🏢 Điện Phương — Điện Bàn — Thành Phố Đà Nẵng
              </p>
            </div>

            {/* Cột 4 */}
            <div>
              <h1 className="text-2xl text-white font-semibold mb-3">
                Kết nối
              </h1>
              <p className="text-sm text-white">
                Theo dõi chúng tôi để nhận ưu đãi mới nhất
              </p>
              <div className="flex gap-3 items-center mt-2">
                <a className="w-10 h-10 bg-blue-600/20  rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-blue-500/30">
                  <span className="text-lg">f</span>
                </a>
                <a className="w-10 h-10 bg-blue-600/20  rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-blue-500/30">
                  <span className="text-lg">📷</span>
                </a>
                <a className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-blue-500/30">
                  <span className="text-lg">▶</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-4">
            <p className=" mt-5 text-sm text-white font-bold ">
              ©{new Date().getFullYear()} FashionHub All-rights reserved
            </p>
            <p className="text-gray-700 font-bold text-sm flex gap-2 items-center">
              Hỗ trợ: <span className="text-blue-600"> 0706021404</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
