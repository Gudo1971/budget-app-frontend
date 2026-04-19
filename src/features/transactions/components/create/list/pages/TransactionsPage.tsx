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

import type { Transaction } from "@shared/types/Transaction";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showFilters, setShowFilters] = useState(false);
  const neonBlue = "#00C8FF";

  // ⭐ Freeze list while modal is open
  const [freezeList, setFreezeList] = useState(false);

  // ⭐ DateFilterContext
  const { range, setRange } = useDateFilter();

  // ⭐ URL → DateFilterContext sync
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

  // ⭐ Fetch ALL transactions once
  const { data: transactions } = useTransactions();

  // ⭐ Fetch categories
  const { categories, refetch: refetchCategories } = useCategories();

  // ⭐ URL filters
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const type = params.get("type"); // income / expenses

  // ⭐ Filter op date + category + type
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    const inRange = d >= range.from && d <= range.to;

    // ⭐ TYPE FILTER
    let inType = true;
    if (type === "income") {
      inType = t.amount > 0;
    } else if (type === "expenses") {
      inType = t.amount < 0;
    }

    // ⭐ CATEGORY FILTER — FIX: overslaan als modal open is
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

  // ⭐ Handlers for modal open/close
  const handleModalOpen = () => {
    setFreezeList(true);
  };

  const handleModalClose = () => {
    setFreezeList(false);
  };

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
