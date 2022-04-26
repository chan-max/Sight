import { isArray } from "@crush/common"
import { Nodes } from "@crush/types"
import {
    flatRules
} from './flatRules'

/*
    处理结果返回始终是数组
*/
export function processdom(node: any[], key: any = null): null | any[] {

    if (!node) {
        return null
    }

    if (!isArray(node)) {
        node = [node]
    }

    var flattedNode: any = []

    node.forEach((child: any) => {
        if (child) {
            if (child.nodeType === Nodes.FRAGMENT) {
                /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key */
                flattedNode = flattedNode.concat(processdom(child.children, child.key))
            } else {
                if (key) {
                    child.patchKey = key + '_' + child.key
                } else {
                    child.patchKey = child.key
                }

                if (child.nodeType === Nodes.HTML_ELEMENT) {
                    // 子节点递归处理
                    child.children = processdom(child.children)
                }

                if (child.nodeType === Nodes.STYLE) {
                    child.children = flatRules(child.children)
                }
                
                flattedNode.push(child)
            }
        }
    })
    return flattedNode
}         