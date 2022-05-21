import { isArray } from '@crush/common'
import { Nodes } from '../../node/nodes'
import { empty } from '../vnode/vnode'
import {
    mount
} from './mount'
import {
    unmount, unmountChildren
} from './unmount'
import {
    update, updateChildren
} from './update'
import {
    mountChildren
} from './mount'

export const patch = (current: any, next: any, container: any, anchor: any = null) => {

    if (!current) {
        if (next) {
            isArray(next) ? mountChildren(next, container, anchor) : mount(next, container, anchor)
        } else {
            // nothing todo
        }
    } else {
        if (!next) {
            // 卸载当前节点
            isArray(next) ? unmountChildren(current) : unmount(current, container, anchor)
        } else {
            if (isArray(current)) {
                updateChildren(current, isArray(next) ? next : [next], container, anchor)
            } else {
                if (isArray(next)) {
                    updateChildren([current], next, container, anchor)
                } else {
                    // 两个单节点 ， 但key可能不同
                    if (current.type === next.type) {
                        // 类型相同，直接更新
                        update(current, next, container, anchor)
                    } else {
                        // 类型不同。先卸载，在挂载
                        unmount(current, container, anchor)
                        mount(next, container, anchor)
                    }
                }
            }
        }
    }
}
