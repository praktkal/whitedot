import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WhiteDot from "./whitedot";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WhiteDot />
  </StrictMode>
);
