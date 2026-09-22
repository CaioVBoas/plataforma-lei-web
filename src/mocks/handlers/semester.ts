import type { SemesterContext } from '@/features/semester/types';
import { SEMESTER_CONTEXT } from '../seed/semester';

export const getSemesterContext = (): SemesterContext => SEMESTER_CONTEXT;
