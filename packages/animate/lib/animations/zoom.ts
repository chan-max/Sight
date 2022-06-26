import { cubicBezier, keyframe, scale3d, translate3d } from "@crush/renderer"

export const zoomIn = [keyframe('from', {
    transform: scale3d(0.3, 0.3, 0.3),
    opacity: 0
}), keyframe(50, {
    opacity: 1
})]


export const zoomInDown = [keyframe('from', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '-1000px', 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe(60, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '60px', 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]


export const zoomInUp = [keyframe('from', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '1000px', 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe(60, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '-60px', 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]


export const zoomInLeft = [keyframe('from', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d('-1000px', 0, 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe(60, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d('10px', 0, 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]



export const zoomInRight = [keyframe('from', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d('1000px', 0, 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe(60, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d('-10px', 0, 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]


export const zoomOut = [keyframe('from', {
    opacity: 1
}), keyframe(40, {
    opacity: 0,
    transform: scale3d(0.3, 0.3, 0.3)
}), keyframe('to', {
    opacity: 0
})]

export const zoomOutDown = [keyframe(40, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '-60px', 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe('to', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '2000px', 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]

export const zoomOutUp = [keyframe(40, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '60px', 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe('to', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '-2000px', 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]


export const zoomOutLeft = [keyframe(40, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d('42px', 0, 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe('to', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d('-2000px', 0, 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]


export const zoomOutRight = [keyframe(40, {
    opacity: 1,
    transform: [scale3d(0.475, 0.475, 0.475), translate3d('-42px', 0, 0)],
    animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
}), keyframe('to', {
    opacity: 0,
    transform: [scale3d(0.1, 0.1, 0.1), translate3d('2000px', 0, 0)],
    animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
})]