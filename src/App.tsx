import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InsightsPage from "./pages/dashboard/DashboardInsights";
import SplitPage from "./pages/SplitPage"; // ← toevoegen
import TransactionsPage from "./pages/TransactionsPage";
import Layout from "./layout/Layout";
import ReceiptListPage from "./pages/ReceiptListPage";
import ReceiptSettingsPage from "./pages/ReceiptSettingPage";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard/insights" element={<InsightsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/receipts" element={<ReceiptListPage />} />
        <Route path="/settings/receipts" element={<ReceiptSettingsPage />} />

        {/* Nieuwe route voor split-transacties */}
        <Route path="/split/:id" element={<SplitPage />} />
      </Route>
    </Routes>
  );
}
