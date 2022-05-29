import { getCurrentApp } from "../../app/app"
import { error } from "../../common/console"
import { getCurrentInstance } from "../render/mountComponent"


export function getComponent(name: string) {
    var component = getCurrentInstance().components?.[name] || getCurrentApp().components[name]

    if (!component) {
        error(`cant find compnent ${name}`)
    }

    return component
}

export function getDirective(name: string) {
    var directive = getCurrentInstance().directives?.[name] || getCurrentApp().directives[name]
    if (!directive) {
        error(`can't find directive ${name}`)
    }
    return directive
}