import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("반틈 실행 중 에러:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "12px", padding: "24px", textAlign: "center",
          fontFamily: "sans-serif", background: "#EFE9DC", color: "#3d3a33",
        }}>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>화면을 불러오지 못했어요</p>
          <p style={{ fontSize: "13px", color: "#8a857a", maxWidth: "320px" }}>
            잠시 후 새로고침해주세요. 계속되면 Firebase 환경변수 설정을 확인해주세요.
          </p>
          <pre style={{
            fontSize: "11px", color: "#a33", background: "#fff", padding: "10px",
            borderRadius: "8px", maxWidth: "320px", overflow: "auto", textAlign: "left",
          }}>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
