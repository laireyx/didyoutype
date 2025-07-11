type WriteCommentRequest = {
  articleId: number;
  comment: string;
};

declare function writeComment(payload: WriteCommentRequest): Promise<void>;

// 딱 맞는 페이로드입니다.
const payload = { articleId: 1, comment: "hi" };

// 어쩌다보니 당장 필요한 것은 아니지만 추가적인 항목이 더해진 페이로드입니다.
const overweightedPayload = {
  articleId: 1,
  comment: "hi",
  extra: "bar",
};

// 이렇게 사용하는 것에는 문제가 없습니다.
writeComment(payload);

// 이렇게 사용하는 것 역시 문제가 없습니다.
writeComment(overweightedPayload);

// 하지만 이렇게 사용하게 되면 오류가 발생합니다.
// 의도치 않게 추가적인 정보를 전달하는 것에는 오류의 소지뿐 아니라 보안의 문제가 발생할 수도 있는 사안입니다.
// 하지만 위와 같이 객체로 지정하면, 일반적으로는 그 객체는 다른 곳에서 전달된 경우이고, 그쪽의 로직에 대해서 여기에서 책임을 지는 것은 너무 가혹합니다.
// 반대로 그쪽에서도 전달해 준 객체가 어떻게 사용될 줄 알고 생략하도록 시킬 수 없기 떄문에, 초과분에 대해서 오류가 발생하지 않습니다.
// 하지만 이렇게 오브젝트를 즉시 생성하는 경우, 어떤 props가 들어갈지 정확히 알 수 있기 때문에, 이런 경우에는 직접적인 책임을 져야 합니다.
// @ts-expect-error
writeComment({ articleId: 1, comment: "hi", extra: "bar" });

// 최선의 방식은 불필요한 키를 삭제하는 것이지만, 어쨌든 수정하기 어렵거나 일부러 추가적인 키를 전달하는 것이 의도된 동작일 수 있습니다.
// 그런 경우 일단은 이렇게 오류를 우회하는 것이 가능합니다.
writeComment({
  articleId: 1,
  comment: "hi",
  extra: "bar",
} as WriteCommentRequest);

// 하지만 as를 아무때에나 사용하기에는 위험한 점이 있습니다.
// as는 변환되는 양쪽 타입이 부분집합의 관계이기만 하면, 어느 방향으로 포함되든지 관계없이 무조건 성공합니다.
const unsafePayload = { articleId: 1 } as WriteCommentRequest;

// 이런 경우에는 `satisfies` 키워드를 사용해서 타입 체크를 할 수 있습니다.
// 이렇게 필요한 필드가 빠져있는 경우 오류가 발생합니다.
// @ts-expect-error
const safePayload = { articleId: 1 } satisfies WriteCommentRequest;
