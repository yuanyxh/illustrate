/**
 *
 * @param fn 需要执行的回调, 返回 false 继续轮询, 返回 true 结束轮询
 * @param options 设置最大轮询数与轮询间隔
 * @param args 需要传递给回调的额外参数
 * @returns 返回一个包含取消轮询、订阅消息方法的对象
 */
export const polling: Polling = (fn, options, ...args) => {
  const { delay = 10, maxRetryCount = 20 } = options || {};

  let surplus = maxRetryCount;

  const bus = new Map<string, Fn[]>();

  const _fn = () => {
    const result = fn(...args);

    if (result) return window.clearTimeout(timer);
    else surplus--;

    if (surplus === 0) {
      return bus.forEach((events) => events.forEach((fn) => fn()));
    }

    timer = window.setTimeout(_fn, delay);
  };

  const subscribe: PollingResult['subscribe'] = (type, fn) => {
    const events = bus.get(type);

    if (events) {
      events.push(fn);
      bus.set(type, events);
    } else {
      bus.set(type, [fn]);
    }
  };

  const cacelPolling: PollingResult['cacelPolling'] = () =>
    window.clearTimeout(timer);

  let timer = window.setTimeout(_fn, delay);

  return { subscribe, cacelPolling };
};
