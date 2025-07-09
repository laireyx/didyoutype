// 종종 오래된 자바스크립트 라이브러리를 불러와야 할 때가 있습니다.
// 혹은 외부에서 이미 빌드된 상태로 제공하는 파일을 사용해야 하기도 합니다.
// 그럴 때 그냥 자바스크립트 파일을 불러오면 타입을 찾을 수 없기 때문에 문제가 발생합니다.

// @ts-expect-error
import JohnDoe from "./stuffs/10/ancient.js";

// 타입을 모르니 이래서야 타입스크립트의 맛이 살지 않습니다.
console.log(JohnDoe);

// 그렇기 때문에, .d.ts 파일을 두어서, 타입을 붙여주면 자바스크립트 파일 또한 타입스크립트 프로젝트에 통합할 수 있습니다.
// ./stuffs/10/middleage.d.ts 파일을 참고하세요.
import catchMeIfYouCan from "./stuffs/10/middleage.js";

const JaneDoe = catchMeIfYouCan();
console.log(`${JaneDoe.name} is ${JaneDoe.age} years old.`);

// 혹은 .d.ts 파일만 단독으로 작성할 수도 있습니다.
// 이렇게 작성된 .d.ts 파일의 중요한 특징은 별도의 import 없이 자연스럽게 사용할 수 있다는 점입니다.
// Ghost의 선언이 아무 곳에도 없지만 오류가 발생하지 않는 것을 보세요. 이것은 ./stuffs/10/ghost.d.ts 안에서 확인해 보실 수 있습니다.
type IsAnybodyHere = Ghost["boo"];
declare function ohMyGod(): ReturnType<IsAnybodyHere>;

ohMyGod();

// 또 다른 특징은 이렇게 단독으로 존재하는 .d.ts 파일은 ambient context라는 것입니다.
// ambient context라는 것은 간단히 말하자면 해당 파일은 실체를 갖지 않는다는 의미입니다.
// 그래서 생기는 import나 export를 포함한 .d.ts 파일은 기묘한 동작을 하기 시작합니다.

// 만일 .d.ts 파일이 import나 export를 사용하는 순간, xxx.d.ts라는 파일은 .d.ts 파일이 아니라 "xxx.d".ts 라는 "모듈"로 취급됩니다.
// 말인즉슨 .d.ts에 적용되는 특별 취급이 전부 사라져 버린다는 뜻입니다.
// 그런데 .d.ts 파일 내부인데, 외부에서 타입을 import해 와야 한다고요?
// 그 경우에는 import('external-module').SomeType 과 같은 식으로 불러와 줘야 합니다!

// 이번에는 declare global에 대해 알아봅시다. 이것 역시 ambient context입니다.
// ./stuffs/10/phantom.ts 파일을 살펴봅시다. 이 파일은 export가 분명히 존재하고 있으니, 모듈 파일입니다.
// 그런데 어째서 import 없이도 phantom이 생기는걸까요?
console.log(phantom);

// 바로 declare global 안의 내용도 ambient context로 취급하기 때문이고, 그래서 ghost.d.ts와 같은 효과를 얻게 된 것이죠.

// 이번에는 ambient module에 대해서 알아봅시다. 이것은 augmentation을 사용할 때 알아두면 좋습니다:

// 외부 라이브러리 augmentation을 불러오는 경우를 생각해봅시다.
import { onRequest } from "augmentation";

// 이 onRequest에는 자기들이 쓰는 WebRequest라는 타입을 이용한 핸들러를 건네줘야 합니다.
// 그런데 제가 이 req에 이런 식으로 뭔가 augmentation의 선언에는 없는 타입을 건드리고 싶으면 어떻게 해야할까요?
// augmentation이라는 외부 모듈의 제작자가 모든 수요를 예측할 수 있는 것도 아니고,
// 직접 코드를 수정해서 빌드하는 것도 분명 좋은 방법은 아닐겁니다.
onRequest(async (req) => {
  // @ts-expect-error
  req.sessionId = 123;
});

// 그럴때 이렇게 declare module을 이용하면, ambient module이 되어 해당 모듈에 선언을 끼워넣을 수 있습니다.
// 이것을 augmentation이라고 하며, 생각보다 자주 테크닉이니 알아두면 좋습니다.
declare module "augmentation" {
  // 여기서 WebRequest를 수정할 수 있던 이유는, interface가 "선언 병합"이라는 특징을 갖기 때문입니다.
  // 만일 WebRequest가 interface가 아니라 type이었다면 일이 복잡하게 꼬이거나 수정이 불가능했을 것입니다.
  // 라이브러리를 개발해야 한다면 만일 이런 수정에 대한 니즈가 있는 타입이라면 interface를 사용하는 것이 좋습니다.
  interface WebRequest {
    _sessionId: number;
  }
}

onRequest(async (req) => {
  // 오류가 없습니다!
  req._sessionId = 123;
});
