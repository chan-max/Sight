import { Nodes } from '@crush/types'
import { doFlat } from './doFlat'

import {
    mixin
} from '../common/mixin'

function flatRules(rules: any[], parent = null) {
    const flatted = doFlat(rules, [], parent)
    // 当一层平铺结束后 ， 处理declaration
    
    flatted.forEach((rule: any) => {
        if (rule.nodeType === Nodes.STYLE_RULE) {
            const children: [any] = rule.children.map((r: any) => r.children)
            /*
                children有多个子元素时为在规则中含有其他规则或因为指令存在而打断连续性,
                并且 ， 最终生成的vdom中不会出现declaration类型，而是直接使用map结构代替
            */
            rule.children = (rule.children.length === 0 ? null : mixin(...children))
        }
    })

    return flatted
}

export {
    flatRules
}