import { useMutation } from '../../feature/api/src';

export function changeLanguage(language: string) {
  return useMutation(`/api/app/language/${language}`, {
    method: 'PUT',
    onSuccess: () => {
      
    },
  });
}
