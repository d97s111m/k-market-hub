import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStoreList, getCategories, getParkingInfo } from "../../utils/api";
import Loading from "../../components/common/Loading";
import "./StoreDetail.css";

function StoreDetail() {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [parkingInfo, setParkingInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 병렬로 데이터 가져오기
        const [storeList, categoryList, parkingInfo] = await Promise.all([
          getStoreList(),
          getCategories(),
          getParkingInfo(),
        ]);

        console.log("parkingList 로드 결과:", parkingInfo);

        // ID로 특정 상점 찾기
        const store = storeList.find((store) => store.id === Number(id));

        if (!store) {
          setError("상점을 찾을 수 없습니다.");
          return;
        }

        setStoreData(store);
        setCategories(categoryList);
        setParkingInfo(parkingInfo);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // 카테고리 정보 찾기
  const getCategoryInfo = () => {
    if (!categories.length || !storeData) return { main: "", sub: "" };

    const category = categories.find(
      (cat) => cat.sortId === storeData.categoryId
    );
    return {
      main: category?.mainCategory || "",
      sub: category?.subCategory || "",
    };
  };

  // SNS 링크 매핑
  const getSNSInfo = (url) => {
    if (url.includes("instagram"))
      return {
        type: "instagram",
        icon: "https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000",
        alt: "인스타그램",
      };
    if (url.includes("facebook"))
      return {
        type: "facebook",
        icon: "https://img.icons8.com/?size=100&id=118497&format=png&color=000000",
        alt: "페이스북",
      };
    if (url.includes("blog.naver"))
      return {
        type: "naver",
        icon: "/images/logo_naver_blog.png",
        alt: "네이버 블로그",
      };
    if (url.includes("youtube"))
      return {
        type: "youtube",
        icon: "https://img.icons8.com/?size=100&id=19318&format=png&color=000000",
        alt: "유튜브",
      };
    return {
      type: "website",
      icon: "https://img.icons8.com/?size=100&id=XhpXiy5sUg7l&format=png&color=000000",
      alt: "웹사이트",
    };
  };

  // StoreDetail.jsx
  const getParkingDetails = () => {
    console.log("매칭 시점의 parkingInfo:", parkingInfo);
    console.log("매칭 시점의 parkingInfo.length:", parkingInfo.length);

    if (!parkingInfo.length) {
      console.log("parkingInfo가 아직 로드되지 않음");
      return null;
    }

    const result = parkingInfo.find(
      (parking) => parking.parkingId === storeData.parkingId
    );
    console.log("매칭 결과:", result);
    return result;
  };

  if (loading) return <Loading message="상점 정보 불러오는 중..." />;
  if (error) return <div>{error}</div>;
  if (!storeData) return <div>상점 정보를 찾을 수 없습니다.</div>;

  const categoryInfo = getCategoryInfo();
  const parkingDetails = getParkingDetails();

  return (
    <section className="store-detail-section">
      <div className="wrap mob">
        <div className="upper-info-container">
          <div className="img-box">
            <img
              src={
                storeData.mainImage
                  ? `/images/stores/${storeData.mainImage}`
                  : "/images/placeholder.jpg"
              }
              alt={storeData.storeName}
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg";
              }}
            />
          </div>
          <div className="store-info-container">
            <div className="category-box sub-font small">
              <span className="category-main">{categoryInfo.main}</span>
              <i className="fa-solid fa-chevron-right"></i>
              <span className="category-sub">{categoryInfo.sub}</span>
            </div>
            <p className="title-text">{storeData.storeName}</p>
            <div className="info-text-box">
              <p>
                위치: {storeData.storeLocation}시장 {storeData.storeSection}{" "}
                구역 {storeData.storeNum}
              </p>
              <p>
                운영 시간: {storeData.openHours} ({storeData.closedDays})
              </p>
              <p>연락처: {storeData.phone}</p>
              <p>
                결제수단:{" "}
                {storeData.paymentMethodList?.join(", ") || "정보 없음"}
              </p>
              {/* 주차권 정보 */}
              {parkingDetails ? (
                <p>
                  제공가능 주차권: {parkingDetails.parkingName} 주차권 (
                  {storeData.purchaseAmount.toLocaleString()}원 이상 구매시{" "}
                  {storeData.discountTime}분)
                </p>
              ) : (
                <p>제공가능 주차권: 별도 없음</p>
              )}
            </div>
            <ul className="sns-link-box">
              {(storeData.snsLinkList || []) // 빈 배열로 기본값 설정
                .filter((link) => link && link.trim()) // link 존재 여부도 체크
                .map((snsUrl, index) => {
                  const snsInfo = getSNSInfo(snsUrl);
                  return (
                    <li key={index} className="sns-box">
                      <a
                        href={
                          snsUrl.startsWith("http")
                            ? snsUrl
                            : `https://${snsUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={snsInfo.icon} alt={snsInfo.alt} />
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="description-box">
          <p>{storeData.description}</p>
        </div>
        <ul className="sub-image-container">
          {[
            storeData.subImage1,
            storeData.subImage2,
            storeData.subImage3,
            storeData.subImage4,
          ]
            .filter((image) => image && image.trim() !== "")
            .map((image, index) => (
              <li key={index} className="img-box">
                <img
                  src={`/images/stores/${image}`} // 여기 경로 수정
                  alt={`${storeData.storeName} 추가 이미지 ${index + 1}`}
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export default StoreDetail;
