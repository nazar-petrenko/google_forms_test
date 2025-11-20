import { useGetFormsQuery } from '../app/api/enhancedApi'; 

export function useHomePageLogic() {
  const { data, error, isLoading } = useGetFormsQuery();

  return {
    forms: data?.forms,
    error,
    isLoading,
  };
}