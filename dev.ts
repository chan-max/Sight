import { createApp, doKeyframesAnimation, getElementStyle, h, hasOwn, important, isReactive, isRef, markRaw, mountDeclaration, onCreated, onMounted, onSet, removeElement, setElementStyleDeclaration } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";
import { useBoolean } from "@crush/reactivity/lib/custom/boolean";
import { useRefState } from "@crush/core/lib/instance/refState";
import { createRouter } from "./packages/router/lib/router";
import { watchComputed } from "@crush/reactivity/lib/watchComputed";

var app = createApp({ container: '#app', })

console.log(app);

const tom = {
    template: ` 
    <button @click="add"> add </button>
    <div class="box" --if="x%2 === 0" > tom </div>
    `,
    create({ $self }: any) {
        $self.x = 0
        $self.add = () => $self.x++
    }
}

function jerry() {
    return h('div', { class: 'box' }, 'jerry')
}

app.mount({
    components: {
        tom, jerry
    },
    template:/*html*/`
    <button @click="$emit('x')" --bind="{id:'uid'}"> {{count}} </button>
    `,
    create({ $self }: any) {
        let { count, setCount, onCountChange } = useRefState(0)
        $self.$on('x', () => {
            console.log('okok');
        })
    }
})




