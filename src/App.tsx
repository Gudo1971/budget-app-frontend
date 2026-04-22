import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InsightsPage from "./pages/dashboard/DashboardInsights";
import SplitPage from "./features/receipts/extract/pages/SplitPage";
import TransactionsPage from "./features/transactions/components/create/list/pages/TransactionsPage";
import Layout from "./lib/layout/Layout";
import { ReceiptListPage } from "./features/receipts/extract/pages/ReceiptListPage";
import ReceiptSettingsPage from "./features/receipts/extract/pages/ReceiptSettingPage";
import TransactionSettingsPage from "./features/transactions/components/create/list/pages/TransactionSettingsPage";
import { ReceiptArchivePage } from "./features/receipts/extract/pages/ReceiptArchivePage";
import MerchantMemoryDebug from "./pages/debug/MerchantMemoryDebug";
import FilterPage from "./pages/filters/FilterPage";
import { UploadReceiptEntry } from "./features/settings-enigine/panels/UploadReceiptEntry";
import { BudgetPage } from "./features/budget/BudgetPage";
import BudgetSettingsPage from "./features/budget/pages/BudgetSettingsPage";
import { DashboardPeriodProvider } from "./context/DashboardPeriodContext";

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <DashboardPeriodProvider>
            <Layout />
          </DashboardPeriodProvider>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard/insights" element={<InsightsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route
          path="/transactions/settings"
          element={<TransactionSettingsPage />}
        />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/budget/settings" element={<BudgetSettingsPage />} />
        <Route path="/receipts" element={<ReceiptListPage />} />
        <Route path="/upload-receipt" element={<UploadReceiptEntry />} />
        <Route path="/receipts/archive" element={<ReceiptArchivePage />} />
        <Route path="/receipts/settings" element={<ReceiptSettingsPage />} />
        <Route path="/split/:id" element={<SplitPage />} />
        <Route
          path="/debug/merchant-memory"
          element={<MerchantMemoryDebug />}
        />
        <Route path="/filters" element={<FilterPage />} />
      </Route>
    </Routes>
  );
}
