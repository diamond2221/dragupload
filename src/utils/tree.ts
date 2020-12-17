export function formatTreeData(data: any[], cb: (item: any) => any = _ => _, parentKey = 'parentCode') {
  let level = 0
  const findTopParent = (data: any[]) => {
    return [data.filter((item: any) => !item[parentKey]), data.filter((item: any) => item[parentKey])]
  }
  const buildTree = (topParent: any[], data: any[]) => {
    const dealTree: any[] = []
    topParent.forEach((item, i) => {
      const children = data.filter(item1 => item.code === item1[parentKey])
      const other = data.filter(item1 => item.code !== item1[parentKey])
      if (children.length) {
        item.children = buildTree(children, other)
      }
      let child = {
        ...item,
        level
      }
      const otherChild = cb ? cb(item) : {}
      if (topParent.length - 1 === i) {
        level = level++
      }
      child = {
        ...child,
        ...otherChild
      }
      dealTree.push(child)
    })
    return dealTree
  }

  const format = (data: any[]) => {
    const topParent = findTopParent([...data])[0]
    const other = findTopParent([...data])[1]
    return buildTree(topParent, other)
  }
  return format(data)
}

export function findParentTreeNode(data: any[], parentCode: string, parentKey: 'code' | 'id' = 'code') {
  let res: any = null
  const df = (otherData: any[]): any => {
    for (let i = 0; i < otherData.length; i++) {
      const item = otherData[i]
      if (item[parentKey] === parentCode) {
        res = item
        break
      } else {
        res = df(item.children || [])
      }
    }
    return res
  }
  return df(data)
}

export function treeToArray<T extends { children?: T[] }>(treeData: T[]): T[] {
  const res: T[] = []
  const dfm = (arr: T[]) => {
    arr.forEach(item => {
      res.push(item)
      if (item.children) {
        dfm(item.children)
      }
    })
  }
  dfm(treeData)
  return res
}

export function addLevel(data: any[], level: number) {
  const _data = [...data]
  _data.forEach((v) => {
    v.level = level
    if (v.children && v.children.length) {
      addLevel(v.children, level + 1)
    }
  })
  return _data
}
