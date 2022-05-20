
export const headShake = keyframes('headShake', [
    keyframe(0, { transform: translateX(0) }),
    keyframe(6.5, { transform: [translateX('-6px'), rotateY(-9)] }),
    keyframe(18.5, { transform: [translateX('5px'), rotateY(7)] }),
    keyframe(31.5, { transform: [translateX('-3px'), rotateY(-5)] }),
    keyframe(43.5, { transform: [translateX('2px'), rotateY(3)] }),
    keyframe(50, { transform: translateX(0) }),
])