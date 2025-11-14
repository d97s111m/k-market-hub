import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import StoreList from "./pages/consumer/StoreList";
import StoreDetail from "./pages/consumer/StoreDetail";
import Header from "./components/layout/Header";
import MarketMap from "./pages/consumer/MarketMap";

function AppContent() {
  const location = useLocation();

  const getHeaderType = (pathname) => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/merchant")) return "merchant";
    if (pathname.startsWith("/store") || pathname.startsWith("/marketmap"))
      return "consumer";
    return null;
  };

  const headerType = getHeaderType(location.pathname);

  return (
    <div className="App">
      {headerType && <Header type={headerType} />}

      <Routes>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            <main className="main-content">
              <section className="project-intro">
                <h2>프로젝트 소개</h2>
                <div className="intro-grid">
                  <div className="intro-item">
                    <h3>🎯 목적</h3>
                    <p>전국 전통시장 정보 통합 제공 및 상인 직접 관리 시스템</p>
                  </div>
                  <div className="intro-item">
                    <h3>⚡ 특징</h3>
                    <p>웹 기반 접근, 직관적 UI, 위치 기반 서비스</p>
                  </div>
                  <div className="intro-item">
                    <h3>🛠️ 기술</h3>
                    <p>React, Google Sheets API, 반응형 웹</p>
                  </div>
                </div>
              </section>

              <section className="demo-section">
                <h2>데모 체험하기</h2>
                <div className="demo-buttons">
                  <Link to="/marketmap" className="demo-btn consumer">
                    <span className="btn-icon">🛒</span>
                    <span className="btn-text">소비자 페이지</span>
                    <span className="btn-desc">
                      시장 지도, 상점 목록, 상세 정보
                    </span>
                  </Link>

                  <button className="demo-btn merchant">
                    <span className="btn-icon">🏪</span>
                    <span className="btn-text">상인 페이지</span>
                    <span className="btn-desc">가게 등록, 정보 수정</span>
                  </button>

                  <button className="demo-btn admin">
                    <span className="btn-icon">👨‍💼</span>
                    <span className="btn-text">관리자 페이지</span>
                    <span className="btn-desc">승인 관리, 로그 확인</span>
                  </button>
                </div>
              </section>
            </main>
          }
        />

        {/* 상점 목록 페이지 */}
        <Route path="/marketmap" element={<MarketMap />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/stores/:id" element={<StoreDetail />} />
      </Routes>

      <footer className="main-footer">
        <p>© 2025 K-Market Hub - 포트폴리오 프로젝트</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
