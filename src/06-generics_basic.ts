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
