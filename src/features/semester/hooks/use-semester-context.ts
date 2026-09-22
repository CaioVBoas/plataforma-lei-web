import { useQuery } from '@tanstack/react-query';
import { getSemesterContext } from '../api/semester-api';

export const useSemesterContext = () =>
  useQuery({ queryKey: ['semester-context'], queryFn: getSemesterContext, staleTime: Infinity });
