import MAGIC_NUMBER from "@magic/number"; // 사실, 이것은 다음 import와 같습니다:
// import MAGIC_NUMBER from "../../../magic/number";

// 하지만 이렇게 상대경로를 사용하는 것은 경로가 너무 길어지고 알아보기 어려워지는 경우가 잦아져서, 타입스크립트의 path alias를 사용하여 맨 위와 같이 한 눈에 알아볼 수 있도록 사용하는 방법이 있습니다.
// 자세한 내용은 tsconfig.json을 참고하세요.

export default MAGIC_NUMBER;
