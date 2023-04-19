declare namespace Hooks {
  type Offset =
    | {
        left: number;
        top: number;
      }
    | {
        left: number;
        bottom: number;
      };
  type UsePosition = <T extends React.RefObject<HTMLElement | null>>(
    el: T
  ) => Offset;
}
