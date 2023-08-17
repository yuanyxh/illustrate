/**
 * @description 创建事件触发元素一致事件
 */
export function createConsistentClick(
  cb: React.MouseEventHandler<HTMLElement>
) {
  let isCurrentMouseDown = false;
  let isCurrentMouseUp = false;

  const onMouseDown: React.MouseEventHandler<HTMLElement> = (e) => {
    if (e.target === e.currentTarget) {
      isCurrentMouseDown = true;
    }
  };

  const onMouseUp: React.MouseEventHandler<HTMLElement> = (e) => {
    if (e.target === e.currentTarget) {
      isCurrentMouseUp = true;
    }
  };

  const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
    if (isCurrentMouseDown && isCurrentMouseUp) {
      cb(e);
    }

    isCurrentMouseDown = isCurrentMouseUp = false;
  };

  return { onMouseDown, onMouseUp, onClick };
}
