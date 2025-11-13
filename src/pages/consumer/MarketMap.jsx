import "./MarketMap.css";
import { useState, useEffect } from "react";
import { getStoreList, getCategories } from "../../utils/api";

function MarketMap() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, categoryData] = await Promise.all([
          getStoreList(),
          getCategories(),
        ]);
        setStores(storeData);
        setCategories(categoryData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 상점 정보 매칭
  const getStoreInfo = (section, num) => {
    return stores.find(
      (store) => store.storeSection === section && store.storeNum === num
    );
  };

  // 카테고리 정보 매칭
  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.sortId === categoryId);
  };

  if (loading) return <div>지도 로딩중...</div>;

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
            <span className="color-box 음식"></span>
            <span className="legend-name">음식</span>
          </p>
          <p>
            <span className="color-box 식자재"></span>
            <span className="legend-name">식자재</span>
          </p>
          <p>
            <span className="color-box 잡화"></span>
            <span className="legend-name">잡화</span>
          </p>
          <p>
            <span className="color-box 기타"></span>
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
                    {Array.from({ length: count }, (_, i) => {
                      const storeInfo = getStoreInfo(sectionName, i + 1);
                      const categoryInfo = storeInfo
                        ? getCategoryInfo(storeInfo.categoryId)
                        : null;

                      return (
                        <div
                          key={`${sectionName}-${i + 1}`}
                          className={`market-box ${
                            categoryInfo ? categoryInfo.mainCategory : "empty"
                          }`}
                        >
                          {storeInfo ? (
                            <>
                              <p className="block-number">
                                {sectionName}-{i + 1}
                              </p>
                              <p className="category-icon">
                                {categoryInfo?.icon}
                              </p>

                              <p className="store-name">
                                {storeInfo.storeName}
                              </p>
                            </>
                          ) : (
                            `${sectionName}-${i + 1}`
                          )}
                        </div>
                      );
                    })}
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
