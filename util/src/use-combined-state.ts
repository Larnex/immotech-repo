import React, { useState } from 'react';

type StateSetter<T> = (changes: Partial<T>) => void;

export function useCombinedState<T extends object>(initialState: T): [T, StateSetter<T>] {
  const [state, set] = useState<T>(initialState);

  const setState = (changes: Partial<T>) => {
    set(prevState => ({ ...prevState, ...changes }));
  };

  return [state, setState];
}
