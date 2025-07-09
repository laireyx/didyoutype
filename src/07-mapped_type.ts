// 맵드 타입은 타입스크립트의 제너릭 타입 중 하나로, 객체의 키와 값을 맵핑하는 타입을 선언할 때 사용합니다.

// 키는 이벤트 타입, 값은 이벤트 데이터입니다.
type EventMap = {
  click: { x: number; y: number };
  close: void;
};

declare function on<T extends keyof EventMap>(
  type: T,
  event: (data: EventMap[T]) => void
): void;

// 비구조화 할당이 가능합니다. 왜냐하면 data가 EventMap['click'] 타입으로 추론되기 때문입니다.
on("click", ({ x, y }) => {
  console.log("Clicked!", x, y);
});

on("close", () => {
  console.log("Closed!");
});

// 이렇게 존재하지 않는 키의 경우 오류가 잘 발생합니다.
// @ts-expect-error
on("never", () => {
  console.log("Unreachable code!");
});
