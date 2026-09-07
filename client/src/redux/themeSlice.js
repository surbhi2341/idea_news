import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const isDark = localStorage.getItem('bh_dark') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const fontSize = parseInt(localStorage.getItem('bh_font') || '16');
    const language = localStorage.getItem('bh_lang') || 'English';
    return { darkMode: isDark, fontSize, language };
  } catch {
    return { darkMode: false, fontSize: 16, language: 'English' };
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('bh_dark', state.darkMode);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    increaseFontSize: (state) => {
      if (state.fontSize < 24) {
        state.fontSize += 2;
        localStorage.setItem('bh_font', state.fontSize);
      }
    },
    decreaseFontSize: (state) => {
      if (state.fontSize > 12) {
        state.fontSize -= 2;
        localStorage.setItem('bh_font', state.fontSize);
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('bh_lang', state.language);
    },
  },
});

export const { toggleTheme, increaseFontSize, decreaseFontSize, setLanguage } = themeSlice.actions;
export default themeSlice.reducer;
