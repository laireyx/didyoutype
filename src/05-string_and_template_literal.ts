// 여기 버튼이 하나 있습니다.
// 주어진 variant에 따라서 버튼을 화면에 그릴 것입니다.

type Variants = "rounded" | "outlined";

declare function createButton(variant: Variants): void;

// 잘 작동합니다. 자동 완성도 깔끔하네요.
createButton("rounded");
createButton("outlined");
// @ts-expect-error
createButton("newtype");

// 좋습니다. 그런데, 이런 식으로 다양한 variant가 추가될 수 있는 경우에는 어떨까요?
// 일단 뒤에 string을 추가해 줍시다. 타입적으로는 일단 문제가 발생하지 않습니다(string이 다른 타입을 '잡아먹는다'는 린트 경고가 발생하기는 합니다).
type Variants2 =
  | "rounded-100"
  | "rounded-200"
  | "rounded-300"
  | "outlined"
  | string;

declare function createButton2(variant: Variants2): void;

// 그런데, createButton을 입력하고 괄호를 열면, 자동 완성이 제대로 작동하지 않습니다!
// 사실, 위에서 언급했듯이 이런 경우에는 타입스크립트가 Variants2가 실제로는 string과 동일하다는 것을 눈치채고, 린터 역시 이것을 경고해줍니다.
// 따라서 createButton2는 임의의 스트링을 받을 수 있는 함수이고, 자동 완성이 작동하지 않는 것은 어떻게 보면 당연한 일이죠.
createButton2("rounded");
createButton2("outlined");
createButton2("newtype");

// 그래서 이런 트릭을 사용해 볼 수 있습니다.
// string & {}는 string 그 자체가 아니기 때문에, 이런 경우에는 다섯 개의 값이 공존할 수 있습니다.
type Variants3 =
  | "rounded-100"
  | "rounded-200"
  | "rounded-300"
  | "outlined"
  | (string & {});

declare function createButton3(variant: Variants3): void;

// 이제 자동 완성이 제대로 작동합니다.
createButton3("rounded");
createButton3("outlined");
createButton3("newtype");

// 만일 ban-types rule을 사용하고 있다면, 이렇게 사용할 수도 있습니다.
type Variants4 = "rounded" | "outlined" | (string & Record<never, never>);

// Template literal에 대해 알아봅시다
// 위 Variant 타입에 이어서, `rounded-`로 시작하는 임의의 스트링을 나타내기 위해서는 이런 방법 역시 가능합니다.
type Variants5 = `rounded-${string}`;

declare function createButton5(t: Variants5): void;

createButton5("rounded-300");
// @ts-expect-error
createButton5("notrounded");

// 주의사항: 이것 역시 유효한 Variant가 되긴 합니다.
createButton5("rounded-");

// template literal을 prefix에만 사용할 수 있는 것은 아닙니다.
// 게다가, "단일 string"일 필요조차 없습니다. 문자열로 표현될 수 있는 타입이라면, 어떤 것이든 가능합니다!
type Variants6 = `${"rounded" | "outlined"}-${number}`;

declare function createButton6(t: Variants6): void;

createButton6("rounded-300");
createButton6("outlined-150");

// 이런 오류를 컴파일 타임에 잡아낼 수 있는 강력한 문법입니다.
// @ts-expect-error
createButton6("outlined-nonnumber");
// @ts-expect-error
createButton6("invalid-250");

// 주의사항으로는, 단일 템플릿 리터럴만 사용할 경우에는 자동 완성이 안된다는 점입니다.
// 이를 예방하기 위해 'prefix' | `prefix${string}`과 같이 쓰는 경우, 타입스크립트가 이것 역시 인식하고 하나로 합쳐버리게 됩니다.

// 다행히도, 이를 위해서 위에서 사용한 union trick을 사용할 수 있습니다.

// 만일 `rounded-${string}`만 사용하거나, `rounded-` | `rounded-${string}`과 같이 썼다면 자동완성이 되지 않았을 것입니다.
// 하지만 & {}을 통해 타입이 합쳐지지 않도록 방해하여 자동완성을 받을 수 있습니다.
type Variant7 = `rounded-` | (`rounded-${string}` & {});
declare function createButton7(t: Variant7): void;

createButton7("rounded-250");
// @ts-expect-error
createButton7("baz");
