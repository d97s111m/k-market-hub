import "./MarketMap.css";

function MarketMap() {
  // 임시 지도 데이터를 위한 내용
  const marketLayout = {
    sections: {
      가: 14,
      나: 10,
      다: 12,
      라: 15,
      마: 12,
    },
  };

  return (
    <section className="market-map-section">
      <div className="wrap mob">
        <div className="info-text-box">
          <p className="sub-font">
            [시장명] 휴무일은 [휴무일]로, 이번달 휴무일은{" "}
            <span className="holiday">7일, 21일</span>입니다.
            {/* 개발을 통해 휴무일 자동 설정이 필요함 */}
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
          <div className="nearby-market">자유시장</div>
          <div className="map-viewport">
            <div className="market-map-box">
              {Object.entries(marketLayout.sections).map(
                ([sectionName, count]) => (
                  <div
                    key={sectionName}
                    className={`market-section section-${sectionName}`}
                  >
                    {Array.from({ length: count }, (_, i) => (
                      <div
                        key={`${sectionName}-${i + 1}`}
                        className="market-box"
                      >
                        {sectionName}-{i + 1}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketMap;
