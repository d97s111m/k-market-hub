import "./Loading.css";

function Loading({ message = "데이터 로딩 중..." }) {
  return (
    <div className="loading-container">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default Loading;
