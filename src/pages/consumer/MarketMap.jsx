import "./MarketMap.css";

function MarketMap() {
  return (
    <section className="market-map-section">
      <div className="wrap mob">
        <div className="info-text-box">
          <p className="sub-font">
            [시장명] 휴무일은 [휴무일]로, 이번달 휴무일은{" "}
            <span className="holiday">7일, 21일</span>입니다.
          </p>
        </div>
        <div className="legend-container">
          <p>
            <span className="color-box restaurant"></span>
            <span className="legend-name">음식</span>
          </p>
          <p>
            <span className="color-box grocery"></span>
            <span className="legend-name">식자재</span>
          </p>
          <p>
            <span className="color-box haberdashery"></span>
            <span className="legend-name">잡화</span>
          </p>
          <p>
            <span className="color-box etc"></span>
            <span className="legend-name">기타</span>
          </p>
        </div>
        <div className="market-map-container">
          <div className="nearby-market"></div>
          <div className="market-map-box">
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
            <span className="market-box"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketMap;
