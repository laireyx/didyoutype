// 이런 식으로, union type이긴 하지만 어떤 특정한 조건을 통해서 그 중 하나를 특정할 수 있는 경우를 생각해봅시다.

type TypeAndValue =
  | {
      type: "string";
      value: string;
    }
  | {
      type: "number";
      value: number;
    };

declare function test<T extends TypeAndValue>(
  type: T["type"],
  value: T["value"]
): void;

// 오류가 발생해야 하는데, 뜻대로 잘 되지 않습니다.
// 결론부터 보자면, TypeAndValue['type']에서 타입 추론이 일어나지 않는 것이 문제입니다.
// T가 TypeAndValue로 인식되고, TypeAndValue['value']는 string | number 타입이기 떄문에 오류가 생기지 않는 것입니다.
test("string", 123);

// 이것 역시 작동하지 않습니다.
declare function test2<
  T extends TypeAndValue["type"],
  ExactType extends Extract<TypeAndValue, { type: T }>
>(type: ExactType["type"], value: ExactType["value"]): void;

// 타입은 간접적으로 추론되지 않기 때문입니다.
// 추론은 단독으로 존재하는 타입에 대해 적용됩니다.
test2("string", 123);

// 이렇게, 타입 추론이 되는 형태를 만들어 볼 수 있습니다.
declare function test3<
  T extends TypeAndValue["type"],
  ExactType extends Extract<TypeAndValue, { type: T }>
>(type: T, value: ExactType["value"]): void;

// 한 번 타입스크립트의 추론 단계를 생각해봅시다:
// 1. T가 "string"으로 추론됩니다.
// 2. ExactType이 { type: "string", value: string } 으로 추론됩니다.
// 따라서 우리가 원하는 만큼 자세한 타입이 나오게 됩니다.
// @ts-expect-error
test3("string", 123);

// 실제로 우리의 생각이 맞는지 확인해봅시다.
declare function test4<
  T extends TypeAndValue["type"],
  ExactType extends Extract<TypeAndValue, { type: T }>
>(type: NoInfer<T>, value: ExactType["value"]): void;

// NoInfer<T>는 T를 통해서 타입 추론이 발생하지 않도록 하는 역할입니다.
// 마치 test2의 케이스와 같아졌다고 볼 수 있겠습니다.
// 따라서 오류는 발생하지 않습니다.
test4("string", 123);
