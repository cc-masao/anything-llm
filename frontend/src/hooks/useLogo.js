import { useEffect, useState } from "react";
import usePrefersDarkMode from "./usePrefersDarkMode";
import System from "../models/system";
import AnythingLLMDark from "../media/logo/anything-llm-ligh.png";
// import AnythingLLMLight from "../media/logo/anything-llm-light.png";
import AnythingLLMLight from "../media/logo/classcat-kbase-light.png";

export default function useLogo() {
  const [logo, setLogo] = useState("");
  const prefersDarkMode = usePrefersDarkMode();

  useEffect(() => {
    async function fetchInstanceLogo() {
      try {
        const logoURL = await System.fetchLogo(!prefersDarkMode);
        logoURL
          ? setLogo(logoURL)
          : setLogo(prefersDarkMode ? AnythingLLMLight : AnythingLLMDark);
      } catch (err) {
        setLogo(prefersDarkMode ? AnythingLLMLight : AnythingLLMDark);
        console.error("Failed to fetch logo:", err);
      }
    }
    fetchInstanceLogo();
  }, [prefersDarkMode]);

  return { logo };
}
