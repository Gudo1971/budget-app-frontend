import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DateFilterProvider } from "./context/DateFilterContext";

// ⭐ Import NeonThemeProvider
import { NeonThemeProvider } from "@/theme/neon/NeonContext";

const mockUser = {
  id: "clxyz1234567890",
  name: "Gudo",
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      {/* ⭐ Neon provider hier */}
      <NeonThemeProvider>
        <UserContext.Provider value={mockUser}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <DateFilterProvider>
                <App />
              </DateFilterProvider>
            </QueryClientProvider>
          </BrowserRouter>
        </UserContext.Provider>
      </NeonThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
