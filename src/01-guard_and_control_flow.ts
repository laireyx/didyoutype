type SpaghettiType = string | number | null | undefined;

declare const x: SpaghettiType;

// 각종 체크를 통해 런타임에 타입 안정성을 확보하는 코드의 경우, 타입스크립트가 해당 내용을 추론하기 어렵습니다
// 이를 타입스크립트가 인지할 수 있도록 `is` 키워드를 사용합니다.

// 반환형 `t is string`은 `isString`이 전달받은 t가 string 타입일 것을 보장하는 함수임을 의미합니다.
// 실질적인 반환형은 boolean이며, t가 실제로 string 타입일 경우 true, 그렇지 않은 경우 false를 반환하도록 구현하면 됩니다.
declare function isString(t: SpaghettiType): t is string;

// 반환형 `asserts t is string | number` 역시 t의 타입에 대한 보장의 의미입니다.
// 이 함수는 만일 t가 string | number 타입일 경우 아무것도 반환하지 않습니다.
// 하지만 만일 그렇지 않다면, 이 함수는 그 자리에서 control flow를 끝내야 합니다.
// 그 방법은 process.exit()이나 예외의 발생이 될 수 있습니다.
declare function assertsNonNull(t: SpaghettiType): asserts t is string | number;

// 실제 사용 예시는 다음과 같습니다
(function () {
  // asserts type guard는 이런 식으로 사용합니다.
  assertsNonNull(x);

  // is type guard는 이런 식으로 사용합니다.
  if (isString(x)) {
    console.log(x.match(/x is now string./));
    // 타입스크립트는 만일 x가 string 타입일 경우 여기에서 실행이 종료됨을 인지합니다.
    return;
  }

  // 따라서 여기에서의 x는 반드시 number 타입임을 역시 이해할 수 있습니다.
  const fixedPointString = x.toFixed(2);
  return fixedPointString;
});
