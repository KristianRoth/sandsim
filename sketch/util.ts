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

const plotLine = (x0: number, y0: number, x1: number, y1: number): MouseState[] => {
  let dx = abs(x1 - x0)
  let sx = x0 < x1 ? 1 : -1
  let dy = -abs(y1 - y0)
  let sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  let points: MouseState[] = []
  while (true) {
    points.push({ x: x0, y: y0})
    if (int(x0) === int(x1) && int(y0) === int(y1)) { break };
    let e2 = 2*err
    if (e2 >= dy) {
      err += dy
      x0 += sx
    }
    if (e2 <= dx) {
      err += dx
      y0 += sy
    }
  }
  return points
}