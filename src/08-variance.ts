// 1줄 요약) 만일 공변성에 대한 의도가 담긴 것이 아니라면, interface의 method에 가능하면 arrow function을 사용하세요.

interface Animal {
  type: string;
}

interface Dog extends Animal {
  type: "dog";
}

interface House<Resident> {
  setHouseFor(name: Resident): void;
}

// 어떤 동물이 오든 수용할 수 있는 집입니다.
declare let animalHouse: House<Animal>;
// 강아지를 수용할 수 있는 집입니다.
declare let dogOnlyHouse: House<Dog>;

// 이건 말이 됩니다. 고양이들이 갈 집이 없어져 낭비긴 하겠지만, 어쨌든 입주한 강아지들은 불만이 없을 것입니다.
dogOnlyHouse = animalHouse;
// 하지만 이건 말이 안 됩니다. 여긴 강아지만 들어갈 수 있는 집인데요?
animalHouse = dogOnlyHouse;

// 왜 오류가 발생하지 않는지에 대해서는 복잡한 설명이 필요하지만, 일단 해결책만 생각해봅시다.
// 이런 경우에는 arrow function을 사용해서 이 문제를 해결할 수 있습니다.
// in 혹은 out 키워드를 사용할 수도 있습니다.
interface SafeHouse<Resident> {
  setHouseFor: (name: Resident) => void;
}

declare let safeAnimalHouse: SafeHouse<Animal>;
declare let safeDogOnlyHouse: SafeHouse<Dog>;

// 기존에 작동해야 하는 코드는 당연히 잘 작동합니다.
safeDogOnlyHouse = safeAnimalHouse;
// 게다가 이제 컴파일 타임에 무사히 오류를 잡아낼 수 있게 됩니다.
// @ts-expect-error
safeAnimalHouse = safeDogOnlyHouse;
