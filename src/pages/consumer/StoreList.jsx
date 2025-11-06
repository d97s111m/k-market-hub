import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoreList, getCategories } from "../../utils/api";
import Loading from "../../components/common/Loading";
import "./StoreList.css";

function StoreList() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("전체");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [storeData, categoryData] = await Promise.all([
          getStoreList(),
          getCategories(),
        ]);

        if (isMounted) {
          setStores(storeData);
          setCategories(categoryData);
          console.log("Categories loaded:", categoryData);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loading message="상점 정보 불러오는 중..." />;
  if (error) return <div>에러: {error}</div>;

  // 대분류 목록
  const mainCategories = [
    "전체",
    ...new Set(categories.map((cat) => cat.mainCategory)),
  ];

  // 대분류별 소분류 그룹핑
  const groupedCategories = categories.reduce((acc, category) => {
    const main = category.mainCategory;
    if (!acc[main]) acc[main] = [];
    acc[main].push(category);
    return acc;
  }, {});

  // 필터박스 오픈
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // 체크박스 핸들러
  const handleFilterChange = (categoryId) => {
    setSelectedFilters(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // 체크 해제
          : [...prev, categoryId] // 체크 추가
    );
    console.log("선택된 필터들:", selectedFilters);
  };

  // 필터링
  const getFilteredStores = () => {
    let filtered = stores;

    // 1단계: 탭으로 필터링
    if (activeTab !== "전체") {
      filtered = filtered.filter((store) => {
        const category = categories.find(
          (cat) => cat.sortId === store.categoryId
        );
        return category?.mainCategory === activeTab;
      });
    }

    // 2단계: 체크박스 필터링
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((store) =>
        selectedFilters.includes(store.categoryId)
      );
    }

    return filtered;
  };

  const filteredStores = getFilteredStores();

  // 탭 변경시 필터 초기화
  const handleTabClick = (mainCat) => {
    setActiveTab(mainCat);
    setSelectedFilters([]); // 탭 바뀌면 필터 초기화
  };

  // 카테고리 매칭 함수 추가
  const getCategoryInfo = (categoryId) => {
    const category = categories.find((cat) => cat.sortId === categoryId);
    return category
      ? {
          main: category.mainCategory,
          sub: category.subCategory,
        }
      : { main: "분류없음", sub: "분류없음" };
  };
  // 상점 클릭 핸들러 추가
  const handleStoreClick = (storeId) => {
    navigate(`/stores/${storeId}`);
  };
  return (
    <section className="store-list-section">
      <div className="wrap mob">
        {/* 탭 메뉴 */}
        <div className="upper-tab-container">
          {mainCategories.map((mainCat) => (
            <button
              key={mainCat}
              className={`tab-btn sub-font ${
                activeTab === mainCat ? "active" : ""
              }`}
              onClick={() => handleTabClick(mainCat)}
            >
              {mainCat}
            </button>
          ))}
        </div>

        {/* 필터 섹션 */}
        <div className="filter-container">
          <button
            className="filter-active-btn sub-font small"
            onClick={toggleFilter}
          >
            <i
              className={`fa-solid ${
                filterOpen ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
            가게 골라보기
          </button>
          <div className={`filter-box ${filterOpen ? "active" : ""}`}>
            {Object.entries(groupedCategories).map(([mainCat, subCats]) => {
              const isVisible = activeTab === "전체" || activeTab === mainCat;
              console.log(`${mainCat} 필터 그룹:`, isVisible ? "보임" : "숨김");

              return (
                <div
                  key={mainCat}
                  className={`filter-group ${
                    isVisible ? "active" : "inactive"
                  }`}
                >
                  {subCats.map((subCat) => (
                    <label key={subCat.id} className="filter-item">
                      <input
                        type="checkbox"
                        value={subCat.sortId}
                        checked={selectedFilters.includes(subCat.sortId)}
                        onChange={() => handleFilterChange(subCat.sortId)}
                      />
                      <span className="sub-font">{subCat.subCategory}</span>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 상점 목록 */}
        <div className="store-list-container">
          {filteredStores.map((store) => (
            <ul
              key={store.id}
              className="store-box"
              onClick={() => handleStoreClick(store.id)}
              style={{ cursor: "pointer" }} // 클릭 가능 표시
            >
              <li className="img-box">
                <img
                  src={
                    store.mainImage
                      ? `/images/stores/${store.mainImage}`
                      : "/images/placeholder.jpg"
                  }
                  alt={store.storeName}
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </li>
              <li className="store-info-box">
                <div className="category-box sub-font small">
                  <span className="category-main">
                    {getCategoryInfo(store.categoryId).main}
                  </span>
                  <i className="fa-solid fa-chevron-right"></i>
                  <span className="category-sub">
                    {getCategoryInfo(store.categoryId).sub}
                  </span>
                </div>
                <p className="store-title title-text">
                  {store.storeName || "가게명"}
                </p>
                <div className="info-text-box">
                  <p>
                    위치: {store.storeSection} 구역 {store.storeNum}
                  </p>
                  <p>
                    영업시간: {store.openHours} ({store.closedDays})
                  </p>
                  {store.purchaseAmount && store.purchaseAmount > 0 ? (
                    <p>
                      {store.purchaseAmount.toLocaleString()}원 이상 구매시,
                      주차권 제공
                    </p>
                  ) : (
                    <p>별도 주차권 제공 없음</p>
                  )}
                </div>
              </li>
            </ul>
          ))}
          {filteredStores.length === 0 && (
            <p className="no-results">해당 조건의 가게가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default StoreList;
