const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;

// 공통 데이터 파싱 함수
const parseSheetData = (rawData) => {
  if (!rawData || rawData.length < 2) return [];

  const [headers, ...rows] = rawData;

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      let value = row[index] || "";

      // 1. 숫자 변환
      const shouldBeNumber =
        header === "id" ||
        header.endsWith("Id") ||
        header.endsWith("Amount") ||
        header.endsWith("Num") ||
        header.endsWith("Rate") ||
        header.endsWith("Time");

      // 2. 배열 변환
      const shouldBeArray = header.endsWith("List");

      // 3. 날짜 변환
      const shouldBeDate = header.endsWith("Date") || header.endsWith("At");

      // 변환 로직
      if (shouldBeArray && value !== "") {
        value = value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (shouldBeDate && value !== "") {
        const dateValue = new Date(value);
        value = isNaN(dateValue.getTime()) ? value : dateValue;
      } else if (shouldBeNumber && value !== "") {
        const numValue = Number(value);
        value = isNaN(numValue) ? value : numValue;
      }

      obj[header] = value;
    });
    return obj;
  });
};

// 공통 fetch 함수
const fetchSheetData = async (sheetName, range = "A:Z") => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return parseSheetData(result.values);
  } catch (error) {
    console.error(`Failed to fetch ${sheetName}:`, error);
    throw error;
  }
};

// 각 시트별 함수들
export const getStoreList = () => fetchSheetData("storeList");
export const getCategories = () => fetchSheetData("categories");
export const getMarketInfo = () => fetchSheetData("marketInfo");
export const getAdminList = () => fetchSheetData("adminList");
export const getActivityLog = () => fetchSheetData("activityLog");
export const getStoreApproval = () => fetchSheetData("storeApproval");
export const getStoreResetRequest = () => fetchSheetData("storeResetRequest");
export const getNotice = () => fetchSheetData("notice");
export const getParkingInfo = () => fetchSheetData("parkingInfo");

// 전체 데이터 한 번에 가져오기
export const getAllData = async () => {
  const [
    storeList,
    categories,
    marketInfo,
    adminList,
    activityLog,
    storeApproval,
    storeResetRequest,
    notice,
    parkingInfo,
  ] = await Promise.all([
    getStoreList(),
    getCategories(),
    getMarketInfo(),
    getAdminList(),
    getActivityLog(),
    getStoreApproval(),
    getStoreResetRequest(),
    getNotice(),
    getParkingInfo(),
  ]);

  return {
    storeList,
    categories,
    marketInfo,
    adminList,
    activityLog,
    storeApproval,
    storeResetRequest,
    notice,
    parkingInfo,
  };
};
