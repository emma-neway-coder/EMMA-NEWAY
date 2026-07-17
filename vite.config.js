import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // gzip 실제 전송량은 ~190kB 수준이라, 경고 임계값만 현실적으로 올림(성능과 무관한 표시상 조정)
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // 라이브러리를 앱 코드와 분리 → App.jsx만 고쳐 재배포해도 Firebase/React 덩어리는 캐시 재사용
        manualChunks(id) {
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) return "firebase";
          if (id.includes("node_modules/scheduler")) return "react-vendor";
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react")) return "react-vendor";
        },
      },
    },
  },
});
