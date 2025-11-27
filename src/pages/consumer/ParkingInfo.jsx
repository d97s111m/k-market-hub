import React, { useState, useEffect } from "react";
import { getParkingInfo } from "../../utils/api";
import Loading from "../../components/common/Loading";
import "./ParkingInfo.css";

function Parkinginfo() {
  const [parkingList, setParkingList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeTab, setActiveTab] = useState("전체");
  const [loading, setLoading] = useState(true);

  // 주소 복사
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("주소가 복사되었습니다!");
    });
  };

  // 데이터 불러오기
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const data = await getParkingInfo();
        setParkingList(data);
        setFilteredList(data);
      } catch (error) {
        console.error("주차장 데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParkingData();
  }, []);

  // 탭 핸들러
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "전체") {
      setFilteredList(parkingList);
    } else {
      const filtered = parkingList.filter(
        (parking) => parking.parkingType === tabName
      );
      setFilteredList(filtered);
    }
  };

  if (loading) return <Loading message="주차장 정보 불러오는 중..." />;

  return (
    <section className="parking-info-section">
      <div className="wrap mob">
        <div className="parking-container">
          <div className="tab-container sub-font">
            <span
              className={activeTab === "전체" ? "active" : ""}
              onClick={() => handleTabClick("전체")}
            >
              전체
            </span>
            <span
              className={activeTab === "공영" ? "active" : ""}
              onClick={() => handleTabClick("공영")} // 이거 추가!
            >
              공영
            </span>
            <span
              className={activeTab === "민영" ? "active" : ""}
              onClick={() => handleTabClick("민영")} // 이거 추가!
            >
              민영
            </span>
          </div>
          <div className="parking-card-container">
            {filteredList.map((parking) => (
              <div className="parking-card">
                <div className="parking-title-box">
                  <span
                    className={`parking-type sub-font ${parking.parkingType}`}
                  >
                    {parking.parkingType}
                  </span>
                  <span className="parking-name sub-font">
                    {parking.parkingName}
                  </span>
                </div>
                <div className="parking-info-box">
                  <p className="operation-hours">
                    운영 시간: {parking.operationHours}
                  </p>
                  <div className="flex-box">
                    <div
                      className="address-box"
                      onClick={() => copyToClipboard(parking.address)}
                    >
                      <span className="address">{parking.address}</span>
                      <i className="fa-regular fa-copy"></i>
                    </div>
                    <p className="location">({parking.location})</p>
                  </div>
                  <p className="capacity">총 {parking.capacity} 주차 가능</p>
                  <div className="flex-box">
                    <p className="rate-info">{parking.rateInfo}</p>
                    <p className="daily-max-rate">
                      (최대 {parking.dailyMaxRate?.toLocaleString()} 원)
                    </p>
                  </div>
                  {parking.ticketKind && (
                    <p className="ticket">{parking.ticketKind} 할인권</p>
                  )}
                  <div className="tag-box">
                    {parking.featuresList?.map((feature, index) => (
                      <span className="sub-font" key={index}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Parkinginfo;
