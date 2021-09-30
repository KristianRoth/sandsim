type Pair<A, B> = {
  first: A,
  second: B
}

const map2 = <A>(arr1: A[], arr2: A[], callBack: (a: A, b: A) => Pair<A, A>): Pair<A[], A[]>  => {
  let ret1: A[] = []
  let ret2: A[] = []
  for (let i = 0; i < min(arr1.length, arr2.length); i++) {
    let { first, second } = callBack(arr1[i], arr2[i])
    ret1.push(first)
    ret2.push(second)
  }
  return { first: ret1, second: ret2 }
}

const drag = (number: number, minn: number, maxx: number): number => {
  return min(max(number, minn), maxx)
}