import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, HStack, Tooltip } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";

import { PageLayout } from "@/components/layout/PageLayout";
import { TransactionsList } from "../TransactionsList";
import { PeriodSelector } from "@/components/PeriodSelector/PeriodSelector";

import { FunnelSettingsIcon } from "@/components/funnel-settings/FunnelSettingsIcon";

import { useDateFilter } from "@/context/DateFilterContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/features/categories/hooks/useCategories";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showFilters, setShowFilters] = useState(false);
  const [freezeList, setFreezeList] = useState(false);

  const neonBlue = "#00C8FF";

  // ⭐ DateFilterContext
  const { range, setRange } = useDateFilter();

  // ⭐ Sync URL → DateFilterContext
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const from = params.get("from");
    const to = params.get("to");

    if (from && to) {
      setRange({
        from: new Date(from),
        to: new Date(to),
      });
    }
  }, [location.search, setRange]);

  // Als range nog niet gezet is: voorkom crashes
  if (!range?.from || !range?.to) {
    return (
      <PageLayout title="Transacties">
        {showFilters && <PeriodSelector />}
      </PageLayout>
    );
  }

  // ⭐ Convert range → YYYY-MM-DD
  const from = range.from.toISOString().slice(0, 10);
  const to = range.to.toISOString().slice(0, 10);

  // ⭐ RefreshKey = "2026-04"
  const refreshKey = from.slice(0, 7);

  // ⭐ Fetch transactions for the selected month
  const { data: transactions = [] } = useTransactions(refreshKey, from, to);

  // ⭐ Fetch categories
  const { categories, refetch: refetchCategories } = useCategories();

  // ⭐ URL filters
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const type = params.get("type"); // income / expenses

  // ⭐ Filter op date + category + type
  const filtered = transactions.filter((t) => {
    const dateField = t.date || t.transaction_date;
    if (!dateField) return false;

    const d = new Date(dateField);
    const inRange = d >= range.from && d <= range.to;

    // TYPE FILTER
    let inType = true;
    if (type === "income") inType = t.amount > 0;
    if (type === "expenses") inType = t.amount < 0;

    // CATEGORY FILTER — skip when modal open
    let inCategory = true;

    if (!freezeList) {
      if (category === "null") {
        inCategory =
          t.category_id === null ||
          t.category_id === 0 ||
          t.category_id === undefined;
      } else if (category) {
        inCategory = t.category_id === Number(category);
      }
    }

    return inRange && inCategory && inType;
  });

  return (
    <PageLayout
      title="Transacties"
      rightSection={
        <HStack spacing={0}>
          <Tooltip label="Instellingen" placement="top" hasArrow>
            <IconButton
              aria-label="Instellingen"
              icon={<FiSettings />}
              variant="ghost"
              size="sm"
              onClick={() => navigate("/transactions/settings")}
              _hover={{ color: neonBlue }}
            />
          </Tooltip>

          <Tooltip label="Filters" placement="top">
            <IconButton
              aria-label="Filter"
              icon={<FunnelSettingsIcon />}
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
            />
          </Tooltip>
        </HStack>
      }
    >
      {showFilters && <PeriodSelector />}

      <TransactionsList
        items={filtered}
        categories={categories ?? []}
        refetchCategories={refetchCategories}
      />
    </PageLayout>
  );
}
