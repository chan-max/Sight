import { Nodes } from "@crush/types"
import { callHook, LifecycleHooks } from "../../instance/lifecycle"

export function mount(vnode: any, container: any) {
    const type = vnode.nodeType
    switch (type) {
        case Nodes.HTML_ELEMENT:
            mountHTMLElement(vnode, container)
            break
        case Nodes.TEXT:
            mountText(vnode, container)
            break
        case Nodes.FRAGMENT:
            mountFragment(vnode, container)
            break
        case Nodes.STYLE:
            
            break
    }
}

function mountFragment(vnode: any, container: any) {
    mountChildren(vnode.children, container)
}

function mountChildren(children: any, container: any) {
    children.forEach((child: any) => mount(child, container));
}

function mountText(vnode: any, container: any) {
    var textContent = vnode.children
    var text = document.createTextNode(textContent)
    container.appendChild(text)
}

function mountHTMLElement(vnode: any, container: any) {
    const {
        type,
        props,
        children
    } = vnode

    var el = document.createElement(type)
    callHook(LifecycleHooks.CREATED, vnode, el)
    callHook(LifecycleHooks.BEFORE_MOUNT, vnode)
    container.appendChild(el)
    callHook(LifecycleHooks.MOUNTED, vnode)

    if (children) {
        mountChildren(children, el)
    }
}