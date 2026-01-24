import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  HStack,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";

import { PageLayout } from "@/components/layout/PageLayout";
import { TransactionsList } from "../TransactionsList";
import { PeriodSelector } from "@/components/PeriodSelector/PeriodSelector";

import { fetchTransactions } from "@/lib/api/api";
import type { PeriodSelection } from "@shared/types/period";
import { FunnelSettingsIcon } from "@/components/funnel-settings/FunnelSettingsIcon";

export default function TransactionsPage() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const baseColor = useColorModeValue("#2D3748", "#E2E8F0");
  const neonBlue = "#00C8FF";

  const [period, setPeriod] = useState<PeriodSelection>({
    type: "month",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchTransactions(period); // geen generics meer
      setTransactions(data); // data is nu any[], geen unknown
    }

    load();
  }, [period]);

  return (
    <PageLayout
      title="Transacties"
      rightSection={
        <HStack spacing={0}>
          <Tooltip
            label="Opties "
            placement="top"
            hasArrow
            openDelay={150}
            fontSize="xs"
            px={2}
            py={1}
          >
            <IconButton
              aria-label="Instellingen"
              icon={<FiSettings />}
              variant="ghost"
              size="sm"
              minW="28px"
              height="28px"
              p={0}
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
              minW="28px"
              height="28px"
              p={0}
              onClick={() => setShowFilters((v) => !v)}
            />
          </Tooltip>
        </HStack>
      }
    >
      {showFilters && <PeriodSelector onChange={setPeriod} />}

      <TransactionsList items={transactions} />
    </PageLayout>
  );
}
