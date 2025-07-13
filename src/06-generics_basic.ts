// 다른 언어에서 제공하는 Generic, Template 등과 유사한 표현으로 사용할 수 있습니다.

type WrappedData<T> = {
  name: string;
  data: T;
};

declare function extractData<T>(data: WrappedData<T>): T;

// 일단은 이렇게 타입을 지정해 줄 수 있습니다.
extractData<number>({ name: "foo", data: 123 });

// 다만 제너릭 역시 추론이 가능하기 때문에, 많은 경우에는 명시적으로 사용하지 않는 편입니다.
// 특히 제너릭을 일종의 타입의 계산식으로 사용하기 위한 경우, 외부에서 잘못된 타입을 집어넣을 경우 오히려 오류가 생길 수도 있습니다.
const val = extractData({ name: "foo", data: 123 });

// 이렇게 extends로 원하는 타입의 종류를 제한할 수도 있습니다.
type StringOrNumber<T extends string | number> =
  // 그리고 타입 정의에서의 extends를 통해서 conditional type을 만들 수도 있습니다.
  T extends string ? "string" : "number";

// 이 타입은 "number"가 됩니다.
type MyValueIsNumber = StringOrNumber<number>;

// extends를 사용할 경우에는 infer라고 하는 아주 강력한 기능을 활용하면 좋습니다.
// 여기 타입을 준비해뒀습니다.
type Someone<Name> = { name: Name };
type White = Someone<"Heisenberg">;

// 만일 T가 Someone<???>를 extends할 때, 그중에서 대체 어떻게 생겨먹은 Someone인지 궁금할 수 있습니다.
// 이럴 때 infer를 사용해서 T의 상황을 구체화할 수 있게 됩니다.
type SayMyName<T> = T extends Someone<infer Name> ? Name : never;

// 이 infer는 꼭 Generic과 동반될 필요가 있는 것은 아니고, 다양한 표현에 사용할 수 있습니다.
type CutArray<Arr> = Arr extends [infer First, ...infer Rest]
  ? [First, Rest]
  : never;

// 짐작하셨겠지만, Cut은 [1, [2, 3]]입니다.
type Cut = CutArray<[1, 2, 3]>;
