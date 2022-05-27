import { builtInComponents, builtInDirectives } from "../builtIn/export"
import { error } from "../common/console"
import { isString } from "../common/type"
import { ComponentType } from "../instance/component"
import { DirectiveType } from "../instance/directive"
import { MixinType } from "../instance/mixin"
import { PluginType } from "../instance/plugin"
import { mountComponent } from "../renderer/render/mountComponent"
import { createComponent } from "../renderer/vnode/vnode"


var currentApp: AppInstance

export function getCurrentApp(): AppInstance {
    return currentApp
}


export interface AppInstance {
    isMounted: boolean
    rootComponent: null | ComponentType
    components: Record<string, ComponentType>
    directives: Record<string, DirectiveType>
    mixins: MixinType[]
    plugins: Set<PluginType>
    component(name: string, component: ComponentType): void
    directive(name: string, directive: DirectiveType): void
    mixin(mixin: MixinType): void
    mount(selectorOrContainer: string | Element): any
    unmount(): any
    use(plugin: PluginType): any
}


function normalizeContainer(container: any): Element {
    if (isString(container)) {
        container = document.querySelector(container)
    }
    if (!(container instanceof Element)) {
        error('not legal container')
    }
    return container
}

export class App implements AppInstance {

    isMounted = false

    rootComponent: ComponentType

    constructor(rootComponent: ComponentType) {
        this.rootComponent = rootComponent
        currentApp = this as AppInstance
    }

    components: Record<string, ComponentType> = builtInComponents
    component(name: string, component: ComponentType) {
        this.components[name] = component
    }

    directives: Record<string, DirectiveType> = builtInDirectives
    directive(name: string, directive: DirectiveType) {
        this.directives[name] = directive
    }

    mixins: MixinType[] = []
    mixin(mixin: MixinType) {
        this.mixins.push(mixin)
    }

    plugins: Set<PluginType> = new Set()
    use(plugin: PluginType, ...options: any[]) {
        if (!this.plugins.has(plugin)) {
            plugin(this, ...options)
        }
    }

    container: Element | null = null
    rootInstance: any
    useSelectorTemplate: boolean = false
    mount(container: string | Element) {
        container = normalizeContainer(container)
        // todo validate legal container 
        this.container = container as Element
        var component = this.rootComponent
        if (!component.template && !component.render) {
            component.template = container.innerHTML
            this.useSelectorTemplate = true
        }
        // clear page template
        container.innerHTML = ''
        // mount root component
        this.rootInstance = mountComponent(createComponent(component, null, null), container)
        this.isMounted = true
    }

    unmount() {

    }

}