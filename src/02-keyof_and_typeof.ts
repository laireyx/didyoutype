// keyof은 어떤 타입의 키를 순회할 때 사용하면 좋습니다.

type VisitCounts = {
  index: number;
  board: number;
};

declare const visitLog: VisitCounts;
// 만일 타입이 정해져 있다면 keyof를 사용하여 적절한 키가 들어오도록 제한할 수 있습니다.
declare function visitPage(map: VisitCounts, key: keyof VisitCounts): void;

// keyof를 사용할 때 유의사항이 있습니다.
// 단순히 생각하면 key는 keyof VisitCounts가 되어야 할 것 같습니다.
for (const key in visitLog) {
  // 즉 이렇게 사용할 수 있어 보이지만, 실제로는 key가 string이 되어버립니다.

  // @ts-expect-error
  visitPage(visitLog, key);

  // @ts-expect-error
  console.log(visitLog[key]);

  // keyof는 string뿐 아니라 실제로는 string | number | symbol이 될 수 있습니다.
  // 컴파일 타임에 타입에 대해서 알고 있는 모든 데이터를 동원하기 때문에, 여기에는 누락되는 것이 없습니다.

  // 하지만 for ... in loop 뿐 아니라, 다양한 iteration method는 저마다의 규칙이 존재합니다.
  // enumerable인지, 상속된 것인지의 여부에 따라서 각 method별로 실제로 접근할 수 있는 키가 다르다는게 key가 string이 되는 이유입니다.
  // 참고 : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Enumerability_and_ownership_of_properties
  // 그 외에도, 실질적으로는 자바스크립트 상에서 오브젝트의 키는 반드시 toString()을 거쳐서 string으로만 사용된다는 점도 이유 중 하나입니다.
  // 아무래도 타입 선언상 number 타입이었던 것이 string으로 치환된 키를 표현하기는 어렵겠죠.

  // 하지만 이런 edge case를 신경써야 하는 경우는 많지 않습니다.
  // 보통은 단순 string 키로 만들어진 단순한 object를 다루는 경우가 많으니까요.
  // 그래서 그런 경우에는 복잡하게 신경쓸 것 없이 keyof로 캐스팅을 한 번 해 주면 됩니다.
  // 이런 경우에 keyof가 자주 사용되는 편입니다.
  console.log(visitLog[key as keyof VisitCounts]);
  visitPage(visitLog, key as keyof VisitCounts);
}

// 1. typeof는 상수의 타입을 얻어올 수 있습니다.
const DICTIONARY = {
  apple: "red",
  banana: "yellow",
};

function getDictionary(): typeof DICTIONARY {
  return DICTIONARY;
}

// 2. typeof는 클래스의 정적 타입을 얻어올 수 있습니다.
class Apple {
  static COLOR: string = "red";
}

// 외부에 static type용으로 사용할 타입을 하나 만들고 양쪽에서 사용하는 것이 더 우아하기는 하지만, 이런 식으로 사용해야만 하는 케이스가 있습니다.
// 외부 라이브러리에서 명시적으로 export해주지 않았거나, 혹은 잦은 변경이 있을 것으로 예상될 때 변경사항을 놓치지 않고 양쪽에 적용하는 케이스가 그 예시입니다.
type AppleColor = (typeof Apple)["COLOR"];
