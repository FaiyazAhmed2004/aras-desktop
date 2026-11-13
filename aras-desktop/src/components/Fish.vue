<script setup lang="ts">
interface Props {
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  scale: 1,
  flip: false,
});
</script>

<template>
  <g
    class="fish"
    :transform="`translate(${props.x} ${props.y}) scale(${props.scale} ${props.scale}) ${props.flip ? 'scale(-1 1)' : ''}`"
  >
    <ellipse cx="0" cy="0" rx="28" ry="14" class="fish-body" />
    <path d="M 18 -2 L 36 4 L 18 12 Z" class="fish-tail" />
    <path d="M 8 -10 Q 2 -18 0 -10" class="fish-fin" />
    <circle cx="-8" cy="-2" r="2.8" class="fish-eye" />
    <path d="M -10 6 Q -2 12 9 6" class="fish-mouth" />
  </g>
</template>

<style scoped>
.fish {
  animation: fish-sway 5.2s ease-in-out infinite alternate;
}

.fish-body {
  fill: #f7a35c;
  stroke: #1a202c;
  stroke-width: 2.5;
}

.fish-tail {
  fill: #f4a14f;
  stroke: #1a202c;
  stroke-width: 2.5;
}

.fish-fin {
  fill: none;
  stroke: #1a202c;
  stroke-width: 2;
  stroke-linecap: round;
}

.fish-eye {
  fill: #1a1a1a;
}

.fish-mouth {
  fill: none;
  stroke: #1a202c;
  stroke-width: 2;
  stroke-linecap: round;
}

@keyframes fish-sway {
  0% {
    transform: translateY(0px) rotate(-5deg);
  }
  100% {
    transform: translateY(-7px) rotate(5deg);
  }
}
</style>
