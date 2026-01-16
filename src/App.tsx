import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InsightsPage from "./pages/dashboard/DashboardInsights";
import SplitPage from "./features/receipts/extract/pages/SplitPage";
import TransactionsPage from "./features/transactions/components/create/list/pages/TransactionsPage";
import Layout from "./layout/Layout";
import { ReceiptListPage } from "./features/receipts/extract/pages/ReceiptListPage";
import ReceiptSettingsPage from "./features/receipts/extract/pages/ReceiptSettingPage";
import TransactionSettingsPage from "./features/transactions/components/create/list/pages/TransactionSettingsPage";
import { ReceiptArchivePage } from "./features/receipts/extract/pages/ReceiptArchivePage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard/insights" element={<InsightsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route
          path="/transactions/settings"
          element={<TransactionSettingsPage />}
        />

        {/* Receipt list */}
        <Route path="/receipts" element={<ReceiptListPage />} />

        {/* Receipt archive */}
        <Route path="/receipts/archive" element={<ReceiptArchivePage />} />

        {/* Receipt settings (correct path!) */}
        <Route path="/receipts/settings" element={<ReceiptSettingsPage />} />

        {/* Split transactions */}
        <Route path="/split/:id" element={<SplitPage />} />
      </Route>
    </Routes>
  );
}
