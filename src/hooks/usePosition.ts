import { useState, useEffect } from 'react';
import { useThrottle } from '@/hooks';

function getPosition(el: HTMLElement | null) {
  if (!el) return;

  const { top, bottom, left, width } = el.getBoundingClientRect();

  const vw = window.innerWidth,
    vh = window.innerHeight,
    halfvw = vw / 2,
    halfvh = vh / 2;

  let offset: Hooks.Offset;

  switch (true) {
    case left < halfvw && top < halfvh:
      offset = { left: left + width, top };
      break;
    case left > halfvw && top < halfvh:
      offset = { left: left - width, top };
      break;
    case left < halfvw && top > halfvh:
      offset = { left: left + width, bottom: vh - bottom };
      break;
    case left > halfvw && top > halfvh:
      offset = { left: left - width, bottom: vh - bottom };
      break;
    default:
      offset = { left: 0, top: 0 };
      break;
  }

  return offset;
}

export const usePosition: Hooks.UsePosition = (el) => {
  const [offset, setOffset] = useState<Hooks.Offset>({ left: 0, top: 0 });

  const change = useThrottle(() => {
    const position = getPosition(el.current);

    position && setOffset(position);
  });

  useEffect(() => {
    const position = getPosition(el.current);
    position && setOffset(position);

    window.addEventListener('resize', change);
    window.addEventListener('scroll', change);

    return () => {
      window.removeEventListener('resize', change);
      window.removeEventListener('scroll', change);
    };
  }, []);

  return offset;
};
