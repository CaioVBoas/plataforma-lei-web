import { useReducer } from 'react';
import { PRACTICE_GROUPS } from '../constants/onboarding-options';
import type { OnboardingAnswers, ThemeStance } from '../types';

interface OnboardingState extends OnboardingAnswers {
  customOptions: Record<string, string[]>;
}

type Action =
  | { type: 'toggle-practice'; groupId: string; option: string }
  | { type: 'add-practice'; groupId: string; option: string }
  | { type: 'toggle-theme'; theme: string; stance: ThemeStance }
  | { type: 'set-source'; source: OnboardingAnswers['historySource'] }
  | { type: 'toggle-history'; item: string }
  | { type: 'set-summary'; summary: string };

const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

const initialState: OnboardingState = {
  practices: Object.fromEntries(PRACTICE_GROUPS.map((group) => [group.id, [...group.suggested]])),
  customOptions: {},
  themes: {},
  historySource: 'mark',
  history: [],
  pastSummary: '',
};

const reducer = (state: OnboardingState, action: Action): OnboardingState => {
  switch (action.type) {
    case 'toggle-practice':
      return { ...state, practices: { ...state.practices, [action.groupId]: toggle(state.practices[action.groupId] ?? [], action.option) } };
    case 'add-practice':
      // A opção escrita pelo docente já entra marcada.
      return {
        ...state,
        customOptions: { ...state.customOptions, [action.groupId]: [...(state.customOptions[action.groupId] ?? []), action.option] },
        practices: { ...state.practices, [action.groupId]: [...(state.practices[action.groupId] ?? []), action.option] },
      };
    case 'toggle-theme': {
      // Tocar de novo na mesma lista desmarca; tocar na outra lista move o tema.
      const themes = { ...state.themes };
      if (themes[action.theme] === action.stance) delete themes[action.theme];
      else themes[action.theme] = action.stance;
      return { ...state, themes };
    }
    case 'set-source':
      return { ...state, historySource: action.source };
    case 'toggle-history':
      return { ...state, history: toggle(state.history, action.item) };
    case 'set-summary':
      return { ...state, pastSummary: action.summary };
  }
};

export const useOnboardingForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { customOptions, ...answers } = state;
  return { answers, customOptions, dispatch };
};
