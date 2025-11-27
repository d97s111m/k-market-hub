import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuActive, SetMenuActive] = useState(false);

  const toggleMenu = () => {
    SetMenuActive(!menuActive);
  };

  const closeMenu = () => {
    SetMenuActive(false);
  };

  return (
    <header className="consumer-header">
      {/* 원래는 marketInfo에서 지역명과 시장 이름을 가지고 와서 시장마다 다르게 표시될 구역 */}
      <div className="wrap po-rel">
        <div className="header-box po-rel">
          <h1>
            <a href="/marketmap">원주 중앙시장</a>
          </h1>
          <button
            className={`nav-open-btn ${menuActive ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <ul className={menuActive ? "active" : ""}>
          <li>전국 시장 보기</li>
          <li>
            <Link to="/marketmap" onClick={closeMenu}>
              시장 지도
            </Link>
          </li>
          <li>
            <Link to="/stores" onClick={closeMenu}>
              상가 목록
            </Link>
          </li>
          <li>
            <Link to="/parkinginfo" onClick={closeMenu}>
              주차장 정보
            </Link>
          </li>
          <li>공지사항</li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
