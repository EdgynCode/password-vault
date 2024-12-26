import React from "react";
import { LanguageProvider } from "./LanguageContext";
import { PasswordProvider } from "./PasswordContext";
import { UsernameProvider } from "./UsernameContext";
import { NoteProvider } from "./NoteContext";
import { ThemeProvider } from "./ThemeContext";

export const ContextProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PasswordProvider>
          <UsernameProvider>
            <NoteProvider>{children}</NoteProvider>
          </UsernameProvider>
        </PasswordProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
