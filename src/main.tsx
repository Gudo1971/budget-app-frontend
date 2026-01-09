import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockUser = {
  id: "clxyz1234567890",
  name: "Gudo",
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <UserContext.Provider value={mockUser}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </UserContext.Provider>
    </ChakraProvider>
  </React.StrictMode>
);
