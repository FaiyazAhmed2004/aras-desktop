<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import FishTank from './FishTank.vue';
import AirPump from './AirPump.vue';
import AzollaBeds from './AzollaBeds.vue';
import FilterArray from './FilterArray.vue';
import WaterPipes from './WaterPipes.vue';
import AirLines from './AirLines.vue';
import VisualEffects from './VisualEffects.vue';

const scene = ref<SVGSVGElement | null>(null);
const viewport = ref({ width: 1600, height: 900 });
const bounds = computed(() => {
  const scale = Math.min(viewport.value.width / 1600, viewport.value.height / 900);
  const width = viewport.value.width / scale;
  const height = viewport.value.height / scale;
  return { x: (1600 - width) / 2, y: (900 - height) / 2, width, height };
});
const viewBox = computed(() => {
  const { x, y, width, height } = bounds.value;
  return `${x} ${y} ${width} ${height}`;
});
const observer = new ResizeObserver(([entry]) => {
  if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
    viewport.value = { width: entry.contentRect.width, height: entry.contentRect.height };
  }
});
onMounted(() => { if (scene.value) observer.observe(scene.value); });
onUnmounted(() => observer.disconnect());
</script>

<template>
  <svg ref="scene" class="scene" :viewBox="viewBox" role="img" aria-label="ARAS aquaponics illustration">
    <defs>
      <linearGradient id="backgroundGlow" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#bfe5ff" />
        <stop offset="45%" stop-color="#a9d9f7" />
        <stop offset="100%" stop-color="#91c9ed" />
      </linearGradient>
      <linearGradient id="groundShade" x1="0%" x2="0%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#dfeec7" />
        <stop offset="100%" stop-color="#c9dfb0" />
      </linearGradient>
      <linearGradient id="pipe-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stop-color="#7ad9ff" />
        <stop offset="22%" stop-color="#57b8ef" />
        <stop offset="52%" stop-color="#2d9ee6" />
        <stop offset="75%" stop-color="#4ec7ff" />
        <stop offset="100%" stop-color="#b7f4ff" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="180%">
        <feDropShadow dx="0" dy="12" stdDeviation="11" flood-color="#1a202c" flood-opacity="0.12" />
      </filter>
    </defs>

    <g class="scene-background-layer">
      <rect v-bind="bounds" class="scene-bg" />
      <path :d="`M ${bounds.x} 660 L 0 660 Q 520 580 840 650 T 1600 660 L ${bounds.x + bounds.width} 660 V ${bounds.y + bounds.height} H ${bounds.x} Z`" class="ground" />
      <path d="M 0 640 Q 440 600 720 660 T 1600 650" class="ground-haze" />
    </g>

    <g class="scene-layer filter-layer">
      <FilterArray />
    </g>

    <g class="scene-layer azolla-layer">
      <AzollaBeds />
    </g>

    <g class="scene-layer fish-tank-layer">
      <FishTank />
    </g>

    <g class="scene-layer pump-layer">
      <AirPump />
    </g>

    <g class="scene-layer pipes-layer">
      <WaterPipes />
      <AirLines />
    </g>

    <g class="scene-layer effects-layer">
      <VisualEffects />
    </g>
  </svg>
</template>

<style scoped>
.scene {
  width: 100%;
  height: 100%;
  display: block;
  background: linear-gradient(135deg, #bfe5ff, #91c9ed);
}

.scene-bg {
  fill: url(#backgroundGlow);
}

.ground {
  fill: url(#groundShade);
}

.ground-haze {
  fill: none;
  stroke: rgba(104, 146, 91, 0.22);
  stroke-width: 5;
  stroke-linecap: round;
}

.scene-layer {
  isolation: isolate;
}
</style>
