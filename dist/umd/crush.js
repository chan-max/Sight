// crush.js 1.1.2chan
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Crush = {}));
})(this, (function (exports) { 'use strict';

    const cache = (fn) => {
        const cache = Object.create(null);
        return ((key) => {
            const cached = cache[key];
            return cached === undefined ? (cache[key] = fn(key)) : cached;
        });
    };

    const warn = (...msg) => console.warn(...msg);
    const error = (...msg) => {
        throw new Error(...msg);
    };

    function getEmptyObject() {
        return Object.create(null);
    }
    var id = 0;
    const uid = () => id++;
    const uStringId = () => String(uid());
    const uVar = () => `_${uid()}`;
    const emptyObject = Object.freeze({});
    const emptyArray = Object.freeze([]);
    const emptyFunction = () => null;
    const createMap = (entries) => new Map(entries);
    const extend = (...args) => Object.assign({}, ...args);

    const arrayToMap = (arr, mapValue = true) => arr.reduce((res, item) => {
        res[item] = mapValue;
        return res;
    }, getEmptyObject());
    const stringToMap = (str, delimiter) => arrayToMap(str.split(delimiter));
    // from vue
    const makeMap = (str, delimiter = ',') => {
        var map = arrayToMap(str.split(delimiter));
        return (key) => !!map[key];
    };

    const removeFromArray = (arr, item) => {
        var index = arr.indexOf(item);
        if (index < 0)
            return false;
        arr.splice(index, 1);
        return true;
    };
    const shallowCloneArray = (arr) => arr && [...arr];
    const shallowCloneObject = (obj) => obj && { ...obj };
    function mark(target, key, value = true) {
        Object.defineProperty(target, key, {
            value,
            writable: true,
            configurable: false,
            enumerable: false
        });
    }

    function exec(target, extractor) {
        return extractor.exec(target);
    }
    function execCaptureGroups(target, extractor) {
        var res = exec(target, extractor);
        if (!res) {
            return null;
        }
        else {
            var [_, ...captureGroups] = res;
            return captureGroups;
        }
    }

    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }
    function isString(value) {
        return typeof value === 'string';
    }
    const isNumberString = (value) => isNumber(Number(value));
    const isObject = (value) => objectToString.call(value) === '[object Object]';
    const isUndefined = (value) => typeof value === 'undefined';
    const isFunction = (value) => typeof value === 'function';
    const objectToString = Object.prototype.toString;
    function typeOf(value) {
        // ! do not toLowerCase
        return objectToString.call(value).slice(8, -1);
    }
    const isPromise = (value) => {
        return value && isFunction(value.then) && isFunction(value.catch);
    };
    const isDate = (value) => value instanceof Date;
    const isArray = Array.isArray;
    // 将一个值转换成数字，失败的话，返回本身
    function toNumber(value) {
        let numberValue = Number(value);
        return isNumber(numberValue) ? numberValue : value;
    }

    const camelizeRE = /-(\w)/g;
    const camelize = cache((str) => {
        return str && str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
    });
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cache((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
    const initialUpperCase = cache((str) => str.charAt(0).toUpperCase() + str.slice(1));
    const initialLowerCase = cache((str) => str.charAt(0).toLowerCase() + str.slice(1));

    const hasOwnProperty = Object.prototype.hasOwnProperty;
    // target may be null undefined
    const hasOwn = (target, key) => target && hasOwnProperty.call(target, key);

    function debounce(fn, wait) {
        let timeoutId = null;
        return () => {
            if (timeoutId !== null) {
                // 存在任务
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn();
                timeoutId = null;
            }, wait);
        };
    }
    function throttle(fn, wait) {
        // 确保第一次永远执行
        let lastTime = -wait;
        return () => {
            console.log('th');
            if (Date.now() - lastTime >= wait) {
                fn();
                lastTime = Date.now();
            }
        };
    }
    // 如果在模板中使用防抖节流， 每次更新都会重新生成防抖截节流函数
    const debounceCache = new WeakMap();
    function cacheDebounce(fn, wait) {
        let cached = debounceCache.get(fn);
        if (cached) {
            return cached;
        }
        else {
            let debounceFn = debounce(fn, wait);
            debounceCache.set(fn, debounceFn);
            return debounceFn;
        }
    }
    const throttleCache = new WeakMap();
    function cacheThrottle(fn, wait) {
        let cached = throttleCache.get(fn);
        if (cached) {
            return cached;
        }
        else {
            let throttleFn = throttle(fn, wait);
            throttleCache.set(fn, throttleFn);
            return throttleFn;
        }
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const addClass = (el, className) => el.classList.add(className);
    const removeClass = (el, className) => el.classList.remove(className);
    const docCreateElement = (tagName, isSVG = false) => isSVG ? document.createElementNS(svgNS, tagName) : document.createElement(tagName);
    const docCreateComment = (text) => document.createComment(text);
    const docCreateText = (text) => document.createTextNode(text);
    const setText = (textEl, text) => textEl.nodeValue = text;
    const insertElement = (child, parent, anchor = null) => {
        /* 可能传入不合理的anchor */
        if (anchor && anchor.parentElement !== parent) {
            anchor = null;
        }
        parent.insertBefore(child, anchor);
    };
    const removeElement = (el) => {
        const parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    };
    // 重新挂载一个元素
    function remountElement(el) {
        let parent = el.parentElement;
        let anchor = el.nextElementSibling;
        removeElement(el);
        insertElement(el, parent, anchor);
    }
    const setAttribute = (el, attribute, value) => el.setAttribute(attribute, value);
    const removeAttribute = (el, attribute) => el.removeAttribute(attribute);
    const addListener = (target, event, handler, options = null) => target.addEventListener(event, handler, options);
    const removeListener = (target, event, handler, options = null) => target.removeEventListener(event, handler, options);
    function onceListener(target, event, handler, options = null) {
        var onceHandler = () => {
            handler();
            removeListener(target, event, onceHandler, options);
        };
        addListener(target, event, onceHandler, options);
        // 注销事件
        return () => removeListener(target, event, onceHandler, options);
    }

    // normalize props 会在创建vnode时执行，确保得到的节点props已经处理完毕，不会在
    function normalizeProps(props) {
        if (!props) {
            return;
        }
        if (props.bind) { // use bind
            extend(props, props.bind);
            delete props.bind;
        }
        // 不在渲染时在进行处理，为了可以直接通过vnode获取到相应的class
        if (props.class) {
            props.class = normalizeClass(props.class);
        }
        if (props.style) {
            props.style = normalizeStyle(props.style);
        }
        return props;
    }

    var createStyleSheet = (props, children, key = uid()) => {
        return {
            nodeType: 17 /* STYLE */,
            type: 'style',
            children,
            props: normalizeProps(props),
            key,
        };
    };
    var createStyle = (selector, children, key = uid) => {
        return {
            nodeType: 26 /* STYLE_RULE */,
            selector,
            children,
            key
        };
    };
    var createMedia = (media, children, key = uid()) => ({
        nodeType: 22 /* MEDIA_RULE */,
        media,
        children,
        key
    });
    function createKeyframes(keyframes, children, key = uid()) {
        return {
            nodeType: 24 /* KEYFRAMES_RULE */,
            keyframes,
            children,
            key
        };
    }
    function createKeyframe(keyframe, children, key = uid()) {
        return {
            nodeType: 27 /* KEYFRAME_RULE */,
            key,
            keyframe,
            children,
        };
    }
    var createSupports = (supports, children, key = uid()) => ({
        nodeType: 23 /* SUPPORTS_RULE */,
        supports,
        children,
        key
    });
    var createDeclaration = (children, key = uid()) => {
        return {
            nodeType: 29 /* DECLARATION */,
            /*
                render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
            */
            //type: Nodes.DECLARATION_GROUP,
            children,
            key
        };
    };

    function mixin(...sources) {
        return Object.assign(...sources);
    }

    function doFlat(rules, flattedRules, parent = null, // 保存parent的作用主要是当遍历到declaration时
    key = null) {
        for (let i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (!rule) {
                continue;
            }
            // 使用传来的key生成唯一的key
            var patchKey = key ? key + '_' + rule.key : rule.key;
            rule.patchKey = patchKey;
            rule.parent = parent;
            switch (rule.nodeType) {
                case 26 /* STYLE_RULE */:
                    flattedRules.push(rule);
                    var _children = rule.children;
                    rule.children = null; // children 会用存储declaration
                    if (_children) {
                        doFlat(_children, flattedRules, rule, patchKey);
                    }
                    break;
                case 29 /* DECLARATION */:
                    if (!rule.parent) {
                        debugger;
                        // 声明不再任何样式规则或媒体规则下时,应该报错
                    }
                    else if (rule.parent.nodeType === 26 /* STYLE_RULE */) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else if (rule.parent.nodeType === 27 /* KEYFRAME_RULE */) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else {
                        /*
                            当一条样式声明不时样式规则的子节点
                        */
                        if (rule.parent.nodeType === 22 /* MEDIA_RULE */) {
                            /*
                                一条声明直接存在媒体规则下，会继承媒体规则的选择器并新建一条 styleRule
                                此时和一直寻找parent的选择器
                            */
                            var selector, parent = rule.parent;
                            while (!selector && parent) { /* 当选择器没被找到，并且parent存在时才会继续寻找 */
                                selector = parent.selector;
                                parent = parent.parent;
                            }
                            if (!selector) {
                                debugger;
                            }
                            else {
                                // reset the declaration to styleRule
                                var newRule = createStyle(selector, rule.children, key);
                                newRule.patchKey = patchKey;
                                flattedRules.push(newRule);
                            }
                        }
                    }
                    continue;
                case 22 /* MEDIA_RULE */:
                    rule.children = flatRules(rule.children, rule);
                    flattedRules.push(rule);
                    break;
                case 23 /* SUPPORTS_RULE */:
                    rule.children = flatRules(rule.children);
                    flattedRules.push(rule);
                    break;
                case 24 /* KEYFRAMES_RULE */:
                    rule.children = flatRules(rule.children);
                    /*
                        在此处需要把动画下的每一帧的样式处理成对象形式
                    */
                    rule.children.forEach((keyframe) => {
                        const children = keyframe.children.map((r) => r.children);
                        keyframe.children = mixin(...children);
                    });
                    flattedRules.push(rule);
                    break;
                case 27 /* KEYFRAME_RULE */:
                    /* 需要和styleRule处理方式一样 */
                    flattedRules.push(rule);
                    var _children = rule.children;
                    rule.children = null;
                    if (_children) {
                        doFlat(_children, flattedRules, rule);
                    }
                    break;
                case 1 /* FRAGMENT */:
                    // fragment wont be a parent
                    doFlat(rule.children, flattedRules, rule.parent, rule.patchKey);
                    break;
            }
        }
        return flattedRules;
    }

    function flatRules(rules, parent = null, key = null
    /* 这里传入的key是为了避免由循环产生节点中，当第一层是fragment时，无法为子节点设置上唯一的key  */
    ) {
        const flatted = doFlat(rules, [], parent, key);
        /*
            当一层平铺结束后 ， 处理declaration
            stylesheet 的 vdom中不会存在fragment，因为在这已经处理完了
        */
        var result = [];
        flatted.forEach((rule) => {
            if (rule.nodeType === 26 /* STYLE_RULE */) {
                /*
                    children有多个子元素时为在规则中含有其他规则或因为指令存在而打断连续性,
                    并且 ， 最终生成的vdom中不会出现declaration类型，而是直接使用map结构代替,
                    仅需要处理数组结构
                */
                if (isArray(rule.children)) {
                    const children = rule.children.map((r) => r.children);
                    rule.children = (rule.children.length === 0 ? null : mixin(...children));
                }
                // 去除没有children的 style rule
                if (rule.children) {
                    result.push(rule);
                }
            }
            else {
                result.push(rule);
            }
        });
        return result;
    }

    /*
        处理结果返回始终是数组
    */
    function processStringRender(source, key) {
        source = String(source);
        return source.startsWith('! ') ? createComment(source.slice(2), key) : createText(source, key);
    }
    function processVnodePrerender(node, parentKey) {
        if (!isArray(node)) {
            node = [node];
        }
        var flattedNodes = [];
        node.forEach((child) => {
            if (child === undefined || child === null)
                return; // 空节点筛除  
            if (isString(child) || isNumber(child)) {
                // 只会出现手写render的情况
                child = processStringRender(child, parentKey);
            }
            if (isArray(child)) {
                // 只会出现手写render的情况 [[v1,v2,v3]]
                flattedNodes = flattedNodes.concat(processVnodePrerender(child, parentKey));
            }
            if (child.patchKey) {
                flattedNodes.push(child);
                return;
            }
            if (child.nodeType === 1 /* FRAGMENT */) {
                /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key ,
                    当使用 for循环时，只能传入一个key，但会在循环时为每个结果生成唯一的key
                */
                flattedNodes = flattedNodes.concat(processVnodePrerender(child.children, child.key));
            }
            else {
                if (parentKey) {
                    child.patchKey = parentKey + '_' + child.key;
                }
                else {
                    child.patchKey = child.key;
                }
                if (child.nodeType === 13 /* HTML_ELEMENT */ || child.nodeType === 9 /* SVG_ELEMENT */) {
                    // 子节点递归处理
                    child.children = processVnodePrerender(child.children);
                }
                if (child.nodeType === 17 /* STYLE */) {
                    child.children = flatRules(child.children, null, child.patchKey);
                }
                flattedNodes.push(child);
            }
        });
        return flattedNodes;
    }

    const insertNull = (arr, index, length = 1) => arr.splice(index, 0, ...new Array(length).fill(null));
    function unionkeys(...maps) {
        var _ = {};
        for (let i in maps || emptyObject) {
            for (let key in maps[i]) {
                _[key] = true;
            }
        }
        return Object.keys(_);
    }
    /*
        用于 props 的diff 算法 输入两个map类型，
        返回一个map ， 一个key 对应两个value
        例如：
        {
            key1 : [1,2] ,
            key2 : [3,4]
        }
    */
    function createMapEntries(...maps) {
        var res = {};
        for (let i in maps) {
            var map = maps[i];
            if (!map)
                continue;
            for (let key in map) {
                var value = map[key];
                var collection = res[key] ||= [];
                collection[i] = value;
            }
        }
        return res;
    }

    // for renderer
    const onRE = /^on[A-Z]/;
    const isEvent = (key) => onRE.test(key);
    /*
        dom 事件名称无大写，所以name上第一个参数为事件名称，其它为arguments
    */
    // 只有原生事件支持 opitons
    function toNativeEventName(eventName, _arguments) {
        var name = `on${initialUpperCase(eventName)}`;
        if (_arguments && _arguments.length !== 0) {
            name += _arguments.map(initialUpperCase).join(''); // join default with ,
        }
        return name;
    }
    const parseNativeEventName = (name) => {
        var keys = name.split(/(?=[A-Z])/).map((key) => key.toLowerCase());
        // remove on
        keys.shift();
        var event = keys[0];
        // remove eventName
        keys.shift();
        return {
            event,
            options: arrayToMap(keys)
        };
    };
    /*
        @event:arg1:arg2.mod1.mod2
            tranform to...
            onEvent_arg1_arg2$mod1$mod2
    */
    function toEventName(event, _arguments, modifiers) {
        event = `on${initialUpperCase(event)}`;
        _arguments && (event += _arguments.map((_) => `_${_}`).join(''));
        modifiers && (event += modifiers.map(($) => `$${$}`).join(''));
        return event;
    }
    // quickly get the handler key event
    function getEventName(name) {
        return initialLowerCase(name.slice(2).split(/_|\$/)[0]);
    }
    const extrctEventNameRE = /on([a-zA-Z]+)([_a-zA-Z]*)([\$a-zA-Z]*)/;
    function parseEventName(name) {
        const [_, event, _argumentsStr, modifiersStr] = extrctEventNameRE.exec(name);
        return {
            event: initialLowerCase(event),
            _arguments: _argumentsStr && arrayToMap(_argumentsStr.split('_').filter(Boolean)),
            modifiers: modifiersStr && arrayToMap(modifiersStr.split('$').filter(Boolean))
        };
    }
    // 返回 true 代表停止事件执行
    const modifierGuards = {
        stop: (e) => e.stopPropagation(),
        prevent: (e) => e.preventDefault(),
        self: (e) => e.target !== e.currentTarget,
        ctrl: (e) => !e.ctrlKey,
        shift: (e) => !e.shiftKey,
        alt: (e) => !e.altKey,
        meta: (e) => !e.metaKey,
        left: (e) => 'button' in e && e.button !== 0,
        middle: (e) => {
            'button' in e && e.button !== 1;
        },
        right: (e) => 'button' in e && e.button !== 2,
        // 按键修饰符
        enter: (e) => {
            if (e.key !== 'Enter') {
                return true;
            }
        }
    };
    /*
        使用修饰符后每次都会创建一个新的函数
    */
    function withEventModifiers(fn, modifiers) {
        return (event, ...args) => {
            for (let i = 0; i < modifiers.length; i++) {
                const guard = modifierGuards[modifiers[i]];
                if (guard && guard(event, modifiers))
                    return;
            }
            return fn(event, ...args);
        };
    }

    const IMPORTANT_SYMBOL = Symbol('Important');
    const IMPORTANT_KEY = '!important';
    const IMPORTANT = 'important';
    function important(value) {
        return {
            value,
            [IMPORTANT_SYMBOL]: true
        };
    }

    // support number , from , to
    function normalizeKeyText(keyframe) {
        if (isArray(keyframe)) {
            return keyframe.map(normalizeKeyText).join(',');
        }
        if (isNumber(Number(keyframe))) {
            // 为数字或者数字字符串
            return `${keyframe}%`;
        }
        return `${keyframe}`;
    }
    const setKeyText = (keyframe, key) => keyframe.keyText = normalizeKeyText(key);
    const insertRule = (sheet, rule, index = sheet.cssRules.length) => sheet.insertRule(rule, index);
    const insertStyle = (sheet, selector, index) => insertRule(sheet, `${selector}{}`, index);
    const insertMedia = (sheet, media, index) => insertRule(sheet, `@media ${media}{}`, index);
    const insertSupports = (sheet, supports, index) => insertRule(sheet, `@supports ${supports}{}`, index);
    const insertKeyframes = (sheet, keyframes, index) => insertRule(sheet, `@keyframes ${keyframes}{}`, index);
    // appendRule wont return the index 
    const insertKeyframe = (sheet, keyText) => sheet.appendRule(`${normalizeKeyText(keyText)}{}`);
    const deleteRule = (sheet, index) => sheet.deleteRule(index);
    const deleteKeyframe = (keyframes, keyText) => keyframes.deleteRule(normalizeKeyText(keyText));
    // update
    const setSelector = (styleRule, selector) => styleRule.selectorText = selector;
    const setKeyframesName = (keyframesRule, name) => keyframesRule.name = name;
    const deleteMedium = (mediaRule, medium) => mediaRule.media.deleteMedium(medium);
    const appendMedium = (mediaRule, medium) => mediaRule.media.appendMedium(medium);
    const setStyleProperty = (style, property, value, important = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : '');

    function parseStyleValue(rawValue) {
        var value, important = false;
        if (rawValue === undefined || rawValue === null) {
            value = null;
        }
        else if (rawValue[IMPORTANT_SYMBOL]) {
            value = rawValue.value;
            important = true;
        }
        else {
            value = rawValue;
            important = false;
        }
        if (isString(value) && value.endsWith(IMPORTANT_KEY)) {
            value = value.split(IMPORTANT_KEY)[0].trim();
            important = true;
        }
        // 支持数组
        if (isArray(value)) {
            value = value.join(' ');
        }
        return {
            value,
            important
        };
    }
    function updateDeclaration(style, pDeclaration, nDeclaration) {
        pDeclaration ||= emptyObject;
        nDeclaration ||= emptyObject;
        for (let propName of unionkeys(pDeclaration, nDeclaration)) {
            var { value: pValue, important: pImportant } = parseStyleValue(pDeclaration[propName]);
            var { value: nValue, important: nImportant } = parseStyleValue(nDeclaration[propName]);
            if (pValue !== nValue || pImportant !== nImportant) {
                setStyleProperty(style, propName, nValue, nImportant);
            }
        }
    }
    function mountDeclaration(style, declaration) {
        return updateDeclaration(style, emptyObject, declaration);
    }
    // export 
    const setElementStyleDeclaration = (el, declaration) => mountDeclaration(el.style, declaration);
    function unmountDeclaration(style, declaration) {
        return updateDeclaration(style, declaration, emptyObject);
    }
    // ready for animation and transition
    function getStyleValue(style, key) {
        var property = hyphenate(key);
        var value = style.getPropertyValue(property);
        var isImportant = !!style.getPropertyPriority(property);
        return isImportant ? important(value) : value;
    }
    function getElementStyleValue(el, key) {
        return getStyleValue(el.style, key);
    }
    function getElementComputedStyleValue(el, key) {
        return getStyleValue(window.getComputedStyle(el), key);
    }
    function getStyle(style, keys) {
        if (isObject(keys)) {
            keys = Object.keys(keys);
        }
        else if (isString(keys)) {
            keys = keys.split(',');
        }
        var declaration = {};
        for (let key of keys) {
            declaration[camelize(key)] = getStyleValue(style, key);
        }
        return declaration;
    }
    function getElementStyle(el, keys) {
        return getStyle(el.style, keys);
    }
    function getElementComputedStyle(el, keys) {
        return getStyle(window.getComputedStyle(el), keys);
    }

    const globalInstanceEventListeners = new WeakMap();
    function getInstanceEvents(instance) {
        let listenersMap = globalInstanceEventListeners.get(instance);
        if (!listenersMap) {
            listenersMap = new Map();
            globalInstanceEventListeners.set(instance, listenersMap);
        }
        return listenersMap;
    }
    function getInstancetEventListeners(instance, event) {
        let events = getInstanceEvents(instance);
        let listeners = events.get(event);
        if (!listeners) {
            listeners = new Set();
            events.set(event, listeners);
        }
        return listeners;
    }
    function createInstanceEventEmitter(instance) {
        return (event, ...args) => {
            emitInstancetEvent(instance, event, ...args);
        };
    }
    function emitInstancetEvent(instance, event, ...args) {
        const listeners = getInstancetEventListeners(instance, event);
        listeners.forEach((handler) => {
            handler(...args);
        });
    }
    /* handler 标准化，转成数组格式 */
    function normalizeHandler(handler) {
        return (isArray(handler) ? handler : [handler]).filter(isFunction);
    }
    function updateInstanceListeners(instance, event, pHandler, nHandler) {
        // 不影响组件自身注册的事件
        removeInstanceListener(instance, event, pHandler);
        addInstanceListener(instance, event, nHandler);
    }
    function addInstanceListener(instance, event, rawHandler) {
        const listeners = getInstancetEventListeners(instance, event);
        normalizeHandler(rawHandler).forEach((handler) => {
            listeners.add(handler);
        });
    }
    function removeInstanceListener(instance, event, rawHandler) {
        const listeners = getInstancetEventListeners(instance, event);
        normalizeHandler(rawHandler).forEach((handler) => {
            listeners.delete(handler);
        });
    }
    function onceInstanceListener(instance, event, rawHandler) {
        const listeners = getInstancetEventListeners(instance, event);
        normalizeHandler(rawHandler).forEach((handler) => {
            const onceHandler = (...args) => {
                handler(...args);
                listeners.delete(onceHandler);
            };
            listeners.add(onceHandler);
        });
    }
    // native events

    const beoforeClassMountHooks = new Set();
    function onBeforeClassMount(hook) {
        beoforeClassMountHooks.add(hook);
        return () => {
            beoforeClassMountHooks.delete(hook);
        };
    }
    function updateClass(el, pClass, nClass) {
        pClass = normalizeClass(pClass);
        nClass = normalizeClass(nClass);
        for (let className of unionkeys(pClass, nClass)) {
            var p = pClass[className];
            var n = nClass[className];
            if (!p === !n) {
                continue;
            }
            if (p) {
                removeClass(el, className);
            }
            if (n) {
                for (let beoforeClassMountHook of beoforeClassMountHooks) {
                    beoforeClassMountHook(className, el);
                }
                addClass(el, className);
            }
        }
    }
    function mountClass(el, _class) {
        updateClass(el, emptyObject, _class);
    }
    function unmountClass(el) {
        el.className = '';
    }
    function mountAttributes(el, props, instance, isSVG) {
        updateAttributes(el, emptyObject, props, instance, isSVG);
    }
    function updateAttributes(el, pProps, nProps, instance, isSVG = false) {
        pProps ||= emptyObject;
        nProps ||= emptyObject;
        for (let propName of unionkeys(pProps, nProps)) {
            var pValue = pProps[propName];
            var nValue = nProps[propName];
            switch (propName) {
                case 'style':
                    updateDeclaration(el.style, normalizeStyle(pValue), normalizeStyle(nValue));
                    break;
                case 'class':
                case 'className':
                    updateClass(el, pValue, nValue);
                    break;
                case 'ref':
                    let refs = instance.refs ||= {};
                    if (nValue !== pValue) {
                        pValue && (refs[pValue] = null);
                        nValue && (refs[nValue] = el);
                    }
                    break;
                case 'bind':
                    updateAttributes(el, pValue, nValue, instance, isSVG);
                    break;
                default:
                    if (propName.startsWith('_')) {
                        // 保留属性
                        continue;
                    }
                    if (isEvent(propName)) {
                        var { event, options } = parseNativeEventName(propName);
                        if (isElementLifecycleHook(event)) {
                            // 生命周期钩子跳过
                            continue;
                        }
                        updateNativeEvents(el, event, pValue, nValue, options);
                    }
                    else if (propName in el && !isSVG) { // dom props
                        (pValue !== nValue) && (el[propName] = nValue);
                    }
                    else {
                        // attribute
                        (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName));
                    }
            }
        }
    }
    /*
        原生侦听器支持一维数组格式，[a,b,c]
    */
    function updateNativeEvents(el, event, pHandler, nHandler, options) {
        normalizeHandler(pHandler).forEach((ph) => {
            removeListener(el, event, ph, options);
        });
        normalizeHandler(nHandler).forEach((nh) => {
            addListener(el, event, nh, options);
        });
    }

    /*
        mountStyleSheet will create a style element
    */
    const mountStyleSheet = (vnode, container, anchor, parent) => {
        const { props, children } = vnode;
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        var el = docCreateElement('style');
        mountAttributes(el, props, parent, false);
        processHook("created" /* CREATED */, vnode);
        vnode.el = el;
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        insertElement(el, container, anchor);
        var sheet = el.sheet;
        mountSheet(sheet, children);
        processHook("mounted" /* MOUNTED */, vnode);
        return sheet;
    };
    function mountSheet(sheet, rules) {
        rules.forEach((rule) => {
            mountRule(sheet, rule);
        });
    }
    function mountRule(sheet, rule, index = sheet.cssRules.length) {
        switch (rule.nodeType) {
            case 26 /* STYLE_RULE */:
                mountStyleRule(sheet, rule, index);
                break;
            case 22 /* MEDIA_RULE */:
                mountMediaRule(sheet, rule, index);
                break;
            case 23 /* SUPPORTS_RULE */:
                mountSupportsRule(sheet, rule, index);
                break;
            case 24 /* KEYFRAMES_RULE */:
                mountKeyframesRule(sheet, rule, index);
                break;
            case 27 /* KEYFRAME_RULE */:
                mountKeyframeRule(sheet, rule);
                break;
        }
    }
    function mountStyleRule(sheet, rule, insertIndex = sheet.cssRules.length) {
        const { selector, children: declaration } = rule;
        if (!declaration)
            return;
        const index = insertStyle(sheet, selector, insertIndex);
        const insertedRule = sheet.cssRules[index];
        rule.rule = insertedRule; // set rule
        const insertedRuleStyle = insertedRule.style;
        mountDeclaration(insertedRuleStyle, declaration);
    }
    function mountMediaRule(sheet, rule, insertIndex = sheet.cssRules.length) {
        var media = rule.media;
        var rules = rule.children;
        if (isArray(media)) {
            media = media.join(',');
        }
        var index = insertMedia(sheet, media, insertIndex);
        var newSheet = sheet.cssRules[index];
        rule.rule = newSheet;
        mountSheet(newSheet, rules);
    }
    function mountSupportsRule(sheet, rule, insertIndex = sheet.cssRules.length) {
        var supports = rule.supports;
        var rules = rule.children;
        var index = insertSupports(sheet, supports, insertIndex);
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules);
    }
    function mountKeyframesRule(sheet, rule, insertIndex = sheet.cssRules.length) {
        var keyframes = rule.keyframes;
        var rules = rule.children;
        var index = insertKeyframes(sheet, keyframes, insertIndex);
        rule.rule = sheet.cssRules[insertIndex];
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules);
    }
    function mountKeyframeRule(sheet, rule) {
        var { keyframe, children: declaration } = rule;
        insertKeyframe(sheet, keyframe);
        sheet.appendRule(`${keyframe}{}`);
        var index = sheet.cssRules.length - 1;
        const insertedRule = sheet.cssRules[index];
        rule.rule = insertedRule; // set rule
        const insertedRuleStyle = insertedRule.style;
        for (let property in declaration) {
            var { value } = parseStyleValue(declaration[property]);
            // keyframe 中不能设置important
            setStyleProperty(insertedRuleStyle, property, value);
        }
    }

    function mountRenderComponent(vnode, container, anchor, parent) {
        const { type, props, children } = vnode;
        vnode.instance = parent;
        // 函数式组件没有实例，但也可以拥有状态 , 组件有状态时，会进行自更新 ， 自更新时props和slots内容还是之前传过来的
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        const renderResult = type.call(null, props, children, vnode);
        const next = processVnodePrerender(renderResult);
        processHook("created" /* CREATED */, vnode);
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        patch(vnode.vnode, next, container, anchor, parent);
        processHook("mounted" /* MOUNTED */, vnode);
        vnode.vnode = next; // 保存当前组件的树
    }
    function updateRenderComponent(pVnode, nVnode, container, anchor, parent) {
        const { type, props, children } = nVnode;
        nVnode.instance = parent;
        const renderResult = type.call(null, props, children, nVnode, pVnode); // 传入新旧节点
        const prev = pVnode.vnode;
        const next = processVnodePrerender(renderResult);
        processHook("beforeUpdate" /* BEFORE_UPDATE */, nVnode, pVnode);
        patch(prev, next, container, anchor, parent);
        processHook("updated" /* UPDATED */, nVnode, pVnode);
        nVnode.vnode = next; //
    }
    function unmountRenderComponent(vnode, container, anchor, parent) {
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode);
        patch(vnode.vnode, null, container, anchor, parent); // 直接卸载节点即可
        processHook("unmounted" /* UNMOUNTED */, vnode);
    }

    function mount(vnode, container, anchor = null, parent = null) {
        switch (vnode.nodeType) {
            case 13 /* HTML_ELEMENT */:
                return mountElement(vnode, container, anchor, parent);
            case 9 /* SVG_ELEMENT */:
                return mountElement(vnode, container, anchor, parent, true);
            case 12 /* TEXT */:
                return mountText(vnode, container, anchor, parent);
            case 10 /* HTML_COMMENT */:
                return insertElement(vnode.el = docCreateComment(vnode.children), container, anchor);
            case 14 /* COMPONENT */:
                return mountComponent(vnode, container, anchor, parent);
            case 15 /* RENDER_COMPONENT */:
                return mountRenderComponent(vnode, container, anchor, parent);
            case 17 /* STYLE */:
                return mountStyleSheet(vnode, container, anchor, parent);
        }
    }
    function mountChildren(children, container, anchor, parent) {
        if (!children)
            return;
        children.forEach((child) => {
            mount(child, container, anchor, parent);
        });
    }
    function mountElement(vnode, container, anchor, parent, isSVG = false) {
        vnode.instance = parent;
        // 1
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        // 2
        const { type, props, children, transition, patchKey } = vnode;
        // create 
        const el = vnode.el = docCreateElement(type, isSVG);
        el._vnode = vnode;
        mountAttributes(el, props, parent, isSVG);
        processHook("created" /* CREATED */, vnode);
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        // 进入动画不影响节点的插入
        if (transition) {
            transition.processMount(el, () => insertElement(el, container, anchor));
        }
        else {
            insertElement(el, container, anchor);
        }
        // mounted 后需不需要拿到子节点元素
        processHook("mounted" /* MOUNTED */, vnode);
        mountChildren(children, el, anchor, parent);
        processHook("childrenMounted" /* CHILDREN_MOUNTED */, vnode);
    }
    function mountText(vnode, container, anchor, parent) {
        var el = docCreateText(vnode.children);
        vnode.el = el;
        vnode.instance = parent;
        insertElement(el, container, anchor);
    }

    const unmountComponent = (component, container, anchor = null) => {
        const { instance } = component;
        const { vnode } = instance;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, component);
        patch(vnode, null, container, anchor, parent);
        processHook("unmounted" /* UNMOUNTED */, component);
    };

    function unmount(vnode, container, anchor, parent) {
        switch (vnode.nodeType) {
            case 13 /* HTML_ELEMENT */:
                unmountElement(vnode);
                break;
            case 10 /* HTML_COMMENT */:
                removeElement(vnode.el);
                break;
            case 17 /* STYLE */:
                unmountElement(vnode);
                break;
            case 9 /* SVG_ELEMENT */:
                unmountElement(vnode);
                break;
            case 12 /* TEXT */:
                removeElement(vnode.el);
                break;
            case 14 /* COMPONENT */:
                unmountComponent(vnode, container, anchor);
                break;
            case 15 /* RENDER_COMPONENT */:
                unmountRenderComponent(vnode, container, anchor, parent);
                break;
        }
    }
    function unmountChildren(children) {
        // 卸载过程目前不需要锚点
        children.forEach(unmount);
    }
    function unmountElement(vnode) {
        const { el, transition } = vnode;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode);
        if (vnode.children && vnode.nodeType !== 17 /* STYLE */) {
            unmountChildren(vnode.children);
        }
        if (transition) {
            transition.processUnmount(el);
        }
        else {
            removeElement(el);
        }
        processHook("unmounted" /* UNMOUNTED */, vnode);
    }

    const mountComponentProps = (instance, props) => updateComponentProps(instance, null, props);
    function updateComponentProps(instance, pProps, nProps) {
        pProps ||= emptyObject;
        nProps ||= emptyObject;
        const { scope, propsOptions, emitsOptions } = instance;
        // 在props都不存在的情况下也要处理默认值，必须值等情况，所以传入propsoptions进入循环
        for (let prop of unionkeys(pProps, nProps, propsOptions, emitsOptions)) {
            let pValue = pProps[prop];
            let nValue = nProps[prop];
            if (prop.startsWith('_')) ;
            else if (prop === 'ref') {
                // ref component
                let refs = instance.parent.refs ||= {};
                if (nValue !== pValue) {
                    pValue && (refs[pValue] = null);
                    nValue && (refs[nValue] = instance);
                }
            }
            else if (prop === 'bind') {
                updateComponentProps(instance, pValue, nValue);
            }
            else if (!propsOptions[prop] || (isEvent(prop) && !emitsOptions[getEventName(prop)])) {
                let attrs = instance.attrs ||= {};
                attrs[prop] = nValue;
            }
            else if (isEvent(prop)) {
                // events
                var { event, _arguments, modifiers } = parseEventName(prop);
                if (isComponentLifecycleHook(event)) {
                    return;
                }
                updateInstanceListeners(instance, event, pValue, nValue);
            }
            else {
                // props
                const { default: _default, type, validator, required } = propsOptions[prop];
                if (isUndefined(nValue)) {
                    // nValue 不存在在时应该使用默认值
                    if (required) {
                        error(`props ${prop} is required`);
                    }
                    else {
                        nValue = _default;
                    }
                }
                if (type && nValue.constructor !== type) {
                    error(`prop ${nValue} is not the typeOf ${type.name}`);
                }
                if (validator && !validator(nValue)) {
                    error(`prop ${nValue} is not legal for custom validator`);
                }
                // do update props value
                scope[prop] = nValue;
            }
        }
    }

    const updateComponent = (p, n, container, anchor, parent) => {
        // 进入update 则patchkey一定相同
        const { instance, props: pProps } = p;
        n.instance = instance;
        updateComponentProps(instance, pProps, n.props);
        // update slots ... 不需要更新slot
        // 把新节点存到更新方法上，有该节点代表为外部更新，而非自更新
        instance.updatingComponentVnode = n;
    };

    /*
        diff the dom children and rules children

        the dom vnodes will be reused with the same patchKey and the same type ,
        so , we can make the reused vnodes stay in the same index , this is the first step
        and then , the unsame keyed vnodes , we can reuse them if they have the same type , its the second step,
        apon the process , we get the same length children ,
        and the same type and same key vnodes are in the same index , the same type , not same key nodes also in the same index ,
        so the only things we need todo is loop the chidren each the patch operate,

        but the rules is something different ,
        the same nodeType and same key we can reuse ,
        others can be rsused while they have the same nodeType

        ! something interesting  , the key order will not change
    */
    function createMapAndList(children) {
        var map = {};
        var list = children.map((child, index) => {
            var patchKey = child.patchKey;
            var token = {
                node: child,
                patchKey,
                index
            };
            map[patchKey] = token;
            return token;
        });
        return {
            map, list
        };
    }
    function sortChildren(p, n) {
        // copy
        p = [...p || []];
        n = [...n || []];
        var nLength = n.length;
        var { map: pMap } = createMapAndList(p);
        var pMoved = 0;
        for (let i = 0; i < nLength; i++) {
            /*
                此次循环用于将两组规则的相同key对应到相同的索引下
            */
            var node = n[i];
            var patchKey = node.patchKey;
            var sameNode = pMap[patchKey];
            if (sameNode && sameNode.node.type === node.type) {
                /*
                    the condition of reuse a vnode for dom is same patchkey and same type
                    for rules is just the same patchkey
                */
                var sameNodeIndex = sameNode.index + pMoved;
                var diff = i - sameNodeIndex;
                var diffLength = Math.abs(diff);
                if (diff < 0) {
                    /* 说明该接点在p中的位置较远，需要再n中条南充元素 */
                    insertNull(n, i, diffLength);
                    i += diffLength;
                    nLength += diffLength;
                }
                else {
                    insertNull(p, sameNodeIndex, diffLength);
                    pMoved += diffLength;
                }
            }
        }
        return {
            p, n
        };
    }
    function sortRules(p, n) {
        // copy
        p = [...p || []];
        n = [...n || []];
        var nLength = n.length;
        var { map: pMap } = createMapAndList(p);
        var pMoved = 0;
        for (let i = 0; i < nLength; i++) {
            /*
                此次循环用于将两组规则的相同key对应到相同的索引下
            */
            var node = n[i];
            var patchKey = node.patchKey;
            var sameNode = pMap[patchKey];
            if (sameNode) {
                /*
                    the condition of reuse a vnode for dom is same patchkey and same type
                    for rules is just the same patchkey
                */
                var sameNodeIndex = sameNode.index + pMoved;
                var diff = i - sameNodeIndex;
                var diffLength = Math.abs(diff);
                if (diff < 0) {
                    /* 说明该接点在p中的位置较远，需要再n中条南充元素 */
                    insertNull(n, i, diffLength);
                    i += diffLength;
                    nLength += diffLength;
                }
                else {
                    insertNull(p, sameNodeIndex, diffLength);
                    pMoved += diffLength;
                }
            }
        }
        return {
            p, n
        };
    }

    const updateStyleSheet = (p, n) => {
        var el = n.el = p.el;
        var sheet = el.sheet;
        /*
            更新style元素的props，并且处理特殊属性如，unit,url 等
        */
        updateSheet(p.children, n.children, sheet);
    };
    function updateSheet(pRules, nRules, sheet, vnode) {
        /*
            与更新dom元素不同，规则中只要patchKey相同就一定会复用,
            更新过程依赖patchkey
            patchkey 作为第一优先级
            其次为nodetype,
            !还是假设key相同的节点顺序一定不会变，
        */
        var { p, n } = sortRules(pRules, nRules);
        /*
            经过第一次处理后，还需要进行第二次处理，目的是只有nodeType类型相同的节点会属于相同的节点，其他一律用空节点代替，因为一定会挂载或卸载，
            抛出同一索引下节点类型不相同的情况
        */
        var max = Math.max(p.length, n.length);
        var cursor = 0;
        for (let i = 0; i < max; i++) {
            var pRule = p[i];
            var nRule = n[i];
            /*
                不存在两个对应位置都为空的情况
            */
            if (!pRule) {
                mountRule(sheet, nRule, cursor);
                cursor++;
            }
            else if (!nRule) {
                // unmount
                deleteRule(sheet, cursor);
                cursor--;
            }
            else if (pRule.nodeType !== nRule.nodeType) {
                // 当节点类型不同时，先卸载，再挂载 
                deleteRule(sheet, cursor);
                mountRule(sheet, nRule, cursor);
            }
            else {
                // update
                switch (nRule.nodeType) {
                    case 26 /* STYLE_RULE */:
                        updateStyleRule(pRule, nRule);
                        break;
                    case 22 /* MEDIA_RULE */:
                        updateMediaRule(pRule, nRule);
                        break;
                    case 23 /* SUPPORTS_RULE */:
                        // supports can't update 
                        deleteRule(sheet, cursor);
                        mountRule(sheet, nRule, cursor);
                        break;
                    case 24 /* KEYFRAMES_RULE */:
                        updateKeyframesRule(pRule, nRule);
                        break;
                }
            }
            cursor++;
        }
    }
    function updateStyleRule(pRule, nRule, vnode) {
        var rule = nRule.rule = pRule.rule;
        var style = rule.style;
        if (!style)
            return;
        var { selector: pSelector, children: pDeclaration } = pRule;
        var { selector: nSelector, children: nDeclaration } = nRule;
        if (pSelector !== nSelector) {
            setSelector(rule, nSelector);
        }
        updateDeclaration(style, pDeclaration, nDeclaration);
    }
    // same as selector delimiter
    const mediumDelimiter = /\s*,\s*/;
    const normalizeMedium = (medium) => isArray(medium) ? medium : medium.trim().split(mediumDelimiter);
    function updateMedium(mediaRule, pMediaum, nMediaum) {
        pMediaum = normalizeMedium(pMediaum);
        nMediaum = normalizeMedium(nMediaum);
        pMediaum.forEach((m) => {
            if (!nMediaum.includes(m)) {
                deleteMedium(mediaRule, m);
            }
        });
        nMediaum.forEach((m) => {
            if (!pMediaum.includes(m)) {
                appendMedium(mediaRule, m);
            }
        });
    }
    function updateMediaRule(pRule, nRule, vnode) {
        var rule = nRule.rule = pRule.rule;
        var { media: pMedia, children: pRules } = pRule;
        var { media: nMedia, children: nRules } = nRule;
        updateMedium(rule, pMedia, nMedia);
        updateSheet(pRules, nRules, rule);
    }
    function updateKeyframesRule(pRule, nRule, vnode) {
        var keyframesrule = nRule.rule = pRule.rule;
        var { keyframes: pKeyframes, children: pRules } = pRule;
        var { keyframes: nKeyframes, children: nRules } = nRule;
        if (pKeyframes !== nKeyframes) {
            setKeyframesName(keyframesrule, nKeyframes);
        }
        var maxLength = Math.max(pRules.length, nRules.length);
        /*
            最简单的更新策略，只存在keyframe，并且可以设置keyText
        */
        for (let i = 0; i < maxLength; i++) {
            var pk = pRules[i];
            var nk = nRules[i];
            if (!pk) {
                mountKeyframeRule(keyframesrule, nk);
            }
            else if (!nk) {
                deleteKeyframe(keyframesrule, pk.keyframe);
            }
            else {
                var { keyframe: pKeyframe, children: pDeclaration } = pk;
                var { keyframe: nKeyframe, children: nDeclaration } = nk;
                let keyframerule = nk.rule = pk.rule;
                var style = keyframerule.style;
                if (pKeyframe !== nKeyframe) {
                    setKeyText(keyframerule, nKeyframe);
                }
                updateDeclaration(style, pDeclaration, nDeclaration);
            }
            // 不存在两个都没有的情况
        }
    }

    function update(p, n, container, anchor, parent) {
        switch (n.nodeType) {
            case 12 /* TEXT */:
                updateText(p, n);
                break;
            case 13 /* HTML_ELEMENT */:
                updateElement(p, n, container, anchor, parent);
                break;
            case 9 /* SVG_ELEMENT */:
                updateElement(p, n, container, anchor, parent, true);
            case 17 /* STYLE */:
                updateStyleSheet(p, n);
                break;
            case 14 /* COMPONENT */:
                updateComponent(p, n);
                break;
            case 15 /* RENDER_COMPONENT */:
                updateRenderComponent(p, n, container, anchor, parent);
                break;
        }
    }
    function updateText(p, n) {
        var el = n.el = p.el;
        if (p.children !== n.children) {
            el.textContent = n.children;
        }
    }
    function updateElement(p, n, container, anchor, parent, isSVG = false) {
        const el = n.el = p.el;
        processHook("beforeUpdate" /* BEFORE_UPDATE */, n, p);
        updateAttributes(el, p.props, n.props, parent, isSVG);
        processHook("updated" /* UPDATED */, n, p);
        // updated hooks should be called here ? or after children update
        updateChildren(p.children, n.children, container, anchor, parent);
    }
    function updateChildren(pChildren, nChildren, container, anchor, parent) {
        var { p, n } = sortChildren(pChildren, nChildren);
        var max = Math.max(p.length, n.length);
        for (let i = 0; i < max; i++) {
            patch(p[i], n[i], container, getAnchor(p, i + 1), parent);
        }
    }
    /*
        在已经挂载的vnodes中获取anchor
    */
    function getAnchor(vnodes, index) {
        for (let i = index; i < vnodes.length; i++) {
            let nextSibiling = vnodes[i];
            if (!nextSibiling) {
                // 这里可能出现为空是因为排序时增加的空节点
                continue;
            }
            return getEL(nextSibiling);
        }
    }
    function getEL(vnode) {
        if (!vnode) {
            return null;
        }
        switch (vnode.nodeType) {
            case 14 /* COMPONENT */:
                return getEL(vnode.instance.vnode[0]);
            case 15 /* RENDER_COMPONENT */:
                return getEL(vnode.vnode[0]);
            case 13 /* HTML_ELEMENT */:
            case 9 /* SVG_ELEMENT */:
            case 12 /* TEXT */:
            case 10 /* HTML_COMMENT */:
                return vnode.el;
        }
        return null;
    }

    const patch = (prev, next, container, anchor, parent) => {
        if (!prev) {
            if (next) {
                isArray(next) ? mountChildren(next, container, anchor, parent) : mount(next, container, anchor, parent);
            }
            else {
                return;
            }
        }
        else {
            if (!next) {
                // 卸载当前节点
                isArray(prev) ? unmountChildren(prev) : unmount(prev, container, anchor, parent);
            }
            else {
                if (isArray(prev)) {
                    updateChildren(prev, isArray(next) ? next : [next], container, anchor, parent);
                }
                else {
                    if (isArray(next)) {
                        updateChildren([prev], next, container, anchor, parent);
                    }
                    else {
                        let { type: prevType, patchKey: prevPatchKey } = prev;
                        let { type: nextType, patchKey: nextPatchKey, nodeType } = next;
                        // 文本节点和注释节点直接更新即可
                        if (prevType === nextType && (prevPatchKey === nextPatchKey || nodeType === 12 /* TEXT */ || nodeType === 10 /* HTML_COMMENT */)) {
                            // type相同，nodeType一定相同
                            update(prev, next, container, anchor, parent);
                        }
                        else {
                            unmount(prev, container, anchor, parent);
                            mount(next, container, anchor, parent);
                        }
                    }
                }
            }
        }
    };

    const ReactiveTypeSymbol = Symbol('ReactiveType');
    // ref 或 reactive
    function isProxy(value) {
        return value && value[ReactiveTypeSymbol];
    }
    // 可被代理的类型 ， 响应式或只读
    function isProxyType(value) {
        switch (typeOf(value)) {
            case exports.ReactiveTypes.ARRAY:
            case exports.ReactiveTypes.OBJECT:
            case exports.ReactiveTypes.MAP:
            case exports.ReactiveTypes.SET:
            case exports.ReactiveTypes.WEAK_MAP:
            case exports.ReactiveTypes.WEAK_SET:
                return true;
            default:
                return false;
        }
    }
    // 标记一个数据使其不会成为响应式数据
    function markRaw(data) {
        if (isProxyType(data)) {
            data[ReactiveTypeSymbol] = true;
        }
        return data;
    }
    exports.ReactiveTypes = void 0;
    (function (ReactiveTypes) {
        ReactiveTypes["OBJECT"] = "Object";
        ReactiveTypes["ARRAY"] = "Array";
        ReactiveTypes["MAP"] = "Map";
        ReactiveTypes["SET"] = "Set";
        ReactiveTypes["WEAK_MAP"] = "WeakMap";
        ReactiveTypes["WEAK_SET"] = "WeakSet";
    })(exports.ReactiveTypes || (exports.ReactiveTypes = {}));
    function toRaw(value) {
        return value && (value["raw" /* RAW */] || value);
    }
    function isReactive(value) {
        return value && value["isReactive" /* IS_REACTIVE */];
    }
    function isShallow(value) {
        return value && value["isShallow" /* IS_SHALLOW */];
    }
    function isRef(value) {
        return value && value["isRef" /* IS_REF */];
    }

    const TARGET_MAP = new WeakMap();
    function getDepsMap(target) {
        let depsMap = TARGET_MAP.get(target);
        if (!depsMap) {
            depsMap = new Map();
            TARGET_MAP.set(target, depsMap);
        }
        return depsMap;
    }
    function getDeps(target, key) {
        // ref 和 set类型 没有depsMap ，只有 deps
        if (!isUndefined(key)) { // 没传 key
            let depsMap = getDepsMap(target);
            let deps = depsMap.get(key);
            if (!deps) {
                deps = new Set();
                depsMap.set(key, deps);
            }
            return deps;
        }
        else {
            let deps = TARGET_MAP.get(target);
            if (!deps) {
                deps = new Set();
                TARGET_MAP.set(target, deps);
            }
            return deps;
        }
    }
    function track(target, key) {
        let activeEffect = getActiveEffect();
        if (!activeEffect)
            return;
        let deps = getDeps(target, key);
        deps.add(activeEffect);
        // 用于清除依赖
        activeEffect.deps.push(deps);
    }
    /* 特殊的target key ，当target任意key改变时，此依赖也会触发 */
    const targetObserverSymbol = Symbol('target has changed');
    function trackTargetObserver(target) {
        track(target, targetObserverSymbol);
    }
    function triggerTargetObserver(target) {
        trigger(target, targetObserverSymbol);
    }
    function trigger(target, key) {
        // trigger 中会触发target中的依赖
        if (isUndefined(key)) {
            let deps = getDeps(target);
            // 无depsmap
            runDeps(deps);
        }
        else {
            // 任一key内容改变都会触发这一依赖
            if (key !== targetObserverSymbol) { // 防止递归死循环
                triggerTargetObserver(target);
            }
            triggerTargetKey(target, key);
        }
    }
    function triggerAllDepsMap(target) {
        let depsMap = getDepsMap(target);
        for (let [key, deps] of depsMap) {
            runDeps(deps);
        }
    }
    function triggerTargetKey(target, key) {
        let deps = getDeps(target, key);
        // copy 防止死循环
        runDeps(deps);
    }
    function runDeps(deps) {
        [...deps].forEach((dep) => {
            if (isEffect(dep)) {
                if (dep == getActiveEffect()) {
                    return;
                }
                dep.triggerRun();
            }
            else {
                dep();
            }
        });
    }
    //! effect
    const effectStack = [];
    const getActiveEffect = () => effectStack[effectStack.length - 1];
    const setActiveEffect = (effect) => effectStack.push(effect);
    const deleteActiveEffect = () => effectStack.pop();
    function isEffect(value) {
        return value && value["isEffect" /* IS_EFFECT */];
    }
    class ReactiveEffect {
        ["isEffect" /* IS_EFFECT */] = true;
        // 记录副作用依赖了那些变量
        deps = [];
        effectFn;
        scheduler;
        active = false;
        constructor(fn, scheduler) {
            this.effectFn = fn.bind(null);
            this.scheduler = scheduler;
        }
        run() {
            this.active = true;
            setActiveEffect(this);
            this.cleanDeps();
            const result = this.effectFn();
            deleteActiveEffect();
            return result;
        }
        triggerRun() {
            if (this.scheduler) {
                return this.scheduler(this.run.bind(this));
            }
            else {
                return this.run();
            }
        }
        cleanDeps() {
            this.deps.forEach((deps) => {
                deps.delete(this);
            });
            this.deps = [];
        }
    }
    function createReactiveEffect(fn, scheduler) {
        return new ReactiveEffect(fn, scheduler);
    }
    const effect = (fn, options = emptyObject) => {
        var effect = createReactiveEffect(fn, options.scheduler);
        if (!options.lazy) {
            effect.run();
        }
        return effect;
    };

    // global state
    let _isReadonly = false;
    let _isShallow = false;
    let _target;
    let _key;
    const getLastVisitTarget = () => _target;
    const getLastVisitKey = () => _key;
    let _lastSetTarget;
    let _lastSetKey;
    let _lastSetOldValue;
    let _lastSetNewValue;
    const getLastSetTarget = () => _lastSetTarget; // 获取上一个修改的目标
    const getLastSetKey = () => _lastSetKey; // 获取上一个修改的key
    const getLastSetOldValue = () => _lastSetOldValue; // 获取上一个修改前的旧值
    const getLastSetNewValue = () => _lastSetNewValue; // 获取上一个修改后的新值
    const collectionHandlers = {
        get size() {
            //  set , map  size 收集后 ， 只有目标的size变化后才会触发依赖
            //todo bug 任一元素变化后 都会触发该依赖
            trackTargetObserver(_target);
            return _target.size;
        },
        // set weakset
        add(value) {
            if (_isReadonly) {
                return;
            }
            var result = _target.add(value);
            trigger(_target, value);
            // 返回set对象本身
            return result;
        },
        // map set
        clear() {
            if (_isReadonly) {
                return;
            }
            // 触发所有依赖
            _target.clear();
            triggerAllDepsMap(_target);
        },
        // map weakmap set weakset
        delete(key) {
            if (_isReadonly) {
                return;
            }
            const result = _target.delete(key);
            if (result) { // 返回为 true 为删除成功
                trigger(_target, key);
            }
            return result;
        },
        // map set
        entries() {
            trackTargetObserver(_target);
            return _target.entries();
        },
        // map set
        forEach(fn) {
            trackTargetObserver(_target);
            return _target.forEach(fn);
        },
        // set map weakset weakmap
        has(key) {
            track(_target, key);
            return _target.has(key);
        },
        // map set
        keys() {
            trackTargetObserver(_target);
            return _target.keys();
        },
        // map set
        values() {
            trackTargetObserver(_target);
            return _target.values();
        },
        // map weakmap
        set(key, value) {
            if (_isReadonly) {
                return;
            }
            var result = _target.set(key, value);
            trigger(_target, key);
            return result;
        },
        // map weakmap
        get(key) {
            if (!_isReadonly) {
                track(_target, key);
            }
            var value = _target.get(key);
            return _isShallow ? value : reactive(value);
        }
    };
    function normalizeHandlerWithTrack(...args) {
        let result = _target[_key](...args);
        return result;
    }
    function normalizeHandlerWithTrigger(...args) {
        if (_isReadonly) {
            // 只读不能修改
            return;
        }
        // 用数组修改前的key作为触发依赖
        let oldKeys = Object.keys(_target);
        let result = _target[_key](...args);
        [...oldKeys, 'length'].forEach((key) => trigger(_target, key));
        return result;
    }
    const normalizeHandlers = {
        // should track
        includes: normalizeHandlerWithTrack,
        indexOf: normalizeHandlerWithTrack,
        lastIndexOf: normalizeHandlerWithTrack,
        // should trigger
        push: normalizeHandlerWithTrigger,
        pop: normalizeHandlerWithTrigger,
        shift: normalizeHandlerWithTrigger,
        unshift: normalizeHandlerWithTrigger,
        splice: normalizeHandlerWithTrigger
    };
    const specialKeyHandler = {
        [Symbol.iterator]: (value) => {
            // should track ?
            return value.bind(_target);
        }
    };
    // 可用于收集依赖的key
    const isProxyKey = (target, key) => !(key in target) || hasOwn(target, key);
    function createGetter(isReadonly, isShallow, isCollection) {
        return (target, key, receiver) => {
            // cache global state
            _isReadonly = isReadonly;
            _isShallow = isShallow;
            _target = target;
            _key = key;
            // reserved keys
            switch (key) {
                case "raw" /* RAW */:
                    return target;
                case "isReactive" /* IS_REACTIVE */:
                    return !isReadonly;
                case "isShallow" /* IS_SHALLOW */:
                    return isShallow;
                case "isReadonly" /* IS_READONLY */:
                    return isReadonly;
                case ReactiveTypeSymbol:
                    // 所欲响应式数据都会有此标记
                    return true;
            }
            if (isCollection) {
                // collection methods reset
                if (hasOwn(collectionHandlers, key) && key in target) {
                    return collectionHandlers[key];
                }
            }
            else if (isProxyKey(target, key)) {
                // !  可收集属性， 是自身属性时才会收集 , readonly 不会收集
                if (!isReadonly) {
                    track(target, key);
                }
                var value = Reflect.get(target, key, receiver);
                if (isShallow) {
                    //! readonly 和 shallowreadonly 都不会收集 , 直接返回原始值
                    return value;
                }
                return isReadonly ? readonly(value) : reactive(value);
            }
            else if (isArray(target) && hasOwn(normalizeHandlers, key)) {
                // 数组重写方法
                return normalizeHandlers[key];
            }
            var value = Reflect.get(target, key, receiver);
            // 特殊key处理器
            if (hasOwn(specialKeyHandler, key)) {
                value = specialKeyHandler[key](value);
            }
            return value;
        };
    }
    const onSetCallbacks = new Set();
    // 注册一个回调函数，当响应式的值改变后触发回掉 => 参数 ： target，key ， newValue ， oldValue
    function onSet(cb) {
        onSetCallbacks.add(cb);
        return () => onSetCallbacks.delete(cb);
    }
    function createSetter(isReadonly = false, isShallow = false) {
        return (target, key, newValue, receiver) => {
            // 返回 false 时会报错
            if (isReadonly) {
                warn(`${target} is readonly`);
                return true;
            }
            if (isProxyKey(target, key)) {
                // 不允许设置非自身属性
                let oldValue = Reflect.get(target, key, receiver);
                _lastSetTarget = target;
                _lastSetKey = key;
                /* 当旧值是一个对象，但变成了基本类型后，则视为一次解绑 */
                _lastSetOldValue = oldValue;
                _lastSetNewValue = newValue;
                onSetCallbacks.forEach((cb) => cb(target, key, newValue, oldValue));
                Reflect.set(target, key, newValue, receiver);
                trigger(target, key);
            }
            return true;
        };
    }
    function has(target, key) {
        /*
            has 包括非自身的key
            ? in target
        */
        if (hasOwn(target, key)) {
            // has 的收集 ， 只有在key删除时才会触发 
            //! bug 使用 with 访问值时会先进入has 在进入get
            track(target, key);
        }
        return Reflect.has(target, key);
    }
    function ownKeys(target) {
        /*
            for ? in target
        */
        // Object.assign will call this
        return Reflect.ownKeys(target);
    }
    function deleteProperty(target, key) {
        // 为 true 表示删除成功
        const isOwn = hasOwn(target, key);
        const result = Reflect.deleteProperty(target, key);
        if (result && isOwn) {
            trigger(target, key);
        }
        return result;
    }
    function readonlyDeleteProperty(target, key) {
        warn(`${key} in `, target, ` can't delete`);
        return true;
    }
    // object handlers
    const reactiveHandler = {
        get: createGetter(false, false, false),
        set: createSetter(false, false),
        ownKeys,
        deleteProperty,
        has
    };
    const shallowReactiveHandler = {
        get: createGetter(false, true, false),
        set: createSetter(false, true),
        ownKeys,
        deleteProperty,
        has
    };
    const readonlyHandler = {
        get: createGetter(true, false, false),
        set: createSetter(true, false),
        deleteProperty: readonlyDeleteProperty
    };
    const shallowReadonlyHandler = {
        get: createGetter(true, true, false),
        set: createSetter(true, true),
        deleteProperty: readonlyDeleteProperty
    };
    // collection handlers
    const reactiveCollectionHandler = {
        get: createGetter(false, false, true)
    };
    const readonlyCollectionHandler = {
        get: createGetter(true, false, true)
    };
    const shallowReactiveCollectionHandler = {
        get: createGetter(false, true, true)
    };
    const shallowReadonlyCollectionHandler = {
        get: createGetter(true, true, true)
    };
    /*
        todo
        shallowReactiveDeepReadonly
        shallowReadonlyDeepReactive
    */

    const createReactiveObject = (value) => new Proxy(value, reactiveHandler);
    const createReadonlyObject = (value) => new Proxy(value, readonlyHandler);
    const createShallowReactiveObject = (value) => new Proxy(value, shallowReactiveHandler);
    const createShallowReadonlyObject = (value) => new Proxy(value, shallowReadonlyHandler);
    const createReactiveCollection = (value) => new Proxy(value, reactiveCollectionHandler);
    const createReadonlyCollection = (value) => new Proxy(value, readonlyCollectionHandler);
    const createShallowReactiveCollection = (value) => new Proxy(value, shallowReactiveCollectionHandler);
    const createShallowReadonlyCollection = (value) => new Proxy(value, shallowReadonlyCollectionHandler);
    function createProxy(value, isReadonly, isShallow) {
        //! 如果 已经代理过，返回原始值
        if (isProxy(value)) {
            return value;
        }
        switch (typeOf(value)) {
            case exports.ReactiveTypes.OBJECT:
            case exports.ReactiveTypes.ARRAY:
                return isReadonly ?
                    (isShallow ? createShallowReadonlyObject(value) : createReadonlyObject(value)) :
                    (isShallow ? createShallowReactiveObject(value) : createReactiveObject(value));
            case exports.ReactiveTypes.MAP:
            case exports.ReactiveTypes.WEAK_MAP:
            case exports.ReactiveTypes.SET:
            case exports.ReactiveTypes.WEAK_SET:
                return isReadonly ?
                    (isShallow ? createShallowReadonlyCollection(value) : createReadonlyCollection(value)) :
                    (isShallow ? createShallowReactiveCollection(value) : createReactiveCollection(value));
            default:
                return value;
        }
    }
    function reactive(value) {
        return createProxy(value, false, false);
    }
    function shallowReactive(value) {
        return createProxy(value, false, true);
    }
    function readonly(value) {
        return createProxy(value, true, false);
    }
    function shallowReadonly(value) {
        return createProxy(value, true, true);
    }

    const ref = (value, options) => new Ref(value, options);
    const createRefValueSetter = (ref) => (newValue) => ref.value = newValue;
    class Ref {
        [ReactiveTypeSymbol] = true;
        ["isRef" /* IS_REF */] = true;
        oldValue; // 保存旧值
        _value;
        sensitive;
        shallow;
        constructor(value, options = emptyObject) {
            this.sensitive = options.sensitive;
            this.shallow = options.shallow;
            this._value = value;
        }
        get value() {
            // track
            track(this);
            let value = this._value;
            return (!this.shallow && isProxyType(value)) ? reactive(value) : value;
        }
        set value(newValue) {
            // 当 sensitive ，为true时 ， 当值试图从一个值变为另一个相同的值时，即使基本类型或引用类型全等，也会视为一次改变，触发依赖
            if (this._value === newValue && !this.sensitive) {
                return;
            }
            this.oldValue = this._value;
            this._value = newValue;
            // trigger
            trigger(this);
        }
    }
    // 清除所有与当前ref相关的依赖
    const cleaarRefDeps = (ref) => {
        getDeps(ref).clear();
    };

    const computed = (getter) => new ComputedRef(getter);
    const isComputed = (value) => value && value["isComputed" /* IS_COMPUTED */];
    class ComputedRef {
        [ReactiveTypeSymbol] = true;
        ["isComputed" /* IS_COMPUTED */] = true;
        ["isRef" /* IS_REF */] = true;
        cacheValue;
        oldValue;
        shouldCompute = true;
        computedEffect;
        constructor(getter) {
            this.computedEffect = createReactiveEffect(getter, () => {
                // 依赖的值变化后，触发调度器 , 一个computed依赖的副作用就是它所依赖的值的副作用
                if (!this.shouldCompute) { // 缓存值
                    this.shouldCompute = true;
                    trigger(this);
                }
            });
        }
        get computedValue() {
            this.shouldCompute = false;
            this.oldValue = this.cacheValue;
            return this.cacheValue = this.computedEffect.run();
        }
        get value() {
            track(this);
            return this.shouldCompute ? this.computedValue : this.cacheValue;
        }
    }

    /*
        通问题
        当改变被侦测的数据时，会去执行数据的依赖，但如果依赖中不止有watch注册的回调，还有其他的依赖，并且依赖触发后，依赖中又更改了其他响应式数据的值，这时通过
        获取最近值来传递 watch 的参数不可靠
    */
    //! 回调中能拿到的数据有 改变的key ，改变的新值 ， 改变前的值
    function shallowWatchReactive(data, callback) {
        if (!isReactive(data)) {
            return;
        }
        // 问题？ 新设置的key无法触发依赖，因为没收集
        const rawData = toRaw(data);
        var watchCallbackIsCalling = false, changeKey, changeNewValue, changeOldValue;
        let cb = () => {
            watchCallbackIsCalling = true;
            callback.call(null, changeKey, changeNewValue, changeOldValue);
            watchCallbackIsCalling = false;
        };
        let unSet = onSet((target, key, newValue, oldValue) => {
            if (target === rawData) {
                if (watchCallbackIsCalling) {
                    // callback 中重新设置值会触发死递归
                    error('cant set reactive data value in the watch callback');
                }
                else {
                    // 设置的值是watchdata中的值，并且不是在回调函数中
                    changeKey = key;
                    changeNewValue = newValue;
                    changeOldValue = oldValue;
                }
            }
        });
        const deps = getDeps(rawData, targetObserverSymbol);
        deps.add(cb);
        // unwatch
        return () => {
            unSet();
            deps.delete(cb);
        };
    }
    function watchReactive(reactiveData, callback) {
        if (!isReactive(reactiveData)) {
            return;
        }
        // 问题需要记录子数据脱离绑定的情况
        // 保存当前 watch 的data中存在的所有 target 
        // ! 当侦测一个reactive data时，回调中不应该再设置该属性的值否则会死循环
        const targets = new Set();
        collectTarget(reactiveData);
        function collectTarget(data) {
            if (!isReactive(data)) {
                return;
            }
            targets.add(toRaw(data));
            Object.values(data).forEach(collectTarget);
        }
        // watch的回调函数是否正在调用
        var watchCallbackIsCalling = false, changeTarget, changeKey, changeNewValue, changeOldValue;
        let cb = () => {
            watchCallbackIsCalling = true;
            callback.call(null, changeTarget, changeKey, changeNewValue, changeOldValue);
            watchCallbackIsCalling = false;
        };
        targets.forEach((target) => {
            let deps = getDeps(target, targetObserverSymbol);
            deps.add(cb);
        });
        const unSet = onSet((target, key, newValue, oldValue) => {
            if (targets.has(target)) {
                if (watchCallbackIsCalling) {
                    // callback 中重新设置值会触发死递归
                    error('cant set reactive data value in the watch callback');
                }
                else {
                    // 设置的值是watchdata中的值，并且不是在回调函数中
                    changeTarget = target;
                    changeKey = key;
                    changeNewValue = newValue;
                    changeOldValue = oldValue;
                }
            }
            if (!targets.has(oldValue)) { // 当前更改的值与侦测目标无任何关系
                return;
            }
            // 解绑
            let oldValueDeps = getDeps(oldValue, targetObserverSymbol);
            oldValueDeps.delete(cb);
            targets.delete(oldValue);
            // 增加新绑定值的依赖
            if (targets.has(newValue)) {
                // 此时是将观察对象中的值重新赋值给该对象的身上，不需要添加依赖
                return;
            }
            if (isProxyType(newValue)) {
                let newValueDeps = getDeps(newValue, targetObserverSymbol);
                newValueDeps.add(cb);
                targets.add(newValue);
            }
        });
        // unwatch
        return () => {
            unSet();
            targets.forEach((target) => {
                let deps = getDeps(target, targetObserverSymbol);
                deps.delete(cb);
            });
        };
    }
    // 指定侦测的目标和key值
    function watchTargetKey(reactiveTarget, key, callback) {
        if (!isReactive(reactiveTarget)) {
            return;
        }
        let target = toRaw(reactiveTarget);
        const deps = getDeps(target, key);
        var watchCallbackIsCalling = false, changeNewValue, changeOldValue;
        let cb = () => {
            watchCallbackIsCalling = true;
            callback.call(null, changeNewValue, changeOldValue);
            watchCallbackIsCalling = false;
        };
        const unSet = onSet((_target, _key, newValue, oldValue) => {
            if (_target === target && _key === key) { // 侦听目标的对应key触发了
                if (watchCallbackIsCalling) {
                    // callback 中重新设置值会触发死递归
                    error('cant set reactive data value in the watch callback');
                }
                else {
                    // 设置的值是watchdata中的值，并且不是在回调函数中
                    changeNewValue = newValue;
                    changeOldValue = oldValue;
                }
            }
        });
        deps.add(cb);
        // unwatch
        return () => {
            unSet();
            deps.delete(cb);
        };
    }

    function watchRef(ref, callback) {
        const deps = getDeps(ref);
        const watchEffect = () => callback.call(null, ref.value, ref.oldValue);
        deps.add(watchEffect);
        // unwatch
        if (isComputed(ref)) {
            ref.value;
        }
        return () => deps.delete(watchEffect);
    }

    class ReactiveBoolean extends Ref {
        constructor(value) {
            super(value);
        }
        toggle() {
            return this.value = !this.value;
        }
        toTrue() {
            return this.value = true;
        }
        toFalse() {
            return this.value = false;
        }
    }
    function useBoolean(value = true) {
        return new ReactiveBoolean(value);
    }

    /*
        rbg
        hex
        hsl  // css 中 只能写 %
    */
    const toHex = (num) => num.toString(16);
    const toDec = (num) => parseInt(String(num), 16);
    function rgbToHex() {
    }
    function hexToRgb() {
    }
    const useColor = (color) => new ColorRef(color);
    class ColorRef extends Ref {
        constructor(color) {
            super(color);
        }
    }

    function useDate(...dateArgs) {
        return new DateRef(new Date(...dateArgs));
    }
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    class DateRef extends Ref {
        constructor(date) {
            super(date, { sensitive: true });
        }
        clone() {
            return useDate(this._value); // _value 不会收集依赖
        }
        get(key) {
            return Reflect.get(this, key).call(this);
        }
        year(setYear) {
            if (isUndefined(setYear)) {
                // getter
                return this.value.getFullYear();
            }
            else {
                // 不应该收集依赖
                this._value.setFullYear(Number(setYear));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        month(setMonth) {
            if (isUndefined(setMonth)) {
                // getter
                return this.value.getMonth() + 1;
            }
            else {
                // 不应该收集依赖
                this._value.setMonth(Number(setMonth) - 1);
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        // monthday
        date(setDate) {
            if (isUndefined(setDate)) {
                // getter
                return this.value.getDate();
            }
            else {
                // 不应该收集依赖
                this._value.setDate(Number(setDate));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        // weekday
        day(setDay) {
            if (isUndefined(setDay)) {
                // getter
                return this.value.getDay();
            }
            else {
                debugger;
            }
        }
        hour(setHour) {
            if (isUndefined(setHour)) {
                // getter
                return this.value.getHours();
            }
            else {
                // 不应该收集依赖
                this._value.setHours(Number(setHour));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        minute(setMinutes) {
            if (isUndefined(setMinutes)) {
                // getter
                return this.value.getMinutes();
            }
            else {
                // 不应该收集依赖
                this._value.setMinutes(Number(setMinutes));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        second(setSecond) {
            if (isUndefined(setSecond)) {
                // getter
                return this.value.getSeconds();
            }
            else {
                // 不应该收集依赖
                this._value.setSeconds(Number(setSecond));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        milliSecond(setMilliseconds) {
            if (isUndefined(setMilliseconds)) {
                // getter
                return this.value.getMilliseconds();
            }
            else {
                // 不应该收集依赖
                this._value.setMilliseconds(Number(setMilliseconds));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        format(template, customKeywords = emptyObject) {
            let w = customKeywords.weekdays || weekdays;
            let m = customKeywords.months || months;
            return template.replace(dateFormatRE, (capture) => {
                switch (capture) {
                    case "YYYY" /* YEAR */:
                        return this.year();
                    case "YY" /* YEAR_2D */:
                        return String(this.year()).slice(2);
                    case "M" /* MONTH */:
                        return this.month();
                    case "MM" /* MONTH_2D */:
                        return padZero(this.month());
                    case "MMM" /* MONTH_SHORT_NAME */:
                        return m[this.month() - 1].slice(0, 3);
                    case "MMMM" /* MONTH_FULL_NAME */:
                        return m[this.month() - 1];
                    case "D" /* DATE */:
                        return this.date();
                    case "DD" /* DATE_2D */:
                        return padZero(this.date());
                    case "h" /* HOUR_12 */:
                        // 等于 12 应该是 12 点还是 0 点
                        var hour = this.hour();
                        return hour > 12 ? hour - 12 : hour;
                    case "hh" /* HOUR_12_2D */:
                        var hour = this.hour();
                        return padZero(hour > 12 ? hour - 12 : hour);
                    case "H" /* HOUR_24 */:
                        return this.hour();
                    case "HH" /* HOUR_24_2D */:
                        return padZero(this.hour());
                    case "m" /* MINUTE */:
                        return this.minute();
                    case "mm" /* MINUTE_2D */:
                        return padZero(this.minute());
                    case "s" /* SECOND */:
                        return this.second();
                    case "ss" /* SECOND_2D */:
                        return padZero(this.second());
                    case "SSS" /* MILLISECOND */:
                        return this.milliSecond();
                    case "SS" /* MILLISECOND_10 */:
                        return String(this.milliSecond()).slice(0, 2);
                    case "S" /* MILLISECOND_100 */:
                        return String(this.milliSecond()).slice(0, 1);
                    case "W" /* WEEKDAY */:
                        return this.day();
                    case "WWW" /* WEEKDAY_FULL_NAME */:
                        return w[this.day()];
                    case "WW" /* WEEKDAY_SHORT_NAME */:
                        return w[this.day()].slice(0, 3);
                    default:
                        return '?';
                }
            });
        }
    }
    const dateFormatRE = /Y{1,4}|M{1,4}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|A|a|W{1,3}/g;
    function padZero(source, expectLength = 2) {
        // 期待长度一定要大于目标长度
        return '0'.repeat(expectLength - String(source).length) + source;
    }

    class ReactiveNumber extends Ref {
        constructor(value) {
            super(value);
        }
        plus(value = 1) {
            return this.value += value;
        }
        minus(value = 1) {
            return this.value -= value;
        }
        multiply(value = 1) {
            return this.value *= value;
        }
        devide(value = 1) {
            return this.value /= value;
        }
    }
    function useNumber(value) {
        return new ReactiveNumber(value);
    }

    class ReactiveString extends Ref {
        constructor(value) {
            super(value);
        }
        concat(...values) {
            return this.value.concat(...values);
        }
        padEnd(targetLength, padString) {
            return this.value = this.value.padEnd(targetLength, padString);
        }
    }
    function useString(value = 'hello world') {
        return new ReactiveString(value);
    }

    function usePromise(promise) {
        promise = isPromise(promise) ? promise : new Promise(promise);
        return new PromiseRef(promise);
    }
    class PromiseRef extends Ref {
        resolved = false;
        rejected = false;
        constructor(promise) {
            super(null);
            promise.then((result) => {
                this.value = result;
                this.resolved = true;
            }).catch((err) => {
                this.value = null; //
                this.rejected = true;
            });
        }
    }

    var nextTick = (fn, args = undefined) => {
        var p = Promise.resolve(args);
        p.then(fn.bind(null));
    };
    var queueJobs = new Set();
    function queueJob(job) {
        queueJobs.add(job);
        nextTick(executeQueueJobs);
    }
    function executeQueueJobs() {
        queueJobs.forEach((job) => {
            job();
            queueJobs.delete(job);
        });
    }

    // rendering instance and creating instance
    exports.currentInstance = null;
    function setCurrentInstance(instance) {
        exports.currentInstance = instance;
    }
    function getCurrentInstance() {
        return exports.currentInstance;
    }
    // 清除当前组件引用
    function clearCurrentInstance() {
        exports.currentInstance = null;
    }
    function getCurrentScope() {
        return getCurrentInstance().scope;
    }
    function getCurrentRenderScope() {
        return getCurrentInstance().renderScope;
    }
    function setScopeData(scope, data) {
        if (!data) {
            return;
        }
        if (isObject(data)) {
            for (let key in data) {
                // data 存在时应该警告
                let value = data[key];
                // 挂载到实例的promise会自动请求
                if (isPromise(value)) {
                    value.then((result) => {
                        scope[key] = result;
                    });
                }
                else {
                    scope[key] = value;
                }
            }
        }
        else if (isPromise(data)) {
            // async create
            data.then((result) => {
                setScopeData(scope, result);
            });
        }
    }
    function mountComponent(vnode, container, anchor, parent) {
        const instance = createComponentInstance(vnode.type, parent);
        vnode.instance = instance;
        instance.componentVnode = vnode;
        const { scope, renderScope } = instance;
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        // create
        setCurrentInstance(instance);
        // 初次创建前应该把 slot props 方法等挂载到作用域上
        // 先挂载props ，这样 create hook中才能访问
        mountComponentProps(instance, vnode.props);
        instance.slots = vnode.children;
        instance.props = vnode.props;
        // 处理mixins中的create钩子 ，rootCreate后处理 ，优先级更高 , 在处理props后处理，保证钩子中能访问到props等数据
        const createResults = callHook("create" /* CREATE */, instance, { binding: scope }, scope);
        // 注入 mixins 状态
        createResults?.forEach((data) => setScopeData(scope, data));
        // 组件根初始化方法
        /*
            render 优先级
            create 返回的渲染函数  > render > template , 暂时不支持无状态组件
        */
        let render = instance.render ? instance.render.bind(renderScope) : instance.createRender ? instance.createRender(renderMethods) : emptyFunction;
        instance.render = render;
        setCurrentInstance(null);
        processHook("created" /* CREATED */, vnode);
        // component update
        // component update fn
        function update() {
            const { isMounted, vnode: pVnode, beforePatch, componentVnode, updatingComponentVnode, render } = instance;
            // 每次 更新生成新树
            setCurrentInstance(instance);
            let nVnode = render(scope);
            setCurrentInstance(null);
            // 处理树
            let pComponentVnode, nComponentVnode;
            if (updatingComponentVnode) { // 非自更新，两个节点对比更新
                nComponentVnode = updatingComponentVnode;
                pComponentVnode = componentVnode;
                // 把新节点存到实例上
                instance.componentVnode = nComponentVnode;
            }
            else {
                nComponentVnode = componentVnode;
            }
            // 清理vnode 
            instance.updatingComponentVnode = null;
            nVnode = processVnodePrerender(nVnode);
            instance.renderingVnode = nVnode;
            processHook(isMounted ? "beforeUpdate" /* BEFORE_UPDATE */ : "beforeMount" /* BEFORE_MOUNT */, nComponentVnode, pComponentVnode);
            beforePatch && beforePatch(pVnode, nVnode);
            patch(pVnode, nVnode, container, anchor, instance);
            instance.vnode = nVnode;
            instance.isMounted = true;
            instance.renderingVnode = null;
            processHook(isMounted ? "updated" /* UPDATED */ : "mounted" /* MOUNTED */, nComponentVnode, pComponentVnode);
        }
        instance.update = update;
        const rednerEffect = createReactiveEffect(update, queueJob);
        // 手动渲染
        instance.renderEffect = rednerEffect;
        rednerEffect.run();
        return instance;
    }

    const COMPONENT_TYPE = Symbol('ComponentType');
    function createComponent(type, props, children, key = uid()) {
        let componentFlag = type[COMPONENT_TYPE];
        if (!componentFlag) {
            // stateful component
            if (isObject(type)) {
                componentFlag = 14 /* COMPONENT */;
                resolveOptions(type);
            }
            else if (isFunction(type)) {
                // render component
                componentFlag = 15 /* RENDER_COMPONENT */;
            }
            mark(type, COMPONENT_TYPE, componentFlag);
        }
        return {
            uid: uid(),
            nodeType: componentFlag,
            type,
            props: normalizeProps(props),
            children,
            key
        };
    }
    function createElement(type, props, children, key = uid()) {
        return {
            nodeType: 13 /* HTML_ELEMENT */,
            type,
            props: normalizeProps(props),
            children,
            key
        };
    }
    function createSVGElement(type, props, children, key = uid()) {
        return {
            nodeType: 9 /* SVG_ELEMENT */,
            type,
            props: normalizeProps(props),
            children,
            key
        };
    }
    const Text = Symbol('Text');
    // the key is for other node
    function createText(children, key = uid()) {
        return {
            nodeType: 12 /* TEXT */,
            children,
            key,
            type: Text
        };
    }
    const Comment = Symbol('Comment');
    function createComment(text, key = uid()) {
        return {
            type: Comment,
            nodeType: 10 /* HTML_COMMENT */,
            children: text,
            key
        };
    }
    function createFragment(children, key = uid()) {
        return {
            nodeType: 1 /* FRAGMENT */,
            children,
            key
        };
    }

    var iterableFlag = Symbol.iterator;
    var isIterableData = (data) => !!data[iterableFlag];
    function renderList(data, callee, key) {
        if (!isIterableData(data)) {
            if (isNumber(data)) {
                var from = [];
                for (var j = 0; j < data; j++) {
                    from[j] = j + 1;
                }
                data = from;
            }
            else if (isObject(data)) {
                data = Object.entries(data);
            }
        }
        var i = 0;
        var results = [];
        for (var item of data) {
            var res = isArray(item) ? callee(...item, i) : callee(item, i);
            if (res) {
                results.push(res);
                /* set ukey for diff */
                res.key = key + '_' + i;
                // i++
            }
            i++;
            /*
                需要在循环外部 i++ ，这样保证即使有空元素被排出后，索引位置也是正确的
            */
        }
        return results;
    }

    let textModifiers = {
        lowerCase: (str) => str.toLowerCase(),
        upperCase: (str) => str.toUpperCase(),
    };
    function defineTextModifier(name, handler) {
        textModifiers[name] = handler;
    }
    function display(data, modifier) {
        if (isObject(data) || isArray(data)) {
            data = JSON.stringify(data);
        }
        else {
            data = String(data);
        }
        if (modifier && textModifiers[modifier]) {
            data = textModifiers[modifier](data);
        }
        return data;
    }

    function getComponent(name) {
        let currentInstance = getCurrentInstance();
        if (name === 'self') { // 内部提供的self标签，用于递归自身
            return currentInstance.options;
        }
        let components = currentInstance.components;
        let globalComponents = getCurrentApp().components;
        // 支持组件首字母大写
        var component = components?.[name] || components?.[initialUpperCase(name)] || globalComponents?.[name] || globalComponents?.[initialUpperCase(name)];
        if (!component) {
            error(`cant find component ${name}`);
        }
        return component;
    }
    function getDirective(name) {
        let instancedirectives = getCurrentInstance().directives;
        let appdirectives = getCurrentApp().directives;
        // 支持组件首字母大写
        var directive = instancedirectives?.[name] || instancedirectives?.[initialUpperCase(name)] || appdirectives?.[name] || appdirectives?.[initialUpperCase(name)];
        if (!directive) {
            error(`can't find directive ${name}`);
        }
        return directive;
    }

    /*
        examples
        x => scope.x
        x + y
        x.y

    */
    function setScope(variable, scope) {
        return scope + '.' + variable;
    }
    function createExpression(content, isStatic = false) {
        return {
            content,
            isStatic
        };
    }
    const extractString = /(['"])[^\1]*\1/g;
    function extractStringTokens(exp) {
        let tokens = [], cursor = 0, token;
        while (token = extractString.exec(exp)) {
            let str = token[0];
            let length = str.length;
            let index = token.index;
            if (token.index > cursor) {
                tokens.push(createExpression(exp.slice(cursor, index)));
            }
            tokens.push(createExpression(str, true));
            cursor = index + length;
        }
        if (cursor < exp.length) {
            tokens.push(createExpression(exp.slice(cursor, exp.length)));
        }
        return tokens;
    }
    const variableRE = /[\$_a-zA-Z][a-zA-Z0-9]*/g;
    function replaceVariable(expression, scope) {
        return expression.replace(variableRE, (variable) => {
            return setScope(variable, scope);
        });
    }
    function expressionTokensToResult(expressions, scope, stepsIndex) {
        return expressions.reduce((result, { content, isStatic }) => {
            return result + (isStatic ? content : withScope(content, scope, stepsIndex));
        }, '');
    }
    function withScope(expression, scope = 'Crush', stepsIndex = 0) {
        switch (stepsIndex) {
            case 0 /* START */:
                return withScope(expression, scope, stepsIndex + 1);
            case 1 /* PROCESS_STRING */:
                let stringTokens = extractStringTokens(expression);
                return expressionTokensToResult(stringTokens, scope, stepsIndex + 1);
            case 2 /* REPLACE_VARIABLE */:
                return replaceVariable(expression, scope);
        }
        return '';
    }
    // 提取一段表达式中的所有变量
    function extractExpressionVariables(expression) {
        expression = expression.trim();
        let firstLetter = expression[0]; // 第一个字符
        if (firstLetter === "'" || firstLetter === '"') { // 普通字符串
            expression.indexOf(firstLetter, 1);
        }
    }

    const NULL = 'null';
    const toBackQuotes = (_) => '`' + _ + '`';
    const toSingleQuotes = (_) => "'" + _ + "'";
    /*  use JSON.stringify will fill the " in every propertynames */
    const objectStringify = (target) => {
        return '{' +
            Object.entries(target).map(([property, value]) => {
                return property + ':' + (isObject(value) ? objectStringify(value) : isArray(value) ? toArray(value) : value);
            }).join(',')
            + '}';
    };
    const stringify = (target) => {
        if (isString(target)) {
            return target;
        }
        else if (isArray(target)) {
            return `[${target.map(stringify).join(',')}]`;
        }
        else if (isObject(target)) {
            return '{' +
                Object.entries(target).map(([property, value]) => {
                    return property + ':' + stringify(value);
                }).join(',')
                + '}';
        }
        else {
            return String(target);
        }
    };
    const toArrowFunction = (returned, ...params) => {
        return `(${params.join(',')})=>(${returned})`;
    };
    /* to ternary expression */
    const toTernaryExp = (condition, ifTrue, ifFalse) => `${condition}?${ifTrue}:${ifFalse}`;
    const toArray = (items) => `[${items.join(',')}]`;
    const dynamicMapKey = (key) => `[${key}]`;
    const callFn = (fnName, ...params) => `${fnName}(${params.join(',')})`;
    const ternaryExp = (condition, ifTrue, ifFalse) => `${condition}?(${ifTrue}):(${ifFalse})`;
    function ternaryChains(conditions, returns, falseDefault = 'undefined', index = 0) {
        return ternaryExp(conditions[index], returns[index], index < conditions.length - 1 ? ternaryChains(conditions, returns, falseDefault, ++index) : (returns[index + 1] || falseDefault));
    }
    const destructur = (target) => `...${target}`;
    var declare = (name, value) => `const ${name} = ${value} ;`;
    const toReservedProp = (prop) => `_${prop}`;

    const createScanner = (source) => new Scanner(source);
    // operate the string template
    class Scanner {
        source = '';
        constructor(source) {
            this.source = source.trim();
        }
        move(step) {
            this.source = this.source.slice(step).trimLeft();
        }
        at(index) {
            return this.source[index];
        }
        expect(expect, index = 0) {
            return this.source.slice(index, expect.length + index) === expect;
        }
        startsWith(expect) {
            // same as use expect without the second arg
            return this.source.startsWith(expect);
        }
        indexOf(target) {
            return this.source.indexOf(target);
        }
        exec(extractor) {
            var res = exec(this.source, extractor);
            if (!res) {
                return null;
            }
            else {
                var [_, ...groups] = res;
                this.move(_.length);
                return groups;
            }
        }
    }

    const openTagRE = /^<([\w-]+)(?:\.([\w\.]+))?/;
    var closeTagRE = /^<\/([\w-]+)(?:\.[\w\.]+)?\s*>/;
    const htmlCommentRE = /<!--((.|[\r\n])*?)-->/;
    const attributeRE = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/;
    var textEndsWithTag = /([\s\S]*?)<(\/?)[\w-]+/;
    function baseParseHTML(template) {
        var scanner = createScanner(template);
        var ast = [], attributes, rawAttributeMap, inOpen, tag, modifiers;
        while (scanner.source) {
            if (scanner.startsWith('<')) {
                if (scanner.at(1) === '/') {
                    // tag close
                    var exRes = scanner.exec(closeTagRE);
                    var closeTag = exRes[0];
                    for (let i = ast.length - 1; i >= 0; i--) {
                        if (ast[i].closed)
                            continue;
                        if (ast[i].tag === closeTag) {
                            ast[i].closed = true;
                            var children = ast.splice(i + 1);
                            if (children.length) {
                                ast[i].children = children;
                            }
                            break;
                        }
                    }
                }
                else if (scanner.at(1) === '!') {
                    var exRes = scanner.exec(htmlCommentRE);
                    ast.push({
                        tag: '!',
                        children: exRes[0]
                    });
                }
                else {
                    var exRes = scanner.exec(openTagRE);
                    tag = exRes[0];
                    modifiers = exRes[1];
                    inOpen = true;
                }
            }
            else if (inOpen) {
                if (scanner.startsWith('/')) {
                    scanner.move(1); // ignore
                }
                else if (scanner.startsWith('>')) {
                    // open tag close
                    ast.push({
                        tag,
                        closed: false,
                        attributes,
                        rawAttributeMap,
                        children: null,
                        modifiers: modifiers && modifiers.split(':')
                    });
                    tag = null;
                    modifiers = null;
                    attributes = null;
                    rawAttributeMap = null;
                    inOpen = false;
                    scanner.move(1);
                }
                else {
                    /* catch attribute */
                    var exRes = scanner.exec(attributeRE);
                    var attribute = exRes[0];
                    var value = exRes[2];
                    (attributes ||= []).push({ attribute, value });
                    (rawAttributeMap ||= {})[attribute] = value;
                }
            }
            else {
                var textToken, text;
                if ((textToken = textEndsWithTag.exec(scanner.source))) {
                    text = textToken[1];
                    scanner.move(text.length);
                }
                else {
                    // text为结尾 , 直接读取所有内容，并清空
                    text = scanner.source;
                    scanner.source = '';
                }
                ast.push({
                    tag: '',
                    children: text.trim()
                });
            }
        }
        return ast;
    }

    /*
        input nodeType return nodeKeyword
        input nodeKeyword return nodeType
    */
    exports.NodesMap = void 0;
    (function (NodesMap) {
        NodesMap[NodesMap["if"] = 3] = "if";
        NodesMap[NodesMap["elseIf"] = 4] = "elseIf";
        NodesMap[NodesMap["else"] = 5] = "else";
        NodesMap[NodesMap["for"] = 6] = "for";
        NodesMap[NodesMap["slot"] = 35] = "slot";
        NodesMap[NodesMap["outlet"] = 36] = "outlet";
        NodesMap[NodesMap["..."] = 30] = "...";
        NodesMap[NodesMap["@"] = 21] = "@";
        NodesMap[NodesMap["--"] = 32] = "--";
        NodesMap[NodesMap["media"] = 22] = "media";
        NodesMap[NodesMap["keyframes"] = 24] = "keyframes";
        NodesMap[NodesMap["supports"] = 23] = "supports";
        NodesMap[NodesMap["style"] = 17] = "style";
        NodesMap[NodesMap["class"] = 18] = "class";
        NodesMap[NodesMap["template"] = 2] = "template";
        NodesMap[NodesMap["element"] = 11] = "element";
        NodesMap[NodesMap["component"] = 16] = "component";
        NodesMap[NodesMap["model"] = 37] = "model";
    })(exports.NodesMap || (exports.NodesMap = {}));
    function keyOf(nodeType) {
        return exports.NodesMap[nodeType];
    }

    const HTML_TAGS = 'html,body,base,head,link,meta,title,address,article,aside,footer,' +
        'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' +
        'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
        'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' +
        'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
        'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
        'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
        'option,output,progress,select,textarea,details,dialog,menu,' +
        'summary,template,blockquote,iframe,tfoot,area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
    const isHTMLTag = makeMap(HTML_TAGS);
    const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
        'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
        'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
        'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
        'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
        'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
        'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
        'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
        'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
        'text,textPath,title,tspan,unknown,use,view';
    const isSVGTag = makeMap(SVG_TAGS);

    const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/;
    function parseIterator(expression) {
        const [_, items, iterable] = extIteratorExp.exec(expression);
        return {
            iterable,
            items: items.split(',')
        };
    }

    var mustache = /\{\{(.*?)\}\}/g;
    var parseText = (text) => {
        var texts = [];
        var cursor = 0;
        var execArr;
        while (execArr = mustache.exec(text)) {
            if (execArr.index > cursor) {
                texts.push({
                    content: text.slice(cursor, execArr.index),
                    isDynamic: false
                });
            }
            if (execArr[1]) {
                let exp = execArr[1].trim();
                var content, modifier;
                if (exp.startsWith('@')) {
                    // 使用修饰非一定要用一个空格作为分隔
                    let firstWhitespace = exp.indexOf(' ');
                    modifier = exp.slice(1, firstWhitespace);
                    content = exp.slice(firstWhitespace);
                }
                else {
                    content = exp;
                }
                texts.push({
                    modifier,
                    content,
                    isDynamic: true
                });
            }
            cursor = execArr[0].length + execArr.index;
        }
        if (cursor < text.length) {
            texts.push({
                content: text.slice(cursor),
                isDynamic: false
            });
        }
        return texts;
    };

    // we can use $(exp) as a dynamic content
    var extractDynamicSelector = /\$\(([^\)s]*)\)/g;
    function parseSelector(selector) {
        var isDynamic = false;
        return {
            selectorText: selector.replace(extractDynamicSelector, (_, content) => {
                isDynamic = true;
                return '${' + content + '}';
            }),
            isDynamic
        };
    }

    // arguments , filters , modifiers
    const attributeModifierRE = /(?::([\w:]+))?(?:\|([\w\|]+))?(?:\.([\w\.]+))?/;
    const AttributeFlags = [
        '$--',
        '--',
        '...',
        '$',
        '@',
        '#',
        '.' // class shorthand
    ];
    const AttributeEndFlags = [
        '!' // important css property
    ];
    const staticAttributeNameRE = /[\w-]+/;
    // both for html attribute and css declaration
    function parseAttribute(attr) {
        let { attribute, value } = attr;
        let flag, endFlag;
        // 提取开始标志
        for (let _flag of AttributeFlags) {
            if (attribute.startsWith(_flag)) {
                flag = _flag;
                attribute = attribute.slice(_flag.length);
                break;
            }
        }
        // 提取结尾标志
        for (let _flag of AttributeEndFlags) {
            if (attribute.endsWith(_flag)) {
                endFlag = _flag;
                attribute = attribute.slice(0, attribute.length - _flag.length - 1);
                break;
            }
        }
        let isDynamicProperty, property, _arguments, filters, modifiers;
        if (attribute.startsWith('(')) {
            let lastIndexOfBorder = attribute.lastIndexOf(')');
            property = attribute.slice(1, lastIndexOfBorder);
            isDynamicProperty = true;
            let argumentsAndModifiers = attribute.slice(lastIndexOfBorder + 1); // 防止内部表达式太复杂解析出错
            var tokens = attributeModifierRE.exec(argumentsAndModifiers);
            let [_, __arguments, _modifiers] = tokens;
            _arguments = __arguments && __arguments.split(':');
            modifiers = _modifiers && _modifiers.split('.');
        }
        else {
            isDynamicProperty = false;
            // 非动态属性， 先提取出 属性名称
            property = staticAttributeNameRE.exec(attribute)[0];
            var tokens = attributeModifierRE.exec(attribute.slice(property?.length));
            let [_, __arguments, _filters, _modifiers] = tokens;
            _arguments = __arguments && __arguments.split(':');
            filters = _filters && _filters.split('|');
            modifiers = _modifiers && _modifiers.split('.');
        }
        attr.isBooleanProperty = isUndefined(value);
        attr.isDynamicProperty = isDynamicProperty;
        attr.isDynamicValue = flag === '$';
        attr._arguments = _arguments;
        attr.modifiers = modifiers;
        attr.filters = filters;
        attr.property = attr.isDynamicProperty ? property : camelize(property);
        attr.value = value;
        attr.flag = flag;
        attr.endFlag = endFlag;
        return attr;
    }

    const selectorRE = /^([^{};]*)(?<!\s)\s*{/;
    const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/;
    const AtGroupRuleRE = /^@([\w]+)(\s*[^{]+)?{/;
    const AtLineRuleRE = /^@([\w]+)\s*([\w]+)\s*;/;
    const mixinRE = /\.\.\.([^;]+);/;
    const CSSDir = /^([\w-]+)\s*(?:\(([^{]*)\))?\s*{/;
    /*
        判断是否已保留字开头，来决定是否为指令，不需要再用 '--' 标识
    */
    const cssReservedWord = /^(if|else-if|else|for|elseIf)/;
    const parseCSS = (source) => {
        var scanner = createScanner(source);
        var ast = [], // 存储编译结果
        stack = [], // 保留层级结构
        exResult, // 尝试捕获
        current, parent = null, closing = false, declarationGroup;
        while (scanner.source) {
            if (scanner.startsWith('}')) {
                closing = true;
            }
            else if (scanner.startsWith('@')) {
                /*
                    一个 at-rule 是一个CSS 语句，以 at 符号开头， '@'  后跟一个标识符，并包括直到下一个分号的所有内容， 或下一个 CSS 块，以先到者为准。 --mdn
                */
                let groupPosition = scanner.indexOf('{');
                let linePosition = scanner.indexOf(';');
                if (groupPosition > linePosition) {
                    // line at rule
                    scanner.exec(AtLineRuleRE);
                    // todo
                }
                else {
                    // group at rule
                    const [key, content] = scanner.exec(AtGroupRuleRE);
                    switch (key) {
                        case 'media':
                            current = {
                                type: 22 /* MEDIA_RULE */,
                                media: content
                            };
                            break;
                        case 'keyframes':
                            current = {
                                type: 24 /* KEYFRAMES_RULE */,
                                keyframes: content
                            };
                            break;
                        case 'supports':
                            current = {
                                type: 23 /* SUPPORTS_RULE */,
                                keyframes: content
                            };
                            break;
                        case 'screens':
                            // 转换为动态 media
                            current = {
                                type: 22 /* MEDIA_RULE */,
                                media: content.trim(),
                                appConfigMedia: true // 使用应用配置
                            };
                            break;
                        default:
                            debugger;
                            break;
                    }
                }
            }
            else if (scanner.expect('/*')) ;
            else if (scanner.startsWith('...')) {
                var [mixin] = scanner.exec(mixinRE);
                var m = {
                    type: 30 /* MIXIN */,
                    mixin
                };
                (declarationGroup ||= []).push(m);
                continue;
            }
            else if (cssReservedWord.test(scanner.source)) {
                /*
                    处理指令，指令不再需要通过标识符去判断
                */
                var [dir, content] = scanner.exec(CSSDir);
                switch (dir) {
                    case 'for':
                        current = {
                            type: 6 /* FOR */,
                            iterator: parseIterator(content)
                        };
                        break;
                    case 'if':
                        current = {
                            type: 3 /* IF */,
                            condition: content,
                            isBranchStart: true
                        };
                        break;
                    case 'else-if':
                    case 'elseIf':
                        current = {
                            type: 4 /* ELSE_IF */,
                            condition: content,
                            isBranch: true
                        };
                        break;
                    case 'else':
                        current = {
                            type: 5 /* ELSE */,
                            isBranch: true
                        };
                        break;
                }
            }
            else if (exResult = scanner.exec(selectorRE)) {
                /*
                    try to get the selector
                */
                current = {
                    type: 26 /* STYLE_RULE */,
                    selector: parseSelector(exResult[0])
                };
            }
            else if (exResult = scanner.exec(declarationRE)) {
                /*
                    the last declaration must end with  " ; "
                */
                var declaration = parseAttribute({ attribute: exResult[0], value: exResult[1] });
                var { property, flag, endFlag } = declaration;
                if (flag === '$') {
                    declaration.isDynamicValue = true;
                }
                else if (flag === '$--') {
                    declaration.isDynamicValue = true;
                    declaration.property = '--' + property;
                    declaration.illegalKey = true;
                }
                else if (flag === '--') {
                    declaration.property = '--' + property;
                    declaration.illegalKey = true;
                }
                //! important
                declaration.isImportant = endFlag === '!';
                (declarationGroup ||= []).push({
                    declaration,
                    type: 29 /* DECLARATION */
                });
                continue;
            }
            else {
                /* error */
                debugger;
            }
            /* process the relation , with cascading struct */
            if (declarationGroup) {
                var asb = { type: 28 /* DECLARATION_GROUP */ };
                asb.children = declarationGroup;
                asb.parent = parent;
                (parent.children ||= []).push(asb);
                declarationGroup = null;
            }
            if (closing) {
                stack.pop();
                parent = stack[stack.length - 1];
                scanner.move(1);
                closing = false;
                continue;
            }
            if (!parent) {
                // while there is no parent , the currentDeclaration is meaningless
                ast.push(current);
            }
            else {
                var children = parent.children ||= [];
                current.parent = parent;
                children.push(current);
            }
            stack.push(current);
            parent = current;
        }
        return ast;
    };

    /*
        extend the selectors and process keyframes
    */
    const processRules = (rules, isKeyframe = false) => {
        rules.forEach((rule) => {
            switch (rule.type) {
                case 26 /* STYLE_RULE */:
                    const { selector, parent } = rule;
                    if (isKeyframe) {
                        rule.type = 27 /* KEYFRAME_RULE */;
                    }
                    else {
                        var extendSelectors = parent?.selectors;
                        if (extendSelectors) {
                            rule.selectors = [...extendSelectors, selector];
                        }
                        else {
                            rule.selectors = [selector];
                        }
                    }
                    break;
                case 3 /* IF */:
                case 4 /* ELSE_IF */:
                case 5 /* ELSE */:
                case 6 /* FOR */:
                case 22 /* MEDIA_RULE */:
                case 23 /* SUPPORTS_RULE */:
                    rule.selectors = rule.parent?.selectors;
                    break;
                case 24 /* KEYFRAMES_RULE */:
                    isKeyframe = true;
                    break;
            }
            if (rule.children) {
                processRules(rule.children, isKeyframe);
            }
        });
    };

    // legal variable name
    var varRE = /^\w+$/;
    // arrow function
    var arrowFnRE = /\(?[\w,\s]*\)?\s*=>\s*.*/;
    // normal function
    var fnRE = /function[\w\s]*\([\w,\s]*\)\s*{.*}/;
    // array
    var arrayRE = /\[.*\]/;
    function isHandler(exp) {
        return varRE.test(exp) || arrowFnRE.test(exp) || fnRE.test(exp) || arrayRE.test(exp);
    }
    const builtInTags = {
        ''(ast) {
            ast.type = 12 /* TEXT */;
            ast.children = parseText(ast.children);
            ast.ignoreChildren = true;
        },
        '!'(ast) {
            ast.type = 10 /* HTML_COMMENT */;
            ast.ignoreChildren = true;
        },
        if(ast) {
            ast.type = 3 /* IF */;
            ast.condition = ast.rawAttributeMap.condition;
            ast.isBranchStart = true;
        },
        elseIf(ast) {
            ast.type = 4 /* ELSE_IF */;
            ast.condition = ast.rawAttributeMap.condition;
            ast.isBranch = true;
        },
        else(ast) {
            ast.type = 5 /* ELSE */;
            ast.isBranch = true;
        },
        for(ast) {
            ast.type = 6 /* FOR */;
            ast.iterator = parseIterator(ast.rawAttributeMap.iterator);
        },
        template(ast) {
            ast.type = 2 /* TEMPLATE */;
        },
        fragment(ast) {
            ast.type = 2 /* TEMPLATE */;
        },
        // ! 新策略 slot 标签用于使用插槽 ， slot指令用于定义插槽
        slot(ast) {
            ast.type = 35 /* SLOT */;
            // 插槽名称支持动态， 作用域不支持动态
            // ! slot need : slotName , isDynamicSlot 
            ast.type = 35 /* SLOT */;
            let name = ast?.attributeMap?.name;
            if (name) {
                name.type = 39 /* SKIP */; // 该属性跳过
                ast.slotName = name.value;
                ast.isDynamicSlot = name.isDynamicValue;
            }
            else {
                ast.slotName = 'default';
                ast.isDynamicSlot = false;
            }
        },
        component(ast) {
            ast.type = 16 /* DYNAMIC_COMPONENT */;
            const is = ast.attributeMap.is;
            const { isDynamicValue, value } = is;
            ast.is = value;
            ast.isDynamicIs = isDynamicValue;
            is.type = 39 /* SKIP */;
        },
        element(ast) {
            ast.type = 11 /* DYNAMIC_ELEMENT */;
            const is = ast?.attributeMap?.is;
            if (!is) {
                error('built-in tag <element> need attribute is');
            }
            const { isDynamicValue, value } = is;
            ast.is = value;
            ast.isDynamicIs = isDynamicValue;
            is.type = 39 /* SKIP */;
        },
        style(ast) {
            ast.type = 17 /* STYLE */;
            var template = ast.children?.[0].children;
            if (template) {
                var styleAst = parseCSS(template);
                processRules(styleAst);
                ast.children = styleAst;
            }
            ast.ignoreChildren = true;
        }
    };
    // 由外界注入的指令 ， 还需要额外处理
    const customDirectiveHandlers = {
        model(attribute, ast) {
            let modelType = ast.tag === 'select' ? (hasOwn(ast.rawAttributeMap, 'multiple') ? 'selectMultiple' : 'selectOne') : ast.rawAttributeMap.type || 'text';
            // transform 
            attribute.property = `model${initialUpperCase(modelType)}`;
            ast.attributes.push({
                type: 7 /* ATTRIBUTE */,
                property: '_setter',
                attribute: '_setter',
                value: toArrowFunction(`${attribute.value} = _`, '_'),
                isDynamicValue: true,
                isDynamicProperty: false
            });
        }
    };
    const builtInAttributes = {
        slot(attr, ast) {
            // ! slot 指令用于定义插槽 ， 可用于单个元素和 template （fragment）, 需要定义 slotName 
            /*
                注意当插槽指令作用于插槽标签时，代表当前定义插槽为上一个插槽传递的内容
            */
            attr.type = 39 /* SKIP */;
            // 定义插槽无动态插槽 , 第一个参数为slot的名称
            ast.defineSlotName = attr._arguments?.[0];
            ast.isDynamicDefineSlotName = attr.isDynamicProperty;
            ast.slotScope = attr.value;
        },
        style(attr, ast) {
            attr.type = 17 /* STYLE */;
            // attr.value = attr.isDynamicValue ? attr.value : parseInlineStyle(attr.value)
        },
        class(attr, ast) {
            attr.type = 18 /* CLASS */;
            // attr.value = attr.isDynamicValue ? attr.value : parseInlineClass(attr.value)
        }
    };
    // 支持某些怪异的写法  , 这些属性不会进行解析
    const builtInRawAttributes = {
        if(attr, ast) {
            attr.type = 3 /* IF */;
            const directives = ast.directives ||= [];
            if (!directives.length) { // 为元素的第一个指令
                ast.condition = attr.value;
                ast.isBranchStart = true;
            }
            else {
                directives.push(attr);
            }
        },
        elseIf(attr, ast) {
            attr.type = 4 /* ELSE_IF */;
            if (!ast.directives?.length) {
                ast.isBranch = true;
                ast.condition = attr.value;
            }
        },
        else(attr, ast) {
            attr.type = 5 /* ELSE */;
            ast.isBranch = true;
        },
        for(attr, ast) {
            attr.type = 6 /* FOR */;
            attr.iterator = parseIterator(attr.value);
            (ast.directives ||= []).push(attr);
        },
        text(attr, ast) {
            attr.type = 7 /* ATTRIBUTE */;
            attr.property = 'innerText';
            attr.isDynamicValue = true;
            ast.children = null; // 直接忽略
        },
        html(attr, ast) {
            attr.type = 7 /* ATTRIBUTE */;
            attr.property = 'innerHTML';
            attr.isDynamicValue = true;
            ast.children = null; // 直接忽略
        },
        bind(attr) {
            attr.type = 7 /* ATTRIBUTE */;
            attr.property = attr.attribute;
            attr.isDynamicValue = true; // 不需要$绑定
        },
        _setter: emptyFunction,
        native(attr, ast) {
            if (ast.tagName !== 'style') {
                return;
            }
            // 标记为原生style属性
            // 转换为对应的 innerHTML 即可
            attr.type = 7 /* ATTRIBUTE */;
            attr.property = 'innerHTML';
            attr.value = ast.children[0].children; // use native template
            // 清空style的children
            ast.children = null;
        }
    };
    const builtInEvents = {};
    function processAttribute(ast) {
        var attributes = ast.attributes;
        if (!attributes)
            return;
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            let rawAttributeHandler = builtInRawAttributes[camelize(attribute.attribute)]; // 驼峰化
            if (rawAttributeHandler) {
                rawAttributeHandler(attribute, ast);
            }
            else {
                parseAttribute(attribute);
                let { property, flag, isDynamicProperty } = attribute;
                let attributeMap = ast.attributeMap ||= {};
                attributeMap[property] = attribute;
                if (flag === '@') {
                    // event
                    attribute.type = 25 /* EVENT */;
                    attribute.isHandler = isHandler(attribute.value);
                    if (!isDynamicProperty && builtInEvents[attribute.property]) {
                        // 保留事件
                        builtInEvents[attribute.property](attribute, ast);
                    }
                }
                else if (flag === '--') {
                    // 所有带 -- 一定是外界注入的指令
                    attribute.type = 34 /* CUSTOM_DIRECTIVE */;
                    // 这种形式出现的指令，都会是从外界注入的指令，只不过会出现动态或额外处理等情况
                    const customDirectiveHandler = customDirectiveHandlers[attribute.property];
                    (ast.customDirectives ||= []).push(attribute);
                    if (!isDynamicProperty && customDirectiveHandler) {
                        customDirectiveHandler(attribute, ast);
                    }
                }
                else if (flag === '#') {
                    /*
                        <div #app> </div> => <div #app> </div>
                        <template #header></template> =>  <template slot:header></template>
                        <Hello #app> => ref ??
                    */
                    if (ast.tagName === 'template') {
                        // 模板上的# 会转换为插槽的定义
                        ast.defineSlotName = attribute.property;
                        ast.isDynamicDefineSlotName = attribute.isDynamicProperty;
                        ast.slotScope = attribute.value;
                    }
                    else {
                        attribute.type = 7 /* ATTRIBUTE */;
                        // id 如果是驼峰形式，则在模版中一定是连字符写法 ， 需要转回连字符形式
                        attribute.value = hyphenate(attribute.property);
                        attribute.property = 'id';
                        attribute.isDynamicValue = attribute.isDynamicProperty;
                        attribute.isDynamicProperty = false;
                    }
                }
                else if (flag === '.') {
                    // class shourthand
                    attribute.type = 18 /* CLASS */;
                    attribute.value = attribute.property;
                    attribute.property = 'class';
                    attribute.isDynamicValue = attribute.isDynamicProperty;
                    attribute.isDynamicProperty = false;
                }
                else if (flag === '...') {
                    // bind shorthand
                    attribute.type = 7 /* ATTRIBUTE */;
                    attribute.value = attribute.property;
                    attribute.property = 'bind';
                    attribute.isDynamicValue = true;
                }
                else {
                    // normal property , if for 等也会作为属性出现
                    const attrHandler = builtInAttributes[attribute.property];
                    if (!attrHandler || attribute.isDynamicProperty) {
                        attribute.type = 7 /* ATTRIBUTE */;
                    }
                    else {
                        ast.directives ||= [];
                        attrHandler(attribute, ast);
                    }
                }
            }
        }
    }
    function processAst(ast) {
        if (isArray(ast)) {
            ast.forEach(processAst);
            return;
        }
        const tagName = ast.tagName = camelize(ast.tag);
        let builtInTagHandler = builtInTags[tagName];
        if (!builtInTagHandler) {
            ast.type = isHTMLTag(tagName) ?
                13 /* HTML_ELEMENT */ : isSVGTag(tagName) ?
                9 /* SVG_ELEMENT */ : tagName === 'style' ?
                17 /* STYLE */ : 14 /* COMPONENT */;
        }
        // 处理属性时有时需要拿到标签的节点信息，有些属性在不同的标签上有不同的意义
        processAttribute(ast);
        if (builtInTagHandler) {
            builtInTagHandler(ast);
        }
        if (!ast.ignoreChildren && ast.children) {
            processAst(ast.children);
        }
    }

    // the code Entrance
    const genNodes = (nodes, context) => {
        if (!nodes) {
            return NULL;
        }
        const children = genChildren(nodes, context);
        if (children.length === 0) {
            return 'null';
        }
        else if (children.length === 1) {
            return children[0];
        }
        else {
            return genFragment(stringify(children), context);
        }
    };
    /*
        process if elseIf else branch
    */
    function genChildren(nodes, context) {
        if (!nodes) {
            return [];
        }
        /*
            process the condition branch and the first dir is condition ,
            处理分支时会为if边际上branch start ， elseif else 标记为branch，或者元素的第一个指令为分支
        */
        var children = [];
        var inBranch = false;
        nodes.forEach((node) => {
            /*
                branchstart mean if frgment and if the element has the first directive is if
            */
            if (node.isBranchStart) {
                children.push([node]);
                inBranch = true;
            }
            else if (node.isBranch) {
                if (inBranch) {
                    children[children.length - 1].push(node);
                }
            }
            else {
                children.push(genNode(node, context));
                inBranch = false;
            }
        });
        children = children.map((child) => {
            if (isArray(child)) {
                const branchCondition = child.map((b) => b.condition).filter(Boolean); // 勇于筛除else的condition ， 其他应该在之前就报错
                const branchContent = child.map((b) => genNode(b, context));
                return ternaryChains(branchCondition, branchContent);
            }
            else {
                return child;
            }
        });
        return children;
    }
    const genFor = (target, iterator, context) => context.callRenderFn('renderList', iterator.iterable, toArrowFunction(target, ...iterator.items), uStringId() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */);
    const genIf = (target, condition) => ternaryExp(condition, target, NULL);
    function genForWithFragment(target, iterator, context) {
        return genFragment(genFor(target, iterator, context), context);
    }
    const genDirectives = (target, dirs, context) => {
        /*
            there is no possible to exist else-if or else
        */
        if (!dirs || dirs.length === 0) {
            return target;
        }
        else {
            // from end to start
            var dir = dirs[dirs.length - 1];
            dirs.pop();
            switch (dir.type) {
                case 3 /* IF */:
                    target = genIf(target, dir.value);
                    break;
                case 6 /* FOR */:
                    target = genForWithFragment(target, dir.iterator, context);
                    break;
            }
            return genDirectives(target, dirs, context);
        }
    };
    function genChildrenString(children, context) {
        if (!children)
            return NULL;
        return stringify(genChildren(children, context));
    }
    function genDirs(code, node, context) {
        if (node.customDirectives) {
            code = genCustomDirectives(code, node.customDirectives, context);
        }
        if (node.directives) {
            code = genDirectives(code, node.directives, context);
        }
        return code;
    }
    function genCustomDirectives(code, directives, context) {
        var dirs = directives.map((directive) => {
            var { property, value, isDynamicProperty, _arguments, modifiers, filters } = directive;
            var directive = context.callRenderFn('getDirective', isDynamicProperty ? property : toSingleQuotes(property));
            if (!isDynamicProperty) {
                directive = context.hoistExpression(directive);
            }
            let bindings = {
                directive
            };
            if (value) {
                bindings.value = value;
            }
            if (_arguments) {
                bindings._arguments = _arguments && _arguments.map(toSingleQuotes);
            }
            if (modifiers) {
                bindings.modifiers = modifiers && modifiers.map(toSingleQuotes);
            }
            if (filters) {
                bindings.filters = filters && filters.map(toSingleQuotes);
            }
            return bindings;
        });
        return context.callRenderFn('injectDirectives', code, stringify(dirs));
    }
    function genSlotContent(node, context) {
        var { children } = node;
        /*
            关于插槽的定义 ,
            插槽指令只能 存在子节点的最外一层，并在处理指令时 提升到最外层节点上
            如 <template slot="header" slot-scope="x"> ,
            暂时插槽数量还是固定的，无法通过循环定义多个具名插槽
        */
        if (!children)
            return NULL;
        var _default;
        var slots = {};
        children.forEach((child) => {
            var { defineSlotName, slotScope } = child;
            // 作用域插槽只能在具名插槽上
            if (defineSlotName) {
                slots[defineSlotName] = toArrowFunction(genNode(child, context), slotScope);
            }
            else {
                (_default ||= []).push(child);
            }
        });
        if (_default) {
            // ! 默认插槽不存在作用域插槽
            slots.default = toArrowFunction(genNodes(_default, context));
        }
        return stringify(slots);
    }
    function genNode(node, context) {
        switch (node.type) {
            case 10 /* HTML_COMMENT */:
                return context.callRenderFn('createComment', toBackQuotes(node.children), uid());
            case 3 /* IF */:
            case 4 /* ELSE_IF */:
            case 5 /* ELSE */:
                return genNodes(node.children, context);
            case 6 /* FOR */:
                // use the fragment , cause the iterator will set the u key in each node , 
                return genForWithFragment(genNodes(node.children, context), node.iterator, context);
            case 2 /* TEMPLATE */:
                var code = genNodes(node.children, context);
                // 只有模板上的保留属性会生效
                return genDirectives(code, node.directives, context);
            case 35 /* SLOT */:
                const { slotName, isDynamicSlot, children } = node;
                return context.callRenderFn('renderSlot', isDynamicSlot ? slotName : toBackQuotes(slotName), genProps(node, context), children ? toArrowFunction(genNodes(children, context)) : NULL, uid());
            case 36 /* OUTLET */:
                return genNodes(node.children, context);
            case 11 /* DYNAMIC_ELEMENT */:
                var { is, isDynamicIs } = node;
                var code = context.callRenderFn('createElement', isDynamicIs ? is : toSingleQuotes(is), genProps(node, context), // 正常生成props
                genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 13 /* HTML_ELEMENT */:
                var code = context.callRenderFn('createElement', toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 9 /* SVG_ELEMENT */:
                var code = context.callRenderFn('createSVGElement', toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 16 /* DYNAMIC_COMPONENT */:
                var { is, isDynamicIs } = node;
                var component = context.callRenderFn('getComponent', isDynamicIs ? is : toSingleQuotes(is));
                // 动态组件不会提升
                var props = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn('createComponent', component, props, slots, uStringId());
                code = genDirs(code, node, context);
                return code;
            case 14 /* COMPONENT */:
                var code = context.callRenderFn('getComponent', toBackQuotes(node.tagName));
                var uv = context.hoistExpression(code);
                var props = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn('createComponent', uv, props, slots, uStringId());
                code = genDirs(code, node, context);
                return code;
            case 12 /* TEXT */:
                return genText(node.children, context);
            case 17 /* STYLE */:
                var props = genProps(node, context);
                var code = context.callRenderFn('createStyleSheet', props, stringify(genChildren(node.children, context)), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 26 /* STYLE_RULE */:
                return context.callRenderFn('createStyle', genSelector(node.selectors, context), stringify(genChildren(node.children, context)), uStringId());
            case 22 /* MEDIA_RULE */:
                const rules = stringify(genChildren(node.children, context));
                return context.callRenderFn('createMedia', node.appConfigMedia ? context.callRenderFn('getCustomScreensMedia', toBackQuotes(node.media)) : toBackQuotes(node.media), rules, uStringId());
            case 24 /* KEYFRAMES_RULE */:
                return context.callRenderFn('createKeyframes', toBackQuotes(node.keyframes), stringify(genChildren(node.children, context)), uStringId());
            case 27 /* KEYFRAME_RULE */:
                return context.callRenderFn('createKeyframe', toBackQuotes(node.selector.selectorText), stringify(genChildren(node.children, context)), uStringId());
            case 23 /* SUPPORTS_RULE */:
                return context.callRenderFn('createSupports', toBackQuotes(node.supports), stringify(genChildren(node.children, context)), uStringId());
            case 28 /* DECLARATION_GROUP */:
                return context.callRenderFn('createDeclaration', genDeclartion(node.children, context), uStringId());
        }
    }
    const genFragment = (code, context) => context.callRenderFn('createFragment', code, uStringId());
    const genTextContent = (texts, context) => {
        return texts.map((text) => {
            const { content, isDynamic, modifier } = text;
            return isDynamic ? context.callRenderFn('display', content, toSingleQuotes(modifier)) : toBackQuotes(content);
        }).join('+');
    };
    const genText = (texts, context) => {
        return context.callRenderFn('createText', genTextContent(texts, context));
    };
    function genSelector(selectors, context) {
        /*
            先保留数组形式,再进行处理
        */
        var res = [];
        var lastIsStatic = false;
        selectors.forEach(({ selectorText, isDynamic }) => {
            if (isDynamic) {
                res.push(selectorText);
                lastIsStatic = false;
            }
            else {
                var splitedSelector = splitSelector(selectorText);
                if (lastIsStatic) {
                    res[res.length - 1] = mergeSplitedSelector(res[res.length - 1], splitedSelector);
                }
                else {
                    res.push(splitedSelector);
                }
                lastIsStatic = true;
            }
        });
        var selectorCode = res.map((item) => {
            if (isArray(item)) { // static
                return toBackQuotes(joinSelector(item));
            }
            else { // dynamic
                // scope  
                return toBackQuotes(item);
            }
        });
        return selectorCode.length === 1 ?
            selectorCode[0] :
            context.callRenderFn('mergeSelectors', ...selectorCode);
        //! one dynamic selector will effect all 
    }
    // declaration and mixin
    function genDeclartion(declarationGroup, context) {
        var res = [];
        var lastIsDeclaration = false;
        declarationGroup.forEach((declaration) => {
            if (declaration.type === 30 /* MIXIN */) {
                res.push(declaration.mixin);
                lastIsDeclaration = false;
            }
            else if (declaration.type === 29 /* DECLARATION */) {
                var target;
                if (lastIsDeclaration) {
                    target = res[res.length - 1];
                }
                else {
                    target = {};
                    res.push(target);
                    lastIsDeclaration = true;
                }
                var { property, value, isDynamicProperty, isDynamicValue, isImportant, illegalKey } = declaration.declaration;
                if (isDynamicProperty) {
                    // 动态的key不存在不合法情况
                    property = dynamicMapKey(property);
                }
                else if (illegalKey) {
                    property = dynamicMapKey(toSingleQuotes(property));
                }
                else {
                    property = camelize(property);
                }
                if (!isDynamicValue) {
                    value = toBackQuotes(value);
                }
                if (isImportant) {
                    value = context.callRenderFn('important', value);
                }
                target[property] = value;
            }
        });
        const _res = res.map((item) => {
            if (isObject(item)) {
                return objectStringify(item);
            }
            else {
                return item;
            }
        });
        if (_res.length === 1) {
            return _res[0];
        }
        else {
            return context.callRenderFn('mixin', ..._res);
        }
    }
    function genProps(node, context) {
        const { type, attributes } = node;
        const isComponent = type === 14 /* COMPONENT */;
        if (!attributes) {
            return NULL;
        }
        var props = {};
        attributes.forEach((attr) => {
            switch (attr.type) {
                case 25 /* EVENT */:
                    var { property, isDynamicProperty, value, isHandler, /* if true , just use it , or wrap an arrow function */ _arguments, modifiers } = attr;
                    value ||= property; // 简写形似
                    const handlerKey = isDynamicProperty ?
                        (isComponent ?
                            dynamicMapKey(context.callRenderFn('toEventName', property, stringify(_arguments.map(toBackQuotes)), stringify(modifiers.map(toBackQuotes)))) :
                            dynamicMapKey(context.callRenderFn('toNativeEventName', property, stringify(_arguments.map(toBackQuotes))))) :
                        (isComponent ?
                            toEventName(property, _arguments, modifiers) :
                            toNativeEventName(property, _arguments));
                    var callback = isHandler ? value : toArrowFunction(value, '$'); // 包裹函数都需要传入一个 $ 参数
                    if (modifiers && !isComponent) {
                        callback = context.callRenderFn('withEventModifiers', callback, stringify(modifiers.map(toBackQuotes)));
                    }
                    props[handlerKey] = callback;
                    break;
                case 18 /* CLASS */:
                    var _class = props.class ||= [];
                    _class.push(attr.isDynamicValue ? attr.value : toBackQuotes(attr.value));
                    break;
                case 17 /* STYLE */:
                    var style = props.style ||= [];
                    style.push(attr.isDynamicValue ? attr.value : toBackQuotes(attr.value));
                    break;
                case 7 /* ATTRIBUTE */:
                    // normal attributes
                    var { property, value, isDynamicProperty, isDynamicValue, } = attr;
                    value ||= property; // 简写形式
                    props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toBackQuotes(value);
                    break;
            }
        });
        // merge class , there could be more than one class , 不应该在render函数中使用normalize
        if (props.class) {
            props.class = stringify(props.class);
        }
        if (props.style) {
            props.style = stringify(props.style);
        }
        return stringify(props) === '{}' ? NULL : stringify(props);
    }

    const createFunction = (content, ...params) => new Function(...params, `${content}`);
    class CodeGenerator {
        code;
        methods;
        constructor() {
            this.code = '';
            this.methods = {};
        }
        getCode = () => {
            this.unshift(declare(`{${Object.keys(this.methods).join(',')}}`, 'renderMethods'));
            return this.code;
        };
        push = (code) => this.code += code;
        unshift = (code) => this.code = code + this.code;
        newLine = () => this.code += '\n';
        tab = () => this.code += '\t';
        pushNewLine(code) {
            this.newLine();
            this.push(code);
        }
        // input an expression and hoist to the context , and return the variable name
        hoistExpression(expression) {
            var varname = uVar();
            this.pushNewLine(declare(varname, expression));
            return varname;
        }
        callRenderFn(fn, ...args) {
            this.methods[fn] = true;
            return callFn(fn, ...args);
        }
        setScope() {
        }
    }
    function compile(template) {
        var ast = baseParseHTML(template);
        processAst(ast);
        var context = new CodeGenerator();
        // 初始化所有渲染方法
        // 模板的渲染作用域
        var SCOPE = context.hoistExpression(context.callRenderFn('getCurrentRenderScope'));
        const renderCode = genNodes(ast, context);
        const content = `
        with(${SCOPE}){
            return ${toArrowFunction(renderCode)} // the return function is render function
        }    
    `;
        context.pushNewLine(content);
        var renderFunction = createFunction(context.getCode(), 'renderMethods');
        console.log(renderFunction);
        return renderFunction;
    }

    const inlineStyleDelimiter = /\s*[:;]\s*/;
    function parseInlineStyle(styleString) {
        var chips = styleString.split(inlineStyleDelimiter).filter(Boolean);
        var l = chips.length;
        var styleMap = {};
        while (l) {
            styleMap[camelize(chips[l - 2])] = chips[l - 1];
            l -= 2;
        }
        return styleMap;
    }
    const inlineClassDelimiter = /\s+/;
    const parseInlineClass = (classString) => stringToMap(classString, inlineClassDelimiter);

    // normalized class always will be a map with true value
    function normalizeClass(rawClass) {
        /*
            string
            array
            object
            function : use the return value
        */
        if (isString(rawClass)) {
            return parseInlineClass(rawClass);
        }
        else if (isObject(rawClass)) {
            return rawClass;
        }
        else if (isArray(rawClass)) {
            return extend(...rawClass.map(normalizeClass));
        }
        else if (isFunction(rawClass)) {
            return normalizeClass(rawClass());
        }
        else {
            return emptyObject;
        }
    }

    /*
         always return a map
    */
    function normalizeStyle(style) {
        if (isObject(style)) {
            return style;
        }
        else if (isString(style)) {
            return parseInlineStyle(style);
        }
        else if (isArray(style)) {
            style = style.map(normalizeStyle);
            return extend(...style);
        }
        else if (isFunction(style)) {
            return normalizeStyle(style());
        }
        else {
            return style;
        }
    }

    function renderSlot(name, scope, fallback, key) {
        const instance = getCurrentInstance();
        let slot = instance?.slots?.[name] || fallback;
        if (!slot) {
            return null;
        }
        else {
            slot = slot(scope);
        }
        // 这里返回的一定是单一节点（fragment），不会是数组形式
        slot.key = key; // 唯一插槽节点的key
        return slot;
    }

    var renderMethods = {
        getCurrentRenderScope,
        createComment,
        createSVGElement,
        injectDirectives,
        important,
        getCurrentScope,
        createElement,
        createText,
        renderList,
        createFragment,
        display,
        getDirective,
        getComponent,
        createStyleSheet,
        createStyle,
        createDeclaration,
        createKeyframe,
        createKeyframes,
        createMedia,
        createSupports,
        mixin,
        normalizeClass,
        normalizeStyle,
        createComponent,
        renderSlot,
        mergeSelectors,
        withEventModifiers,
        getCustomScreensMedia
    };

    // if you are using css function with dynamic binding , use camelized function name 
    function toPositiveValue(value) {
        if (isNumber(value)) {
            return value < 0 ? -value : value;
        }
        else {
            return value.startsWith('-') ? value.slice(1) : value;
        }
    }
    function toNegativeValue(value) {
        if (isNumber(value)) {
            return value > 0 ? -value : value;
        }
        else {
            return value.startsWith('-') ? value : '-' + value;
        }
    }
    function toAbsoluteValue(value) {
        if (isNumber(value)) {
            return Math.abs(value);
        }
        else {
            return value.startsWith('-') ? value.slice(1) : value;
        }
    }
    function addUnit(value, unit) {
        return isNumber(value) ? `${value + unit}` : value;
    }
    function rgba(...rgba) {
        return `rgba(${rgba.join(',')})`;
    }
    const rgb = rgba;
    /*
        in normal css , the saturation and lightness need to endwith % , but we support to use number , and auto fill %
    */
    function hsla(h, s, l, a = 1) {
        return `hsla(
        ${h},
        ${addUnit(s, '%')},
        ${addUnit(l, '%')},
        ${a}
        )`;
    }
    const hsl = hsla;
    /*
        var is a keyword in js , use $var instead
        :root{
            --bg:red;
            $--bg2:'blue';
        }
        body{
            background-color:var(--bg);
            $background-color:$var('--bg2');
        }
    */
    function $var(variable) {
        return `var(${variable})`;
    }
    function attr(attrName) {
        return `attr(${attrName})`;
    }
    function calc(exp) {
        return `calc(${exp})`;
    }
    function cubicBezier(x1, y1, x2, y2) {
        return `cubic-bezier(${x1},${y1},${x2},${y2})`;
    }
    // color gradient
    function conicGradient() {
    }
    function linearGradient() {
    }
    function radialGradient() {
    }
    const max = (...items) => `max(${items.join(',')})`;
    const min = (...items) => `min(${items.join(',')})`;
    function rotateY(deg) {
        return `rotateY(${addUnit(deg, 'deg')})`;
    }
    function translateX(t) {
        return `translateX(${t})`;
    }
    function translateY(t) {
        return `translateY(${t})`;
    }
    function translate3d(x, y, z) {
        return `translate3d(${x},${y},${z})`;
    }
    function scale(sx, sy) {
        return 'scale(' + sx + (sy ? `,${sy}` : '') + ')';
    }
    function scale3d(sx, sy, sz) {
        return `scale3d(${sx},${sy},${sz})`;
    }
    function rotate3d(x, y, z, a) {
        return `rotate3d(${x},${y},${z},${addUnit(a, 'deg')})`;
    }
    function rotate(a) {
        return `rotate(${addUnit(a, 'deg')})`;
    }
    function perspective(l) {
        return `perspective(${l})`;
    }
    function skewX(x) {
        return `skewX(${addUnit(x, 'deg')})`;
    }
    function skewY(y) {
        return `skewX(${addUnit(y, 'deg')})`;
    }
    function skew(x, y) {
        return `skew(${addUnit(x, 'deg')},${addUnit(y, 'deg')})`;
    }
    function scaleY(n) {
        return `scaleY(${n})`;
    }
    function scaleX(n) {
        return `scaleX(${n})`;
    }

    // rebuilding
    const groupSelectorDelimiter = /\s*,\s*/;
    const splitSelector = (selector) => selector.split(groupSelectorDelimiter);
    const joinSelector = (splitedSelector) => splitedSelector.join(',');
    function mergeSelector(p, c) {
        var ref = false; // is using & 
        var merged = c.replace('&', () => {
            ref = true;
            return p;
        });
        return ref ? merged : p + ' ' + c; // default merge
    }
    /*
        ['header','footer'] , ['h1','h2'] ===> ['header h1' , 'header h2' , 'footer h1' , 'footer h2']
    */
    function mergeSplitedSelector(parent, children) {
        return parent.map((p) => {
            return children.map((c) => mergeSelector(p, c));
        }).reduce((x, y) => x.concat(y));
    }
    const mergeSplitedSelectors = (...selectors) => selectors.reduce(mergeSplitedSelector);
    const mergeSplitedSelectorsAndJoin = (...selectors) => joinSelector(mergeSplitedSelectors(...selectors));
    function mergeSelectors(...selectors) {
        return mergeSplitedSelectors(...selectors.map(splitSelector)).join(',');
    }

    function keyframes(name, keyframes) {
        return createKeyframes(name, keyframes);
    }
    function keyframe(name, keyframes) {
        return createKeyframe(name, keyframes);
    }
    /*
        comment : ! 66666
    */
    // 手写渲染函数是时 ， 框架内部无法识别新旧dom树中是否为同一节点 ， 所以应该手动传入 唯一id ， 不然都会作为新节点，全部卸载，并全部重新挂载
    function h(type, props, children, key = uid()) {
        if (isObject(type) || isFunction(type)) {
            // 同时支持有状态组件和函数式组件
            if (children && !isObject(children)) {
                children = { default: children };
            }
            return createComponent(type, props, children, key);
        }
        else if (isHTMLTag(type)) {
            return createElement(type, props, children, key);
        }
        else if (isSVGTag(type)) {
            return createSVGElement(type, props, children, key);
        }
        else {
            return null;
        }
    }

    const modelText = {
        created(el, { value, modifiers }, vnode) {
            const { lazy, number, trim, debounce: useDebounce } = modifiers;
            const setter = vnode.props._setter;
            // 设置input初始值
            el.value = value;
            let inputHandler = () => {
                let inputValue = el.value;
                // number 和 trim 不能同时使用 , 空字符串转数字会变为0
                inputValue = inputValue === '' ? '' : number ? toNumber(inputValue) : trim ? inputValue.trim() : inputValue;
                // 标记输入框刚刚输入完毕
                el._inputing = true;
                setter(inputValue);
            };
            if (useDebounce) {
                let debounceNextModifier = modifiers[modifiers.indexOf('debounce') + 1];
                let numberValue = toNumber(debounceNextModifier);
                // 如果是合理地数字
                let wait = isNumber(numberValue) ? numberValue : 500;
                inputHandler = debounce(inputHandler, wait);
            }
            addListener(el, lazy ? 'change' : 'input', inputHandler);
        },
        beforeUpdate(el, { value }) {
            // 由输入框输入引发的更新，不会重新设置输入框的值
            if (el._inputing) {
                el._inputing = false;
            }
            else {
                el.value = value;
            }
        }
    };
    // 多个相同name的input同时出现
    const modelRadio = {
        created(el, { value }, { props: { _setter } }) {
            if (el.value === value) {
                el.checked = true;
            }
            addListener(el, 'change', () => {
                _setter(el.value);
            });
        },
        // data to input
        beforeUpdate(el, { value }) {
            if (el.value === String(value)) {
                el.checked = true;
            }
            else {
                el.checked = false;
            }
        }
    };
    // modelcheckbox dont need setter
    const modelCheckbox = {
        created(el, { value: checked }, vnode) {
            if (!isArray(checked)) {
                return;
            }
            // 设置初始化值
            if (checked.includes(el.value)) {
                el.checked = true;
            }
            addListener(el, 'change', () => {
                if (el.checked) {
                    checked.push(el.value);
                }
                else {
                    removeFromArray(checked, el.value);
                }
            });
        },
        // 数据改变更新视图
        beforeUpdate(el, { value }) {
            el.checked = value.includes(el.value);
        }
    };
    function getSelectedValue(selectEl) {
        let selected = [];
        for (let option of selectEl.options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        return selected;
    }
    function setSelectState(selectEl, selected) {
        for (let option of selectEl.options) {
            option.selected = selected.includes(option.value);
        }
    }
    const modelSelectOne = {
        childrenMounted(el, { value }, { props: { _setter } }) {
            let options = el.options;
            for (let option of options) {
                // options 默认第一个为选中的
                option.selected = option.value === value;
            }
            addListener(el, 'change', () => {
                _setter(el.value);
            });
        },
        beforeUpdate(el, { value }) {
            if (value !== el.value) {
                el.value = value;
            }
        }
    };
    const modelSelectMultiple = {
        childrenMounted(el, { value }, { props: { _setter } }) {
            if (!isArray(value)) {
                return;
            }
            let options = el.options;
            for (let option of options) {
                // options 默认第一个为选中的 , 初始化选中状态
                option.selected = value.includes(option.value);
            }
            addListener(el, 'change', () => {
                _setter(getSelectedValue(el));
            });
        },
        beforeUpdate(el, { value }) {
            setSelectState(el, value);
        }
    };
    // 目前只支持 16 进制
    const modelColor = {
        created(el, { value, modifiers: { lazy } }, vnode) {
            const setter = vnode.props._setter;
            el.value = value;
            addListener(el, lazy ? 'change' : 'input', () => {
                setter(el.value);
            });
        },
        beforeUpdate(el, { value }) {
            el.value = value;
        },
    };
    const modelRange = {
        created(el, { value, modifiers: { lazy } }, { props: { _setter } }) {
            el.value = value;
            addListener(el, lazy ? 'change' : 'input', () => {
                _setter(el.value);
            });
        },
        beforeUpdate(el, { value }) {
            el.value = value;
        }
    };

    function setDisplay(el, show) {
        if (show) {
            el.style.display = el._display;
        }
        else {
            el.style.display = 'none';
        }
    }
    const showDirective = {
        beforeMount(el, { value }, { transition }) {
            el._display = el.style.display;
            setDisplay(el, value);
        },
        updated(el, { value, oldValue }, { transition }) {
            if (!value === !oldValue) {
                return;
            }
            else if (!transition) {
                setDisplay(el, value);
            }
            else {
                value ? transition.processShow(el) : transition.processHide(el);
            }
        }
    };

    // 指定一个动画keyframes，在执行后自动移除，不影响元素本身属性 
    function normalizeMs(value) {
        return isNumber(Number(value)) ? value + 'ms' : value;
    }
    function doKeyframesAnimation(el, options, endCb, cancelCb) {
        let _name = getElementComputedStyleValue(el, 'animationName');
        if (_name && _name !== 'none') {
            // ! 元素本身不应该存在动画名称属性
            return;
        }
        const { name, duration, timingFunction, delay, playState, fillMode, iterationCount, // infinite 无限次时 结束回调失效
        direction } = options;
        const animationDeclaration = {
            animationName: name,
            animationDuration: normalizeMs(duration),
            animationDelay: normalizeMs(delay),
            animationTimingFunction: timingFunction,
            animationPlayState: playState,
            animationFillMode: fillMode,
            animationIterationCount: iterationCount,
            animationDirection: direction
        };
        // 动画执行结束后再还原属性
        let copy = getElementStyle(el, animationDeclaration);
        setElementStyleDeclaration(el, animationDeclaration);
        let animationCompleteHandler = () => {
            // 重新设置之前的属性
            setElementStyleDeclaration(el, copy);
            if (endCb) {
                endCb(el);
            }
        };
        onceListener(el, 'animationend', animationCompleteHandler);
        let cancelled = false;
        // stop animation , 只有动画成功执行才会返回取消方法
        return () => {
            if (cancelled) {
                return;
            }
            setElementStyleDeclaration(el, copy);
            removeListener(el, 'animationend', animationCompleteHandler); // 手动移除侦听器
            if (cancelCb) {
                cancelCb(el);
            }
            cancelled = true;
        };
    }

    const slideInDown = [keyframe('from', {
            transform: translate3d(0, '-100%', 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideInUp = [keyframe('from', {
            transform: translate3d(0, '100%', 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideInLeft = [keyframe('from', {
            transform: translate3d('-100%', 0, 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideInRight = [keyframe('from', {
            transform: translate3d('100%', 0, 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideOutDown = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d(0, '100%', 0),
            visibility: 'hidden'
        })];
    const slideOutUp = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d(0, '-100%', 0),
            visibility: 'hidden'
        })];
    const slideOutLeft = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d('-100%', 0, 0),
            visibility: 'hidden'
        })];
    const slideOutRight = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d('100%', 0, 0),
            visibility: 'hidden'
        })];

    const zoomIn = [keyframe('from', {
            transform: scale3d(0.3, 0.3, 0.3),
            opacity: 0
        }), keyframe(50, {
            opacity: 1
        })];
    const zoomInDown = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '-1000px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '60px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomInUp = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '1000px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '-60px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomInLeft = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('-1000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('10px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomInRight = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('1000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('-10px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOut = [keyframe('from', {
            opacity: 1
        }), keyframe(40, {
            opacity: 0,
            transform: scale3d(0.3, 0.3, 0.3)
        }), keyframe('to', {
            opacity: 0
        })];
    const zoomOutDown = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '-60px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '2000px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOutUp = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '60px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '-2000px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOutLeft = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('42px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('-2000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOutRight = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('-42px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('2000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];

    const hinge = [
        keyframe(0, {
            animationTimingFunction: 'ease-in-out'
        }),
        keyframe([20, 60], {
            animationTimingFunction: 'ease-in-out',
            transform: rotate3d(0, 0, 1, 80)
        }),
        keyframe([40, 80], {
            animationTimingFunction: 'ease-in-out',
            transform: rotate3d(0, 0, 1, 60),
            opacity: 1
        }),
        keyframe(100, {
            transform: translate3d(0, '700px', 0),
            opacity: 0
        })
    ];
    const jackInTheBox = [
        keyframe(0, {
            opacity: 0,
            transform: [scale(0.1), rotate(30)],
            transformOrigin: ['center', 'bottom']
        }),
        keyframe(50, {
            transform: rotate(-10),
        }),
        keyframe(70, {
            transform: rotate(3),
        }),
        keyframe(100, {
            opacity: 1,
            transform: scale(1),
        })
    ];
    const rollIn = [
        keyframe(0, {
            opacity: 0,
            transform: [translate3d('-100%', 0, 0), rotate3d(0, 0, 1, -120)]
        }),
        keyframe(100, {
            opacity: 1,
            transform: translate3d(0, 0, 0)
        })
    ];
    const rollOut = [
        keyframe(0, {
            opacity: 1,
        }),
        keyframe(100, {
            opacity: 0,
            transform: [translate3d('100%', 0, 0), rotate3d(0, 0, 1, 120)]
        })
    ];

    const bounce = [
        keyframe([0, 20, 53, 100], {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
            transform: translate3d(0, 0, 0)
        }),
        keyframe([40, 43], {
            animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
            transform: [translate3d(0, '-30px', 0), scaleY(1.1)]
        }),
        keyframe(70, {
            animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
            transform: [translate3d(0, '-15px', 0), scaleY(1.05)]
        }),
        keyframe(80, {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
            transform: [translate3d(0, 0, 0), scaleY(0.95)]
        }),
        keyframe(90, {
            transform: [translate3d(0, '-4px', 0), scaleY(1.02)]
        })
    ];
    const bounceIn = [
        keyframe(['from', 20, 40, 60, 80, 100], {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1)
        }),
        keyframe(0, { transform: scale3d(0.3, 0.3, 0.3) }),
        keyframe(20, { transform: scale3d(1.1, 1.1, 1.1) }),
        keyframe(40, { transform: scale3d(0.9, 0.9, 0.9) }),
        keyframe(60, { transform: scale3d(1.03, 1.03, 1.03) }),
        keyframe(80, { transform: scale3d(0.97, 0.97, 0.97) }),
        keyframe(100, { transform: scale3d(1, 1, 1) }),
    ];
    const bounceOut = [
        keyframe(20, { transform: scale3d(0.9, 0.9, 0.9) }),
        keyframe([50, 55], { opacity: 1, transform: scale3d(1.1, 1.1, 1.1) }),
        keyframe(100, { transform: scale3d(0.3, 0.3, 0.3), opacity: 0 })
    ];
    const bounceInDown = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d(0, '-3000px', 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d(0, '25px', 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d(0, '-10px', 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d(0, '5px', 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceInUp = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d(0, '-3000px', 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d(0, '25px', 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d(0, '-10px', 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d(0, '5px', 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceInLeft = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d('-3000px', 0, 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d('25px', 0, 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d('-10px', 0, 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d('5px', 0, 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceInRight = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d('3000px', 0, 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d('-25px', 0, 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d('10px', 0, 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d('-5px', 0, 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceOutDown = [
        keyframe(20, { transform: [translate3d(0, '10px', 0), scaleY(0.985)] }),
        keyframe([40, 45], { opacity: 1, transform: [translate3d(0, '-20px', 0), scaleY(0.9)] }),
        keyframe(100, { opacity: 0, transform: [translate3d(0, '2000px', 0), scaleY(3)] }),
    ];
    const bounceOutUp = [
        keyframe(20, { transform: [translate3d(0, '-10px', 0), scaleY(0.985)] }),
        keyframe([40, 45], { opacity: 1, transform: [translate3d(0, '20px', 0), scaleY(0.9)] }),
        keyframe(100, { opacity: 0, transform: [translate3d(0, '-2000px', 0), scaleY(3)] }),
    ];
    const bounceOutLeft = [
        keyframe(20, { opacity: 1, transform: [translate3d('20px', 0, 0), scaleX(2)] }),
        keyframe(100, { opacity: 0, transform: [translate3d('-2000px', 0, 0), scaleX(2)] })
    ];
    const bounceOutRight = [
        keyframe(20, { opacity: 1, transform: [translate3d('-20px', 0, 0), scaleX(2)] }),
        keyframe(100, { opacity: 0, transform: [translate3d('2000px', 0, 0), scaleX(2)] })
    ];

    const swing = [
        keyframe(20, { transform: rotate3d(0, 0, 1, '15deg') }),
        keyframe(40, { transform: rotate3d(0, 0, 1, '-10deg') }),
        keyframe(60, { transform: rotate3d(0, 0, 1, '5deg') }),
        keyframe(80, { transform: rotate3d(0, 0, 1, '-5deg') }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '0deg') }),
    ];

    const flash = [
        keyframe([0, 50, 100], {
            opacity: 1
        }),
        keyframe([25, 75], {
            opacity: 0
        })
    ];

    const shakeX = [
        keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
        keyframe([10, 30, 50, 70, 90], { transform: translate3d('-10px', 0, 0) }),
        keyframe([20, 40, 60, 80], { transform: translate3d('10px', 0, 0) }),
    ];
    const shakeY = [
        keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
        keyframe([10, 30, 50, 70, 90], { transform: translate3d(0, '-10px', 0) }),
        keyframe([20, 40, 60, 80], { transform: translate3d(0, '10px', 0) }),
    ];

    const pulse = [
        keyframe(0, {
            transform: scale3d(1, 1, 1)
        }),
        keyframe(50, {
            transform: scale3d(1.05, 1.05, 1.05)
        }),
        keyframe(100, {
            transform: scale3d(1, 1, 1)
        }),
    ];

    const backInDown = [
        keyframe(0, {
            transform: [translateY('-1200px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(80, {
            transform: [translateY('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: scale(1),
            opacity: 1
        }),
    ];
    const backInUp = [
        keyframe(0, {
            transform: [translateY('1200px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(80, {
            transform: [translateY('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: scale(1),
            opacity: 1
        }),
    ];
    const backInLeft = [
        keyframe(0, {
            transform: [translateX('-2000px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(80, {
            transform: [translateX('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: scale(1),
            opacity: 1
        }),
    ];
    const backInRight = [
        keyframe(0, {
            transform: [translateX('2000px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(80, {
            transform: [translateX('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: scale(1),
            opacity: 1
        }),
    ];
    const backOutDown = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateY('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateY('700px'), scale(0.7)],
            opacity: 0.7
        }),
    ];
    const backOutUp = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateY('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateY('-700px'), scale(0.7)],
            opacity: 0.7
        }),
    ];
    const backOutLeft = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateX('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateX('-2000px'), scale(0.7)],
            opacity: 0.7
        }),
    ];
    const backOutRight = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateX('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateX('2000px'), scale(0.7)],
            opacity: 0.7
        }),
    ];

    const flip = [
        keyframe(0, {
            transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, 0), rotate3d(0, 1, 0, -360)],
            animationTimingFunction: 'ease-out'
        }),
        keyframe(40, {
            transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, '150px'), rotate3d(0, 1, 0, -190)],
            animationTimingFunction: 'ease-out'
        }),
        keyframe(50, {
            transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, '150px'), rotate3d(0, 1, 0, -170)],
            animationTimingFunction: 'ease-in'
        }),
        keyframe(80, {
            transform: [perspective('400px'), scale3d(0.95, 0.95, 0.95), translate3d(0, 0, 0), rotate3d(0, 1, 0, 0)],
            animationTimingFunction: 'ease-in'
        }),
        keyframe(100, {
            transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, 0), rotate3d(0, 1, 0, 0)],
            animationTimingFunction: 'ease-in'
        })
    ];
    const flipInX = [
        keyframe(0, {
            transform: [perspective('400px'), rotate3d(1, 0, 0, 90)],
            animationTimingFunction: 'ease-in',
            opacity: 0
        }),
        keyframe(40, {
            transform: [perspective('400px'), rotate3d(1, 0, 0, -20)],
            animationTimingFunction: 'ease-in'
        }),
        keyframe(60, {
            transform: [perspective('400px'), rotate3d(1, 0, 0, 10)],
            animationTimingFunction: 'ease-in',
            opacity: 1
        }),
        keyframe(80, {
            transform: [perspective('400px'), rotate3d(1, 0, 0, -5)],
        }),
        keyframe(100, {
            transform: perspective('400px')
        })
    ];
    const flipInY = [
        keyframe(0, {
            transform: [perspective('400px'), rotate3d(0, 1, 0, 90)],
            animationTimingFunction: 'ease-in',
            opacity: 0
        }),
        keyframe(40, {
            transform: [perspective('400px'), rotate3d(0, 1, 0, -20)],
            animationTimingFunction: 'ease-in'
        }),
        keyframe(60, {
            transform: [perspective('400px'), rotate3d(0, 1, 0, 10)],
            animationTimingFunction: 'ease-in',
            opacity: 1
        }),
        keyframe(80, {
            transform: [perspective('400px'), rotate3d(0, 1, 0, -5)],
        }),
        keyframe(100, {
            transform: perspective('400px')
        })
    ];
    const flipOutX = [
        keyframe(0, {
            transform: perspective('400px')
        }),
        keyframe(30, {
            transform: [perspective('400px'), rotate3d(1, 0, 0, -20)],
            opcaity: 1
        }),
        keyframe(100, {
            transform: [perspective('400px'), rotate3d(1, 0, 0, 90)],
            opcaity: 0
        })
    ];
    const flipOutY = [
        keyframe(0, {
            transform: perspective('400px')
        }),
        keyframe(30, {
            transform: [perspective('400px'), rotate3d(0, 1, 0, -20)],
            opcaity: 1
        }),
        keyframe(100, {
            transform: [perspective('400px'), rotate3d(0, 1, 0, 90)],
            opcaity: 0
        })
    ];

    const headShake = [
        keyframe(0, { transform: translateX('0px') }),
        keyframe(6.5, { transform: [translateX('-6px'), rotateY(-9)] }),
        keyframe(18.5, { transform: [translateX('5px'), rotateY(7)] }),
        keyframe(31.5, { transform: [translateX('-3px'), rotateY(-5)] }),
        keyframe(43.5, { transform: [translateX('2px'), rotateY(3)] }),
        keyframe(50, { transform: translateX('0px') }),
    ];

    const lightSpeedInRight = [
        keyframe(0, {
            transform: [translate3d('100%', 0, 0), skewX(-30)],
            opacity: 0
        }),
        keyframe(60, {
            transform: skewX(20),
            opacity: 1
        }),
        keyframe(80, {
            transform: skewX(-5)
        }),
        keyframe(100, {
            transform: translate3d(0, 0, 0)
        }),
    ];
    const lightSpeedInLeft = [
        keyframe(0, {
            transform: [translate3d('-100%', 0, 0), skewX(30)],
            opacity: 0
        }),
        keyframe(60, {
            transform: skewX(-20),
            opacity: 1
        }),
        keyframe(80, {
            transform: skewX(5)
        }),
        keyframe(100, {
            transform: translate3d(0, 0, 0)
        }),
    ];
    const lightSpeedOutRigt = [
        keyframe(0, {
            opacity: 1
        }),
        keyframe(100, {
            transform: [translate3d('100%', 0, 0), skewX(30)],
            opacity: 0
        }),
    ];
    const lightSpeedOutLeft = [
        keyframe(0, {
            opacity: 1
        }),
        keyframe(100, {
            transform: [translate3d('-100%', 0, 0), skewX(-30)],
            opacity: 0
        }),
    ];

    const rubberBand = [
        keyframe(0, { transform: scale3d(1, 1, 1) }),
        keyframe(30, { transform: scale3d(1.25, 0.75, 1) }),
        keyframe(40, { transform: scale3d(0.75, 1.25, 1) }),
        keyframe(50, { transform: scale3d(1.15, 0.85, 1) }),
        keyframe(65, { transform: scale3d(0.95, 1.05, 1) }),
        keyframe(75, { transform: scale3d(1.05, 0.95, 1) }),
        keyframe(100, { transform: scale3d(1, 1, 1) }),
    ];

    const heartBeat = [
        keyframe(0, {
            transform: scale(1)
        }),
        keyframe(14, {
            transform: scale(1.3)
        }),
        keyframe(28, {
            transform: scale(1)
        }),
        keyframe(42, {
            transform: scale(1.3)
        }),
        keyframe(70, {
            transform: scale(1)
        })
    ];

    const wobble = [
        keyframe(0, {
            transform: translate3d(0, 0, 0)
        }),
        keyframe(15, {
            transform: [translate3d('-25%', 0, 0), rotate3d(0, 0, 1, '-5deg')]
        }),
        keyframe(30, {
            transform: [translate3d('25%', 0, 0), rotate3d(0, 0, 1, '3deg')]
        }),
        keyframe(45, {
            transform: [translate3d('-15%', 0, 0), rotate3d(0, 0, 1, '-3deg')]
        }),
        keyframe(60, {
            transform: [translate3d('10%', 0, 0), rotate3d(0, 0, 1, '2deg')]
        }),
        keyframe(75, {
            transform: [translate3d('-5%', 0, 0), rotate3d(0, 0, 1, '-1deg')]
        }),
        keyframe(100, {
            transform: translate3d(0, 0, 0)
        })
    ];

    const rotateIn = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '-200deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInDownLeft = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '-45deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInDownRight = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '45deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInUpLeft = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '45deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInUpRight = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '-90deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateOut = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '200deg'), opacity: 0 }),
    ];
    const rotateOutDownLeft = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
    ];
    const rotateOutDownRight = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
    ];
    const rotateOutUpLeft = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '-45deg'), opacity: 0 }),
    ];
    const rotateOutUpRight = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
    ];

    const fadeIn = [
        keyframe(0, { opacity: 0 }),
        keyframe(100, { opacity: 1 })
    ];
    const fadeInDown = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInDownBig = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '-2000px', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInLeft = [
        keyframe(0, { opacity: 0, transform: translate3d('-100%', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInLeftBig = [
        keyframe(0, { opacity: 0, transform: translate3d('-2000px', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInRight = [
        keyframe(0, { opacity: 0, transform: translate3d('100%', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInRightBig = [
        keyframe(0, { opacity: 0, transform: translate3d('2000px', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInUp = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInUpBig = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '2000px', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInTopLeft = [
        keyframe(0, { opacity: 0, transform: translate3d('-100%', '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInTopRight = [
        keyframe(0, { opacity: 0, transform: translate3d('100%', '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInBottomLeft = [
        keyframe(0, { opacity: 0, transform: translate3d('-100%', '100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInBottomRight = [
        keyframe(0, { opacity: 0, transform: translate3d('100%', '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeOut = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0 })
    ];
    const fadeOutDown = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '100%', 0) })
    ];
    const fadeOutDownBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '2000px', 0) })
    ];
    const fadeOutLeft = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('-100%', 0, 0) })
    ];
    const fadeOutLeftBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('-2000px', 0, 0) })
    ];
    const fadeOutRight = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('100%', 0, 0) })
    ];
    const fadeOutRightBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('2000px', 0, 0) })
    ];
    const fadeOutUp = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '-100%', 0) })
    ];
    const fadeOutUpBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '-2000px', 0) })
    ];
    const fadeOutTopLeft = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('-100%', '-100%', 0) })
    ];
    const fadeOutTopRight = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('100%', '-100%', 0) })
    ];
    const fadeOutBottomRight = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('100%', '100%', 0) })
    ];
    const fadeOutBottomLeft = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('-100%', '100%', 0) })
    ];

    const animationFrames = {
        // slide 滑动
        slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp,
        // zoom 缩放
        zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp,
        // specials 特殊动画
        hinge, jackInTheBox, rollIn, rollOut,
        // 弹跳
        bounce, bounceIn, bounceInDown, bounceInLeft, bounceInRight, bounceInUp, bounceOut, bounceOutDown, bounceOutLeft, bounceOutRight, bounceOutUp,
        // 摇摆
        swing,
        // 闪烁
        flash,
        // 抖动
        shakeX, shakeY,
        // 脉搏
        pulse,
        // 出场
        backInDown, backInLeft, backInRight, backInUp, backOutDown, backOutLeft, backOutRight, backOutUp,
        // 翻动
        flip, flipInX, flipInY, flipOutX, flipOutY,
        // 摇头
        headShake,
        // 光速
        lightSpeedInLeft, lightSpeedInRight, lightSpeedOutLeft, lightSpeedOutRigt,
        // 橡皮筋
        rubberBand,
        // 心跳
        heartBeat,
        // 摇晃
        wobble,
        // 旋转
        rotateIn, rotateInDownLeft, rotateInDownRight, rotateInUpLeft, rotateInUpRight, rotateOut, rotateOutDownLeft, rotateOutDownRight, rotateOutUpLeft, rotateOutUpRight,
        // 淡入淡出
        fadeIn, fadeInBottomLeft, fadeInBottomRight, fadeInDown, fadeInDownBig, fadeInLeft, fadeInLeftBig, fadeInRight, fadeInRightBig, fadeInTopLeft,
        fadeInTopRight, fadeInUp, fadeInUpBig, fadeOut, fadeOutBottomLeft, fadeOutBottomRight, fadeOutDown, fadeOutDownBig, fadeOutLeft, fadeOutLeftBig,
        fadeOutRight, fadeOutRightBig, fadeOutTopLeft, fadeOutTopRight, fadeOutUp, fadeOutUpBig,
    };
    // 这里可以控制 keyframes 的名称 ， 并没有直接生成完整的keyframes
    const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames));
    // 关于 animate的class
    let animationClassStyleSheet, animationClassRecord = {};
    function initAnimationClass(className) {
        if (!className.startsWith('animate_') || animationClassRecord[className]) {
            return;
        }
        let targetSheet = animationClassStyleSheet ||= mount(createStyleSheet(null, animations), document.head);
        let declaration = className.split('animate_')[1].split('_');
        mountStyleRule(targetSheet, createStyle('.' + className, { animation: declaration }));
    }
    const installAnimation = () => {
        // 挂载所有动画帧
        mount(createStyleSheet(null, animations), document.head);
        onBeforeClassMount(initAnimationClass);
    };

    function setElementTranstion(el) {
    }

    //! class
    function bindEnterClass(el, name) {
        addClass(el, `${name}-enter`);
        addClass(el, `${name}-enter-from`);
        requestAnimationFrame(() => {
            addClass(el, `${name}-enter-to`);
            removeClass(el, `${name}-enter-from`);
        });
    }
    function removeEnterClass(el, name) {
        removeClass(el, `${name}-enter-to`);
        removeClass(el, `${name}-enter`);
    }
    function bindLeaveClass(el, name) {
        addClass(el, `${name}-leave-from`);
        document.body.offsetHeight;
        addClass(el, `${name}-leave`);
        requestAnimationFrame(() => {
            addClass(el, `${name}-leave-to`);
            removeClass(el, `${name}-leave-from`);
        });
    }
    function removeLeaveClass(el, name) {
        removeClass(el, `${name}-leave-to`);
        removeClass(el, `${name}-leave`);
    }
    let leavingElements = {};
    const createTransition = (options) => new TransitionDesc(options);
    // 整个transtion描述不参与节点的真实挂载卸载，显示或隐藏
    class TransitionDesc {
        type; // css / animation
        name;
        duration; // css一般不需要
        enterKeyframes;
        leaveKeyframes;
        appear;
        // hooks
        onBeforeEnter;
        onEnter;
        onAfterEnter;
        onEnterCancelled;
        onBeforeLeave;
        onLeave;
        onAfterLeave;
        onLeaveCancelled;
        onBeforeAppear;
        onAppear;
        onAfterAppear;
        onAppearCancelled;
        constructor(options) {
            this.update(options);
        }
        update(options) {
            options ||= emptyObject;
            this.name = options.name || 'transition';
            this.type = options.type || 'css'; // 默认采用 css
            // 该元素在组件中是否为第一次渲染
            this.appear = options.appear || false;
            this.duration = options.duration;
            this.onBeforeEnter = options.onBeforeEnter;
            this.onEnter = options.onEnter;
            this.onAfterEnter = options.onAfterEnter;
            this.onEnterCancelled = options.onEnterCancelled;
            this.onBeforeLeave = options.onBeforeLeave;
            this.onLeave = options.onLeave;
            this.onAfterLeave = options.onAfterLeave;
            this.onLeaveCancelled = options.onLeaveCancelled;
            this.onBeforeAppear = options.onBeforeAppear;
            this.onAppear = options.onAppear;
            this.onAfterAppear = options.onAfterAppear;
            this.onAppearCancelled = options.onAppearCancelled;
            this.enterKeyframes = options.enterKeyframes;
            this.leaveKeyframes = options.leaveKeyframes;
        }
        bindeEnterClass = (el) => bindEnterClass(el, this.name);
        bindeLeaveClass = (el) => bindLeaveClass(el, this.name);
        removeEnterClass = (el) => removeEnterClass(el, this.name);
        removeLeaveClass = (el) => removeLeaveClass(el, this.name);
        callHook = (hookName, ...args) => {
            let _this = this;
            let hook = _this[`on${initialUpperCase(hookName)}`];
            if (hook) {
                hook.call(_this, ...args);
            }
        };
        beforeEnter() { }
        beforeLeave() { }
        cancelEnter() { }
        canceleave() { }
        // 关于 transition group
        processMount(newEl, insertFn) {
            let { patchKey, instance } = newEl._vnode;
            let appearRecord = instance.appearRecord ||= {};
            let appeared = appearRecord[patchKey];
            if (!this.appear && !appeared) {
                // appear
                insertFn();
                appearRecord[patchKey] = true;
                return;
            }
            let leavingEl = leavingElements[patchKey];
            if (leavingEl) {
                // 上个元素还没卸载完成（过渡中） 直接卸载 , 不管是css过渡还是动画过度，直接卸载即可
                removeElement(leavingEl);
                leavingElements[patchKey] = null;
            }
            // 进入动画挂载
            insertFn();
            appearRecord[patchKey] = true;
            newEl._entering = true;
            if (this.type === 'animate') {
                newEl.cancelKeyframes = doKeyframesAnimation(newEl, {
                    name: this.enterKeyframes,
                    duration: this.duration,
                });
                onceListener(newEl, 'animationend', () => {
                    // after enter
                    newEl._entering = false;
                });
            }
            else if (this.type === 'css') {
                this.bindeEnterClass(newEl);
                onceListener(newEl, 'transitionend', () => {
                    // after enter
                    this.removeEnterClass(newEl);
                    newEl._entering = false;
                });
            }
            else {
                // 其他类型 ， 开发中
                insertFn();
            }
        }
        processUnmount(el) {
            let { patchKey } = el._vnode;
            // 正在进入 ，取消进入动画, 进入卸载东动画
            if (el._entering) {
                if (this.type === 'css') {
                    this.removeEnterClass(el);
                }
                else if (this.type === 'animate') {
                    el.cancelKeyframes();
                }
            }
            leavingElements[patchKey] = el;
            if (this.type === 'css') {
                this.bindeLeaveClass(el);
                onceListener(el, 'transitionend', () => {
                    // 元素直接卸载就不需要卸载class了
                    removeElement(el);
                    leavingElements[patchKey] = null;
                });
            }
            else if (this.type === 'animate') {
                doKeyframesAnimation(el, {
                    name: this.leaveKeyframes,
                    duration: this.duration
                });
                onceListener(el, 'animationend', () => {
                    // 元素直接卸载就不需要卸载class了
                    removeElement(el);
                    leavingElements[patchKey] = null;
                });
            }
            else {
                // 其他类型 ， 开发中
                removeElement(el);
            }
        }
        // show todo
        processShow(el) {
            // appear 好像蹭挂载的就可以了
            // enter
            if (el._leaving) {
                // cancel leave
                this.removeLeaveClass(el);
                el._leaving = false;
                // 此时如果进入进入动画的话，会使用过渡，而不是直接设为
                // 按逻辑说应该设为none，但好像没必要
            }
            el._entering = true;
            setDisplay(el, true);
            // 解决bug，让元素重新挂载一次
            remountElement(el);
            this.bindeEnterClass(el);
            onceListener(el, 'transitionend', () => {
                this.removeEnterClass(el);
                setDisplay(el, true);
                el._entering = false;
            });
        }
        processHide(el) {
            if (el._entering) {
                // cancel
                this.removeEnterClass(el);
                el._entering = false;
            }
            el._leaving = true;
            this.bindeLeaveClass(el);
            onceListener(el, 'transitionend', () => {
                this.removeLeaveClass(el);
                el._leaving = false;
                setDisplay(el, false);
            });
        }
    }

    // 第一次进入任何元素都不会过渡
    const transitionGroupComponent = {
        render: ({ $slots }) => $slots.default(),
        beforeUpdate({ $instance: { vnode, renderingVnode }, $props }) {
            const transition = createTransition($props);
            // always true
            transition.appear = true;
            const mountList = renderingVnode.filter((patchKey) => !vnode.map((_) => _.patchKey).includes(patchKey));
            const unmountList = vnode.filter((patchKey) => !renderingVnode.map((_) => _.patchKey).includes(patchKey));
            const transitionList = mountList.concat(unmountList);
            transitionList.forEach((_) => {
                _.transition = transition;
            });
        }
    };
    const transitionComponent = {
        render: ({ $slots }) => $slots.default(),
        beforeMount({ $instance: { renderingVnode }, $props }) {
            const transtion = createTransition($props);
            renderingVnode.forEach((vnode) => {
                vnode.transition = transtion;
            });
        },
        beforeUpdate({ $instance: { renderingVnode }, $props }) {
            const transtion = createTransition($props);
            renderingVnode && renderingVnode.forEach((vnode) => {
                vnode.transition = transtion;
            });
        }
    };
    const transitionDirective = {
        beforeCreate(_, { value }, vnode) {
            vnode.transition = createTransition(value);
        },
        beforeUpdate(_, { value }, nVnode, pVnode) {
            if (!pVnode) {
                // 此时为组件自更新
                return;
            }
            const transition = pVnode.transition;
            transition.update(value);
            nVnode.transition = transition; // extend
        }
    };
    const transitionGroupDirective = {
        beforeUpdate() {
            debugger;
        }
    };

    const body = document.body;
    const defaultTeleportOptions = {
        to: body,
        anchor: null,
        disabled: false
    };
    function normalizeElement(selectorOrElement) {
        if (isString(selectorOrElement)) {
            try {
                selectorOrElement = document.querySelector(selectorOrElement);
            }
            catch (e) {
                return null;
            }
        }
        if (!(selectorOrElement instanceof Element)) {
            return null;
        }
        return selectorOrElement;
    }
    function Teleport(props, { default: _default }, nVnode, pVnode) {
        console.log('teleport update');
        props ||= defaultTeleportOptions;
        let { to: container, anchor, disabled } = props;
        container = normalizeElement(container) || body;
        anchor = normalizeElement(anchor);
        let renderingVnode = processVnodePrerender(_default());
        if (pVnode) {
            // 节点更新 , 参数可能会变
            let { to: pContainer, anchor: pAnchor, disabled: pDisabled } = pVnode.props || defaultTeleportOptions;
            pContainer = normalizeElement(pContainer) || body;
            pAnchor = normalizeElement(pAnchor);
            let instance = pVnode.instance;
            let teleportedVnode = pVnode.teleportedVnode;
            if (disabled && !pDisabled) {
                // 卸载
                patch(teleportedVnode, null, pContainer, pAnchor, instance); // 卸载之前的
                nVnode.teleportedVnode = null; // 清空已传送节点
                nVnode.teleportedVnodeContainer = null;
                nVnode.teleportedVnodeAnchor = null;
            }
            else if (!disabled && pDisabled) {
                // 挂载
                patch(null, renderingVnode, container, anchor, instance); // 挂载新的
                nVnode.teleportedVnode = renderingVnode;
                nVnode.teleportedVnodeContainer = container;
                nVnode.teleportedVnodeAnchor = anchor;
            }
            else {
                // 更新
                if (container !== pContainer || anchor !== pAnchor) {
                    patch(teleportedVnode, null, pContainer, pAnchor, instance); // 卸载之前的
                    patch(null, renderingVnode, container, anchor, instance); // 挂载新的
                    nVnode.teleportedVnode = renderingVnode;
                    nVnode.teleportedVnodeContainer = container;
                    nVnode.teleportedVnodeAnchor = anchor;
                }
                else {
                    patch(teleportedVnode, renderingVnode, container, anchor, instance);
                    nVnode.teleportedVnode = renderingVnode;
                    nVnode.teleportedVnodeContainer = container;
                    nVnode.teleportedVnodeAnchor = anchor;
                }
            }
        }
        else {
            // 第一次挂载
            if (disabled) ;
            else {
                patch(null, renderingVnode, container, anchor, nVnode.instance); // 传送
                nVnode.teleportedVnode = renderingVnode;
            }
        }
        // disabled生效 ，直接渲染空节点
        return disabled ? renderingVnode : null;
    }

    // global reactive url
    ref('666');

    function RouterView(props, slots, vnode, pVnode) {
        vnode.instance;
        return '路由视图';
    }
    function RouterLink({ to, replace, activeClass }) {
    }

    const builtInComponents = {
        transition: transitionComponent,
        transitionGroup: transitionGroupComponent,
        Teleport,
        RouterLink,
        RouterView
    };
    const builtInDirectives = {
        modelText: modelText,
        modelTextarea: modelText,
        modelCheckbox: modelCheckbox,
        modelRadio: modelRadio,
        modelRange: modelRange,
        modelColor: modelColor,
        modelSelectOne: modelSelectOne,
        modelSelectMultiple: modelSelectMultiple,
        show: showDirective,
        transition: transitionDirective,
        transitionGroup: transitionGroupDirective,
    };

    // app.config.responsive
    const responsiveLayoutMedia = {
        xs: '(max-width:768px)',
        sm: '(min-width:768px) and (max-width:992px)',
        md: '(min-width:992px) and (max-width:1200px)',
        lg: '(min-width:1200px) and (max-width:1920px)',
        xl: '(min-width:1920px)'
    };

    var cssMethods = {
        rgba,
        rgb,
        hsl,
        hsla,
        $var,
        attr,
        calc,
        cubicBezier,
        max,
        min,
        translateX,
        translateY,
        scale,
        rotate3d,
        translate3d,
        rotate,
        perspective,
        scale3d,
        skew,
        skewX,
        skewY,
        scaleY,
        rotateY,
        conicGradient,
        linearGradient,
        radialGradient
    };

    //  基于 vnode 的元素选择器，在vnode树中查找元素，必须是处理过的树，也可以查询组件等
    /*
        *  所有元素
        #  id 选择器
        .  class 选择器
        普通标签选择 ， 组件会返回实例
    */
    // 如果是组件标签的话，直接通过实例身上的components，可获得组件的type
    var QuerySelectorType;
    (function (QuerySelectorType) {
        QuerySelectorType[QuerySelectorType["ID"] = 0] = "ID";
        QuerySelectorType[QuerySelectorType["CLASS"] = 1] = "CLASS";
        QuerySelectorType[QuerySelectorType["ELEMENT_TYPE"] = 2] = "ELEMENT_TYPE";
        QuerySelectorType[QuerySelectorType["COMPONENT_TYPE"] = 3] = "COMPONENT_TYPE";
        QuerySelectorType[QuerySelectorType["RENDER_COMPONENT_TYPE"] = 4] = "RENDER_COMPONENT_TYPE"; // 渲染函数没有实例
    })(QuerySelectorType || (QuerySelectorType = {}));
    function parseQuerySelector(selector) {
        let type, value;
        if (isFunction(selector)) {
            // render component
            type = QuerySelectorType.RENDER_COMPONENT_TYPE;
            value = selector;
        }
        else if (isObject(selector)) {
            type = QuerySelectorType.COMPONENT_TYPE;
            value = selector;
        }
        else if (selector.startsWith('.')) {
            type = QuerySelectorType.CLASS;
            value = selector.slice(1);
        }
        else if (selector.startsWith('#')) {
            type = QuerySelectorType.ID;
            value = selector.slice(1);
        }
        else {
            type = QuerySelectorType.ELEMENT_TYPE;
            value = selector;
        }
        return {
            type,
            value
        };
    }
    function querySelector(selector, vnode) {
        if (!selector || !vnode) {
            return null;
        }
        let { type, value } = parseQuerySelector(selector);
        return doQuerySelector(value, type, vnode);
    }
    function doQuerySelector(selector, type, vnode) {
        let result = null;
        // vnode 始终是数组形式 
        for (let item of vnode) {
            if (type === QuerySelectorType.CLASS) {
                // class 中 selector 为 true
                if (item?.props?.class?.[selector]) {
                    result = item.el || item.instance;
                    break;
                }
            }
            else if (type === QuerySelectorType.ID) {
                if (item?.props?.id === selector) {
                    result = item.el || item.instance;
                    break;
                }
            }
            else if (type === QuerySelectorType.ELEMENT_TYPE || type === QuerySelectorType.COMPONENT_TYPE) {
                if (item.type === selector) {
                    result = item.el || item.instance; // 元素节点身上也有 instance属性
                    break;
                }
            }
            else if (type === QuerySelectorType.RENDER_COMPONENT_TYPE) {
                // render component 暂时没有相应的元素或实例
                // 或者 render component 返回对应的子元素或实例
                result = null;
            }
            else {
                continue;
            }
            if (item.children && (item.nodeType == 13 /* HTML_ELEMENT */ || item.nodeType == 9 /* SVG_ELEMENT */)) {
                // 有状态组件，无状态组件，样式表 不会寻找子元素
                result = doQuerySelector(selector, type, item.children);
            }
        }
        return result;
    }
    function querySelectorAll(selector, vnode) {
        if (!selector || !vnode) {
            return null;
        }
        let { type, value } = parseQuerySelector(selector);
        return doQuerySelectorAll(value, type, vnode, []);
    }
    function doQuerySelectorAll(selector, type, vnode, results) {
        for (let item of vnode) {
            if (type === QuerySelectorType.CLASS) {
                // class 中 selector 为 true
                if (item?.props?.class?.[selector]) {
                    results.push(item.el || item.instance);
                }
            }
            else if (type === QuerySelectorType.ID) {
                if (item?.props?.id === selector) {
                    results.push(item.el || item.instance);
                }
            }
            else if (type === QuerySelectorType.ELEMENT_TYPE || type === QuerySelectorType.COMPONENT_TYPE) {
                if (item.type === selector) {
                    results.push(item.el || item.instance);
                }
            }
            else if (type === QuerySelectorType.RENDER_COMPONENT_TYPE) ;
            else {
                continue;
            }
            if (item.children && (item.nodeType == 13 /* HTML_ELEMENT */ || item.nodeType == 9 /* SVG_ELEMENT */)) {
                // 有状态组件，无状态组件，样式表 不会寻找子元素
                doQuerySelectorAll(selector, type, item.children, results);
            }
        }
        return results;
    }

    const scopeProperties = {
        _currentPropertyAccessInstance: null,
        get $uid() {
            return this._currentPropertyAccessInstance.uid;
        },
        get $uuid() {
            return uid();
        },
        get $options() {
            return this._currentPropertyAccessInstance.options;
        },
        get $instance() {
            return this._currentPropertyAccessInstance;
        },
        get $refs() {
            return this._currentPropertyAccessInstance.refs ||= {}; // ! 确保组件没挂载时可以拿到 refs
        },
        get $el() {
            let { vnode, isMounted } = this._currentPropertyAccessInstance;
            if (!isMounted || !vnode) {
                return null;
            }
            let el = vnode.map((_vnode) => getEL(_vnode));
            // 有多个根元素会返回多个元素
            return el.length === 1 ? el[0] : el;
        },
        get $root() {
            return this._currentPropertyAccessInstance.root;
        },
        get $props() {
            return this._currentPropertyAccessInstance.props;
        },
        get $attrs() {
            return this._currentPropertyAccessInstance.attrs;
        },
        get $slots() {
            return this._currentPropertyAccessInstance.slots;
        },
        get $parent() {
            return this._currentPropertyAccessInstance.parent;
        },
        get $watch() {
            return this._currentPropertyAccessInstance.watch;
        },
        get $nextTick() {
            return nextTick.bind(this._currentPropertyAccessInstance.scope);
        },
        get $self() {
            return this._currentPropertyAccessInstance.scope;
        },
        get $forceUpdate() {
            if (!this._currentPropertyAccessInstance.isMounted) {
                return this._currentPropertyAccessInstance.update;
            }
        },
        // evnets
        get $emit() {
            return this._currentPropertyAccessInstance.emit;
        },
        get $on() {
            return this._currentPropertyAccessInstance.on;
        },
        get $off() {
            return this._currentPropertyAccessInstance.off;
        },
        get $once() {
            return this._currentPropertyAccessInstance.once;
        },
        // 查询当前组件内的元素 , 组件的话返回组件实例
        get $querySelector() {
            return (selector) => {
                // 先当做组件选择器，如果不是定义的组件则当做普通元素
                let type = this._currentPropertyAccessInstance?.components?.[selector] || selector;
                return querySelector(type, this._currentPropertyAccessInstance.vnode);
            };
        },
        get $querySelectorAll() {
            return (selector) => {
                // 先当做组件选择器，如果不是定义的组件则当做普通元素
                let type = this._currentPropertyAccessInstance?.components?.[selector] || selector;
                return querySelectorAll(type, this._currentPropertyAccessInstance.vnode);
            };
        },
    };
    const defineScopeProperty = (key, getter) => scopeProperties[key] = getter;
    const protoMethods = {
        debounce,
        throttle,
        ...cssMethods,
    };
    // inject scope property
    function createScope(instance) {
        const scope = reactive(Object.create(protoMethods));
        return new Proxy(scope, {
            get(target, key, receiver) {
                scopeProperties._currentPropertyAccessInstance = instance;
                let value = hasOwn(scopeProperties, key) ? scopeProperties[key] : Reflect.get(target, key, receiver);
                return value;
            },
            set(target, key, newValue, receiver) {
                if (hasOwn(scopeProperties, key)) {
                    // 实例方法不能设置
                    return true;
                }
                // 挂载到作用于上的promise异步数据会被自动请求
                if (isPromise(newValue)) {
                    // 先设置一个默认值,不然会出现bug
                    Reflect.set(target, key, null, receiver);
                    newValue.then((result) => {
                        return Reflect.set(target, key, result, receiver);
                    });
                }
                else {
                    return Reflect.set(target, key, newValue, receiver);
                }
                return true;
            }
        });
    }
    // 这些方法只能提供给模板使用
    const specialTemplateMethods = {
        // 模板会编译成 () => debounce(...) 所以函数会直接调用
        debounce(fn, wait) {
            return cacheDebounce(fn, wait)();
        },
        throttle(fn, wait) {
            return cacheThrottle(fn, wait)();
        },
    };
    function createRenderScope(instanceScope) {
        return new Proxy(instanceScope, {
            get(target, key, receiver) {
                if (key === Symbol.unscopables) {
                    return;
                }
                if (hasOwn(specialTemplateMethods, key)) {
                    return specialTemplateMethods[key];
                }
                // todo magic variables
                var result = Reflect.get(target, key, receiver);
                return isRef(result) ? result.value : result;
            }
        });
    }

    var currentApp;
    function getCurrentApp() {
        return currentApp;
    }
    function createApp(rootComponent) {
        if (currentApp) {
            // 只能有一个应用
            return;
        }
        const app = {
            isMounted: false,
            rootComponent,
            component,
            directive,
            components: builtInComponents,
            directives: builtInDirectives,
            plugins: new Set(),
            mixin,
            mixins: [],
            use,
            mount: mountApp,
            unmount: unmountApp,
            // config
            // @screens
            customScreens: responsiveLayoutMedia,
            // scope property
            globalProperties: scopeProperties,
            compilerOptions: null
        };
        currentApp = app;
        // 安装动画
        use(installAnimation);
        function component(name, component) {
            if (!app.components[name]) {
                app.components[name] = component;
            }
        }
        function mixin(mixin) {
            app.mixins.push(mixin);
        }
        function directive(name, directive) {
            if (!app.directives[name]) {
                app.directives[name] = directive;
            }
        }
        function use(plugin, ...options) {
            if (app.plugins.has(plugin))
                return;
            let install = isFunction(plugin) ? plugin : plugin.install;
            install.call(plugin, app, ...options);
            app.plugins.add(plugin);
        }
        function mountApp(container) {
            container = isString(container) ? document.querySelector(container) : container;
            app.container = container;
            app.inlineTemplate = container.innerHTML;
            container.innerHTML = '';
            if (!rootComponent.template && !rootComponent.render) {
                rootComponent.template = app.inlineTemplate;
            }
            app.rootVnode = createComponent(rootComponent, null, null);
            mount(app.rootVnode, app.container);
            app.isMounted = true;
        }
        function unmountApp() {
            // 卸载已安装的插件
            app.plugins.forEach((plugin) => {
                let uninstall = isObject(plugin) && plugin.uninstall;
                if (uninstall) {
                    uninstall(app);
                }
            });
            unmountComponent(app.rootVnode, app.container);
            app.isMounted = false;
            currentApp = null;
        }
        return app;
    }
    function getCustomScreensMedia(screen) {
        return getCurrentApp().customScreens[screen] || 'screen'; // 默认屏幕 , 所有情况都生效
    }

    function injectHook(type, target, hook) {
        var hooks = (target[type] ||= []);
        if (!isArray(hooks)) {
            target[type] = [target[type]];
        }
        // the input hooks supports array
        if (isArray(hook)) {
            hooks = hooks.concat(hook);
        }
        else {
            hooks.push(hook);
        }
    }
    function injectMapHooks(target, mapHooks) {
        for (let type in mapHooks) {
            injectHook(type, target, mapHooks[type]);
        }
        return target;
    }
    function isElementLifecycleHook(name) {
        return [
            "beforeCreate" /* BEFORE_CREATE */,
            "beforeMount" /* BEFORE_MOUNT */,
            "beforeUnmount" /* BEFORE_UNMOUNT */,
            "beforeUpdate" /* BEFORE_UPDATE */,
            "updated" /* UPDATED */,
            "childrenMounted" /* CHILDREN_MOUNTED */,
            "unmounted" /* UNMOUNTED */,
            "mounted" /* MOUNTED */,
            "created" /* CREATED */
        ].includes(name);
    }
    function isComponentLifecycleHook(name) {
        return [
            "beforeCreate" /* BEFORE_CREATE */,
            "beforeMount" /* BEFORE_MOUNT */,
            "beforeUnmount" /* BEFORE_UNMOUNT */,
            "beforeUpdate" /* BEFORE_UPDATE */,
            "updated" /* UPDATED */,
            "unmounted" /* UNMOUNTED */,
            "mounted" /* MOUNTED */,
            "created" /* CREATED */,
            "activated" /* ACTIVATED */,
            "deactivated" /* DEACTIVATED */,
            "beforeRouteEnter" /* BEFORE_ROUTE_ENTER */,
            "beforeRouteLeave" /* BEFORE_ROUTE_LEAVE */,
            "beforeRouteUpdate" /* BEFORE_ROUTE_UPDATE */
        ].includes(name);
    }
    // is renderComponent hook ???
    /*
        binding is used for bind the callback context , it is necessary
    */
    function callHook(type, target, options = null, ...args) {
        // hooks is always be array
        const hooks = target[type];
        if (!hooks)
            return;
        var { binding, scheduler } = options || emptyObject;
        const hooksResults = hooks.map((hook) => {
            return scheduler ?
                scheduler(hook, binding, ...args) :
                hook.apply(binding, args);
        });
        // 返回钩子的调用结果
        return hooksResults;
    }
    const createHook = (type) => (hook) => injectHook(type, getCurrentInstance(), hook);
    const onCreated = createHook("created" /* CREATED */);
    const onBeforeMount = createHook("beforeMount" /* BEFORE_MOUNT */);
    const onMounted = createHook("mounted" /* MOUNTED */);
    const onBeforeUpdate = createHook("beforeUpdate" /* BEFORE_UPDATE */);
    const onUpdated = createHook("updated" /* UPDATED */);
    const onBeforeUnmount = createHook("beforeUnmount" /* BEFORE_UNMOUNT */);
    const onUnmounted = createHook("unmounted" /* UNMOUNTED */);

    function injectMixin(options, mixin) {
        for (let key in mixin) {
            switch (key) {
                case 'mixins':
                    injectMixins(options, options[key]);
                    break;
                case 'beforeCreate':
                case 'create':
                case 'created':
                case 'beforeMount':
                case 'mounted':
                case 'beforeUpdate':
                case 'updated':
                case 'beforeUnmount':
                case 'unmounted':
                    injectHook(key, options, mixin[key]);
                    break;
                default:
                    debugger;
            }
        }
        // ! 
        return options;
    }
    function injectMixins(target, mixins) {
        if (!mixins)
            return;
        mixins.forEach((mixin) => {
            injectMixin(target, mixin);
        });
        return target;
    }

    function createInstanceWatch(instance) {
        return (source, cb) => {
            let scope = instance.scope;
            if (isString(source)) {
                return watchTargetKey(scope, source, cb);
            }
            else if (isReactive(source)) {
                return watchReactive(source, cb);
            }
            else if (isRef(source)) {
                return watchRef(source, cb);
            }
        };
    }

    const createComponentInstance = (options, parent) => {
        let app = getCurrentApp();
        let instance = {
            app,
            parent,
            options,
            uid: uid(),
            update: null,
            isMounted: false,
            scope: null,
            renderScope: null,
            vnode: null,
            componentVnode: null,
            updatingComponentVnode: null,
            renderingVnode: null,
            slots: null,
            props: null,
            attrs: null,
            refs: null,
            events: null,
            root: null,
            appearRecord: null,
            emit: null,
            on: null,
            off: null,
            once: null,
            watch: null,
            renderEffect: null,
            render: options.render,
            propsOptions: options.propsOptions || emptyObject,
            emitsOptions: options.emitsOptions || emptyObject,
            createRender: options.createRender,
            components: shallowCloneObject(options.components),
            directives: options.directives,
            // hooks will always be an array
            create: shallowCloneArray(options.create),
            beforeCreate: shallowCloneArray(options.beforeCreate),
            created: shallowCloneArray(options.created),
            beforeMount: shallowCloneArray(options.beforeMount),
            mounted: shallowCloneArray(options.mounted),
            beforeUnmount: shallowCloneArray(options.beforeUnmount),
            unmounted: shallowCloneArray(options.unmounted),
            beforeUpdate: shallowCloneArray(options.beforeUpdate),
            updated: shallowCloneArray(options.updated),
            beforePatch: shallowCloneArray(options.beforePatch),
            activated: shallowCloneArray(options.activated),
            deactivated: shallowCloneArray(options.deactivated),
            beforeRouteEnter: shallowCloneArray(options.beforeRouteEnter),
            beforeRouteLeave: shallowCloneArray(options.beforeRouteLeave),
            beforeRouteUpdate: shallowCloneArray(options.beforeRouteUpdate)
        };
        injectMixins(instance, options.mixins);
        injectMixins(instance, app.mixins);
        instance.root = parent ? parent.root : instance;
        instance.scope = createScope(instance);
        instance.renderScope = createRenderScope(instance.scope);
        instance.emit = createInstanceEventEmitter(instance);
        instance.on = (event, handler) => addInstanceListener(instance, event, handler);
        instance.off = (event, handler) => removeInstanceListener(instance, event, handler);
        instance.once = (event, handler) => onceInstanceListener(instance, event, handler);
        instance.events = getInstanceEvents(instance);
        instance.watch = createInstanceWatch(instance);
        return instance;
    };

    /*
        pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
    */
    function normalizeDirective(directive) {
        return isFunction(directive) ? {
            mounted: directive,
            updated: directive
        } : directive;
    }
    function injectDirective(target, bindings) {
        var directives = target.directives ||= new Map();
        directives.set(bindings.directive, bindings);
    }
    function injectDirectives(target, directives) {
        directives.forEach((directive) => {
            injectDirective(target, directive);
        });
        return target;
    }
    /*
        参数和修饰符是一个数组结构但自身挂载了所有的key，可以灵活运用
    */
    function setOwnKey(arr) {
        for (let key of arr) {
            arr[key] = true;
        }
        return arr;
    }
    function processHook(type, vnode, pVnode = null) {
        switch (vnode.nodeType) {
            case 14 /* COMPONENT */:
                processComponentHook(type, vnode, pVnode);
                break;
            case 15 /* RENDER_COMPONENT */:
                processRenderComponentHook(type, vnode, pVnode);
                break;
            case 17 /* STYLE */:
            case 13 /* HTML_ELEMENT */:
            case 9 /* SVG_ELEMENT */:
                processElementHook(type, vnode, pVnode);
                break;
        }
    }
    function processComponentHook(type, vnode, pVnode) {
        const instance = vnode.instance;
        // 组件需要处理实例钩子
        const scope = instance.scope;
        callHook(type, instance, { binding: scope }, scope);
        var directives = vnode.directives;
        if (directives) {
            for (let [dir, bindings] of directives) {
                var _dir = normalizeDirective(dir);
                var hook = _dir[type];
                if (hook) {
                    if (pVnode) {
                        // 如果更新的话两个节点的指令应该完全相同
                        bindings.oldValue = pVnode.directives.get(dir).value;
                    }
                    bindings._arguments ? setOwnKey(bindings._arguments) : bindings._arguments = emptyArray;
                    bindings.filters ? setOwnKey(bindings.filters) : bindings.filters = emptyArray;
                    bindings.modifiers ? setOwnKey(bindings.modifiers) : bindings.modifiers = emptyArray;
                    hook(scope, bindings, vnode, pVnode);
                }
            }
        }
        // 节点钩子
        const vnodeHook = vnode?.props?.[`on${initialUpperCase(type)}`];
        if (vnodeHook) {
            vnodeHook(scope);
        }
    }
    function processElementHook(type, vnode, pVnode) {
        let el = vnode.el;
        var directives = vnode.directives;
        if (directives) {
            for (let [dir, bindings] of directives) {
                var _dir = normalizeDirective(dir);
                var hook = _dir[type];
                if (hook) {
                    if (pVnode) {
                        // 如果更新的话两个节点的指令应该完全相同
                        bindings.oldValue = pVnode.directives.get(dir)?.value;
                    }
                    bindings._arguments ? setOwnKey(bindings._arguments) : bindings._arguments = emptyArray;
                    bindings.filters ? setOwnKey(bindings.filters) : bindings.filters = emptyArray;
                    bindings.modifiers ? setOwnKey(bindings.modifiers) : bindings.modifiers = emptyArray;
                    hook(el, bindings, vnode, pVnode);
                }
            }
        }
        // 节点钩子
        const vnodeHook = vnode?.props?.[`on${initialUpperCase(type)}`];
        if (vnodeHook) {
            vnodeHook(el);
        }
    }
    function processRenderComponentHook(type, vnode, pVnode) {
        var directives = vnode.directives;
        if (directives) {
            for (let [dir, bindings] of directives) {
                var _dir = normalizeDirective(dir);
                var hook = _dir[type];
                if (hook) {
                    if (pVnode) {
                        // 如果更新的话两个节点的指令应该完全相同
                        bindings.oldValue = pVnode.directives.get(dir).value;
                    }
                    bindings._arguments ? setOwnKey(bindings._arguments) : bindings._arguments = emptyArray;
                    bindings.filters ? setOwnKey(bindings.filters) : bindings.filters = emptyArray;
                    bindings.modifiers ? setOwnKey(bindings.modifiers) : bindings.modifiers = emptyArray;
                    // 这里不能省略第一个参数，是为了和其他两种参数保持一致
                    hook(null, bindings, vnode, pVnode);
                }
            }
        }
        // 节点钩子
        const vnodeHook = vnode?.props?.[`on${initialUpperCase(type)}`];
        if (vnodeHook) {
            vnodeHook();
        }
    }

    /*
        当传入不合理的props时
    */
    function normalizePropsOptions(options) {
        if (isArray(options)) {
            options = arrayToMap(options, emptyObject);
        }
        else {
            for (let key in options) {
                if (!isObject(options[key])) {
                    options[key] = {
                        type: options[key]
                    };
                }
            }
        }
        return options;
    }
    function normalizeEmitsOptions(options) {
        if (isArray(options)) {
            return arrayToMap(options, emptyObject);
        }
        else {
            return options;
        }
    }

    function resolveOptions(options) {
        for (let key in options) {
            const value = options[key];
            switch (key) {
                case "props" /* PROPS */:
                    options.propsOptions = normalizePropsOptions(value);
                    break;
                case "emits" /* EMITS */:
                    options.emitsOptions = normalizeEmitsOptions(value);
                    break;
                case "template" /* TEMPLATE */:
                    options.createRender = compile(value);
                    break;
                case "render" /* RENDER */:
                    // todo
                    break;
                case "create" /* CREATE */:
                case "beforeCreate" /* BEFORE_CREATE */:
                case "created" /* CREATED */:
                case "beforeMount" /* BEFORE_MOUNT */:
                case "mounted" /* MOUNTED */:
                case "beforeUpdate" /* BEFORE_UPDATE */:
                case "updated" /* UPDATED */:
                case "beforeUnmount" /* BEFORE_UNMOUNT */:
                case "unmounted" /* UNMOUNTED */:
                case "beforePatch" /* BEFORE_PATCH */:
                case "activated" /* ACTIVATED */:
                case "deactivated" /* DEACTIVATED */:
                case "beforeRouteEnter" /* BEFORE_ROUTE_ENTER */:
                case "beforeRouteLeave" /* BEFORE_ROUTE_LEAVE */:
                case "beforeRouteUpdate" /* BEFORE_ROUTE_UPDATE */:
                    // 转换为数组形式
                    if (value && !isArray(value)) {
                        options[key] = [value];
                    }
                    break;
            }
            // 组件定义了name 可以递归 
            // 这种是组件配置的名称，但可以被create中注册的名字替代
            if (options["name" /* NAME */]) {
                (options["components" /* COMPOENNTS */] ||= {})[options["name" /* NAME */]] = options;
            }
        }
    }

    function useRefState(value, refOptions) {
        let scope = getCurrentScope();
        var state = ref(value, refOptions);
        var setState = createRefValueSetter(state);
        var watcher = (callback) => watchRef(state, callback);
        let i = 0;
        return new Proxy(emptyObject, {
            get(_, key) {
                switch (i) {
                    case 0:
                        // provide to scope
                        scope[key] = state;
                        i++;
                        return state;
                    case 1:
                        // provide to scope
                        scope[key] = setState;
                        i++;
                        return state;
                    case 2:
                        scope[key] = watcher;
                        i++;
                        return watcher;
                    default:
                        return null;
                }
            }
        });
    }

    // create , 优先级比options中的name高 , 用于组件递归
    function defineSelfName(name) {
        let instance = getCurrentInstance();
        let components = instance.components ||= {};
        // 将自身配置注册到自身组件中
        components[name] = instance.options;
    }
    function useUid() {
        return getCurrentInstance().uid;
    }
    function useOptions() {
        return getCurrentInstance().customOptions;
    }

    exports.$var = $var;
    exports.Comment = Comment;
    exports.ComputedRef = ComputedRef;
    exports.IMPORTANT = IMPORTANT;
    exports.IMPORTANT_KEY = IMPORTANT_KEY;
    exports.IMPORTANT_SYMBOL = IMPORTANT_SYMBOL;
    exports.NULL = NULL;
    exports.ReactiveEffect = ReactiveEffect;
    exports.ReactiveTypeSymbol = ReactiveTypeSymbol;
    exports.Ref = Ref;
    exports.TARGET_MAP = TARGET_MAP;
    exports.Text = Text;
    exports.addClass = addClass;
    exports.addInstanceListener = addInstanceListener;
    exports.addListener = addListener;
    exports.appendMedium = appendMedium;
    exports.arrayToMap = arrayToMap;
    exports.attr = attr;
    exports.builtInComponents = builtInComponents;
    exports.builtInDirectives = builtInDirectives;
    exports.cache = cache;
    exports.cacheDebounce = cacheDebounce;
    exports.cacheThrottle = cacheThrottle;
    exports.calc = calc;
    exports.callFn = callFn;
    exports.callHook = callHook;
    exports.camelize = camelize;
    exports.cleaarRefDeps = cleaarRefDeps;
    exports.clearCurrentInstance = clearCurrentInstance;
    exports.compile = compile;
    exports.computed = computed;
    exports.conicGradient = conicGradient;
    exports.createApp = createApp;
    exports.createComment = createComment;
    exports.createComponent = createComponent;
    exports.createComponentInstance = createComponentInstance;
    exports.createDeclaration = createDeclaration;
    exports.createElement = createElement;
    exports.createFragment = createFragment;
    exports.createFunction = createFunction;
    exports.createInstanceEventEmitter = createInstanceEventEmitter;
    exports.createKeyframe = createKeyframe;
    exports.createKeyframes = createKeyframes;
    exports.createMap = createMap;
    exports.createMapEntries = createMapEntries;
    exports.createMedia = createMedia;
    exports.createReactiveCollection = createReactiveCollection;
    exports.createReactiveEffect = createReactiveEffect;
    exports.createReactiveObject = createReactiveObject;
    exports.createReadonlyCollection = createReadonlyCollection;
    exports.createReadonlyObject = createReadonlyObject;
    exports.createRefValueSetter = createRefValueSetter;
    exports.createRenderScope = createRenderScope;
    exports.createSVGElement = createSVGElement;
    exports.createScope = createScope;
    exports.createSetter = createSetter;
    exports.createShallowReactiveCollection = createShallowReactiveCollection;
    exports.createShallowReactiveObject = createShallowReactiveObject;
    exports.createShallowReadonlyCollection = createShallowReadonlyCollection;
    exports.createShallowReadonlyObject = createShallowReadonlyObject;
    exports.createStyle = createStyle;
    exports.createStyleSheet = createStyleSheet;
    exports.createSupports = createSupports;
    exports.createText = createText;
    exports.cubicBezier = cubicBezier;
    exports.dateFormatRE = dateFormatRE;
    exports.debounce = debounce;
    exports.declare = declare;
    exports.defineScopeProperty = defineScopeProperty;
    exports.defineSelfName = defineSelfName;
    exports.defineTextModifier = defineTextModifier;
    exports.deleteActiveEffect = deleteActiveEffect;
    exports.deleteKeyframe = deleteKeyframe;
    exports.deleteMedium = deleteMedium;
    exports.deleteRule = deleteRule;
    exports.destructur = destructur;
    exports.display = display;
    exports.doFlat = doFlat;
    exports.doKeyframesAnimation = doKeyframesAnimation;
    exports.docCreateComment = docCreateComment;
    exports.docCreateElement = docCreateElement;
    exports.docCreateText = docCreateText;
    exports.dynamicMapKey = dynamicMapKey;
    exports.effect = effect;
    exports.emitInstancetEvent = emitInstancetEvent;
    exports.emptyArray = emptyArray;
    exports.emptyFunction = emptyFunction;
    exports.emptyObject = emptyObject;
    exports.error = error;
    exports.exec = exec;
    exports.execCaptureGroups = execCaptureGroups;
    exports.extend = extend;
    exports.extractExpressionVariables = extractExpressionVariables;
    exports.flatRules = flatRules;
    exports.getActiveEffect = getActiveEffect;
    exports.getComponent = getComponent;
    exports.getCurrentApp = getCurrentApp;
    exports.getCurrentInstance = getCurrentInstance;
    exports.getCurrentRenderScope = getCurrentRenderScope;
    exports.getCurrentScope = getCurrentScope;
    exports.getCustomScreensMedia = getCustomScreensMedia;
    exports.getDeps = getDeps;
    exports.getDepsMap = getDepsMap;
    exports.getDirective = getDirective;
    exports.getEL = getEL;
    exports.getElementComputedStyle = getElementComputedStyle;
    exports.getElementComputedStyleValue = getElementComputedStyleValue;
    exports.getElementStyle = getElementStyle;
    exports.getElementStyleValue = getElementStyleValue;
    exports.getEmptyObject = getEmptyObject;
    exports.getEventName = getEventName;
    exports.getInstanceEvents = getInstanceEvents;
    exports.getInstancetEventListeners = getInstancetEventListeners;
    exports.getLastSetKey = getLastSetKey;
    exports.getLastSetNewValue = getLastSetNewValue;
    exports.getLastSetOldValue = getLastSetOldValue;
    exports.getLastSetTarget = getLastSetTarget;
    exports.getLastVisitKey = getLastVisitKey;
    exports.getLastVisitTarget = getLastVisitTarget;
    exports.getStyle = getStyle;
    exports.getStyleValue = getStyleValue;
    exports.h = h;
    exports.hasOwn = hasOwn;
    exports.hexToRgb = hexToRgb;
    exports.hsl = hsl;
    exports.hsla = hsla;
    exports.hyphenate = hyphenate;
    exports.important = important;
    exports.initialLowerCase = initialLowerCase;
    exports.initialUpperCase = initialUpperCase;
    exports.injectDirectives = injectDirectives;
    exports.injectHook = injectHook;
    exports.injectMapHooks = injectMapHooks;
    exports.injectMixin = injectMixin;
    exports.injectMixins = injectMixins;
    exports.insertElement = insertElement;
    exports.insertKeyframe = insertKeyframe;
    exports.insertKeyframes = insertKeyframes;
    exports.insertMedia = insertMedia;
    exports.insertNull = insertNull;
    exports.insertRule = insertRule;
    exports.insertStyle = insertStyle;
    exports.insertSupports = insertSupports;
    exports.installAnimation = installAnimation;
    exports.isArray = isArray;
    exports.isComponentLifecycleHook = isComponentLifecycleHook;
    exports.isComputed = isComputed;
    exports.isDate = isDate;
    exports.isEffect = isEffect;
    exports.isElementLifecycleHook = isElementLifecycleHook;
    exports.isEvent = isEvent;
    exports.isFunction = isFunction;
    exports.isHTMLTag = isHTMLTag;
    exports.isNumber = isNumber;
    exports.isNumberString = isNumberString;
    exports.isObject = isObject;
    exports.isPromise = isPromise;
    exports.isProxy = isProxy;
    exports.isProxyType = isProxyType;
    exports.isReactive = isReactive;
    exports.isRef = isRef;
    exports.isSVGTag = isSVGTag;
    exports.isShallow = isShallow;
    exports.isString = isString;
    exports.isUndefined = isUndefined;
    exports.joinSelector = joinSelector;
    exports.keyOf = keyOf;
    exports.keyframe = keyframe;
    exports.keyframes = keyframes;
    exports.linearGradient = linearGradient;
    exports.makeMap = makeMap;
    exports.mark = mark;
    exports.markRaw = markRaw;
    exports.max = max;
    exports.mergeSelectors = mergeSelectors;
    exports.mergeSplitedSelector = mergeSplitedSelector;
    exports.mergeSplitedSelectorsAndJoin = mergeSplitedSelectorsAndJoin;
    exports.min = min;
    exports.mixin = mixin;
    exports.mount = mount;
    exports.mountAttributes = mountAttributes;
    exports.mountChildren = mountChildren;
    exports.mountClass = mountClass;
    exports.mountComponent = mountComponent;
    exports.mountDeclaration = mountDeclaration;
    exports.mountKeyframeRule = mountKeyframeRule;
    exports.mountRule = mountRule;
    exports.mountStyleRule = mountStyleRule;
    exports.mountStyleSheet = mountStyleSheet;
    exports.nextTick = nextTick;
    exports.normalizeClass = normalizeClass;
    exports.normalizeHandler = normalizeHandler;
    exports.normalizeKeyText = normalizeKeyText;
    exports.normalizeStyle = normalizeStyle;
    exports.objectStringify = objectStringify;
    exports.onBeforeClassMount = onBeforeClassMount;
    exports.onBeforeMount = onBeforeMount;
    exports.onBeforeUnmount = onBeforeUnmount;
    exports.onBeforeUpdate = onBeforeUpdate;
    exports.onCreated = onCreated;
    exports.onMounted = onMounted;
    exports.onSet = onSet;
    exports.onSetCallbacks = onSetCallbacks;
    exports.onUnmounted = onUnmounted;
    exports.onUpdated = onUpdated;
    exports.onceInstanceListener = onceInstanceListener;
    exports.onceListener = onceListener;
    exports.parseEventName = parseEventName;
    exports.parseInlineClass = parseInlineClass;
    exports.parseInlineStyle = parseInlineStyle;
    exports.parseNativeEventName = parseNativeEventName;
    exports.parseStyleValue = parseStyleValue;
    exports.patch = patch;
    exports.perspective = perspective;
    exports.processHook = processHook;
    exports.processVnodePrerender = processVnodePrerender;
    exports.queueJob = queueJob;
    exports.radialGradient = radialGradient;
    exports.reactive = reactive;
    exports.reactiveCollectionHandler = reactiveCollectionHandler;
    exports.reactiveHandler = reactiveHandler;
    exports.readonly = readonly;
    exports.readonlyCollectionHandler = readonlyCollectionHandler;
    exports.readonlyHandler = readonlyHandler;
    exports.ref = ref;
    exports.remountElement = remountElement;
    exports.removeAttribute = removeAttribute;
    exports.removeClass = removeClass;
    exports.removeElement = removeElement;
    exports.removeFromArray = removeFromArray;
    exports.removeInstanceListener = removeInstanceListener;
    exports.removeListener = removeListener;
    exports.renderList = renderList;
    exports.renderSlot = renderSlot;
    exports.resolveOptions = resolveOptions;
    exports.responsiveLayoutMedia = responsiveLayoutMedia;
    exports.rgb = rgb;
    exports.rgbToHex = rgbToHex;
    exports.rgba = rgba;
    exports.rotate = rotate;
    exports.rotate3d = rotate3d;
    exports.rotateY = rotateY;
    exports.scale = scale;
    exports.scale3d = scale3d;
    exports.scaleX = scaleX;
    exports.scaleY = scaleY;
    exports.scopeProperties = scopeProperties;
    exports.setActiveEffect = setActiveEffect;
    exports.setAttribute = setAttribute;
    exports.setCurrentInstance = setCurrentInstance;
    exports.setElementStyleDeclaration = setElementStyleDeclaration;
    exports.setElementTranstion = setElementTranstion;
    exports.setKeyText = setKeyText;
    exports.setKeyframesName = setKeyframesName;
    exports.setSelector = setSelector;
    exports.setStyleProperty = setStyleProperty;
    exports.setText = setText;
    exports.shallowCloneArray = shallowCloneArray;
    exports.shallowCloneObject = shallowCloneObject;
    exports.shallowReactive = shallowReactive;
    exports.shallowReactiveCollectionHandler = shallowReactiveCollectionHandler;
    exports.shallowReactiveHandler = shallowReactiveHandler;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowReadonlyCollectionHandler = shallowReadonlyCollectionHandler;
    exports.shallowReadonlyHandler = shallowReadonlyHandler;
    exports.shallowWatchReactive = shallowWatchReactive;
    exports.skew = skew;
    exports.skewX = skewX;
    exports.skewY = skewY;
    exports.sortChildren = sortChildren;
    exports.sortRules = sortRules;
    exports.splitSelector = splitSelector;
    exports.stringToMap = stringToMap;
    exports.stringify = stringify;
    exports.targetObserverSymbol = targetObserverSymbol;
    exports.ternaryChains = ternaryChains;
    exports.ternaryExp = ternaryExp;
    exports.throttle = throttle;
    exports.toAbsoluteValue = toAbsoluteValue;
    exports.toArray = toArray;
    exports.toArrowFunction = toArrowFunction;
    exports.toBackQuotes = toBackQuotes;
    exports.toDec = toDec;
    exports.toEventName = toEventName;
    exports.toHex = toHex;
    exports.toNativeEventName = toNativeEventName;
    exports.toNegativeValue = toNegativeValue;
    exports.toNumber = toNumber;
    exports.toPositiveValue = toPositiveValue;
    exports.toRaw = toRaw;
    exports.toReservedProp = toReservedProp;
    exports.toSingleQuotes = toSingleQuotes;
    exports.toTernaryExp = toTernaryExp;
    exports.track = track;
    exports.trackTargetObserver = trackTargetObserver;
    exports.translate3d = translate3d;
    exports.translateX = translateX;
    exports.translateY = translateY;
    exports.trigger = trigger;
    exports.triggerAllDepsMap = triggerAllDepsMap;
    exports.triggerTargetKey = triggerTargetKey;
    exports.triggerTargetObserver = triggerTargetObserver;
    exports.typeOf = typeOf;
    exports.uStringId = uStringId;
    exports.uVar = uVar;
    exports.uid = uid;
    exports.unionkeys = unionkeys;
    exports.unmount = unmount;
    exports.unmountChildren = unmountChildren;
    exports.unmountClass = unmountClass;
    exports.unmountComponent = unmountComponent;
    exports.unmountDeclaration = unmountDeclaration;
    exports.update = update;
    exports.updateAttributes = updateAttributes;
    exports.updateChildren = updateChildren;
    exports.updateClass = updateClass;
    exports.updateComponent = updateComponent;
    exports.updateDeclaration = updateDeclaration;
    exports.updateInstanceListeners = updateInstanceListeners;
    exports.updateStyleSheet = updateStyleSheet;
    exports.useBoolean = useBoolean;
    exports.useColor = useColor;
    exports.useDate = useDate;
    exports.useNumber = useNumber;
    exports.useOptions = useOptions;
    exports.usePromise = usePromise;
    exports.useRefState = useRefState;
    exports.useString = useString;
    exports.useUid = useUid;
    exports.warn = warn;
    exports.watchReactive = watchReactive;
    exports.watchRef = watchRef;
    exports.watchTargetKey = watchTargetKey;
    exports.withEventModifiers = withEventModifiers;
    exports.withScope = withScope;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
