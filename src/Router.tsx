import { Route, Routes, useLocation } from "react-router-dom";
import App from '@/App';
import DatasetList from "./components/DatasetList";

export default function Router() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div>
      <Routes location={background || location}>
        <Route path="/" element={<App />}>
          <Route path="dataset-list" element={<DatasetList />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="dataset-list" element={<DatasetList />} />
        </Routes>
      )}
    </div>
  );
}