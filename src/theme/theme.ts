import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import create from 'zustand';

type Mode = 'light' | 'dark' | 'system';

type ThemeState = {
  mode: Mode;
  setMode: (m: Mode) => void;
  cycleMode: () => void;
};

export const useAppTheme = create<ThemeState>((set, get) => ({
  mode: (localStorage.getItem('st.theme') as Mode) || 'system',
  setMode: (m) => {
    localStorage.setItem('st.theme', m);
    set({ mode: m });
  },
  cycleMode: () => {
    const order: Mode[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(get().mode) + 1) % order.length];
    localStorage.setItem('st.theme', next);
    set({ mode: next });
  }
}));

export const applyBodyClass = (mode: Mode) => {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effective = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(effective);
};

const baseComponents = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 }
      }
    }
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600 }
  }
};

const light = createTheme(deepmerge({
  palette: {
    mode: 'light',
    primary: { main: '#6C63FF' },
    secondary: { main: '#00E1FF' },
    background: { default: '#F8F7FB', paper: '#FFFFFF' }
  }
}, baseComponents));

const dark = createTheme(deepmerge({
  palette: {
    mode: 'dark',
    primary: { main: '#8E87FF' },
    secondary: { main: '#00E1FF' },
    background: { default: '#0F0F13', paper: '#15151C' }
  }
}, baseComponents));

export const themeLight = responsiveFontSizes(light);
export const themeDark = responsiveFontSizes(dark);
