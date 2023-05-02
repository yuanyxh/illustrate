import { useState } from 'react';

export const useModel: Hooks.UseModel = (data) => {
  const [value, setValue] = useState(data);

  return {
    value: value,
    change: setValue
  };
};
