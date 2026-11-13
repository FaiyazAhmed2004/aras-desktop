<script setup lang="ts">
import Fish from './Fish.vue';
</script>

<template>
  <g class="fish-tank" aria-label="Fish tank" transform="translate(120 300)">
    <g class="tank-shell-group" filter="url(#softShadow)">
      <ellipse cx="210" cy="115" rx="190" ry="30" class="tank-rim" />
      <path d="M 70 120 L 70 300 Q 208 370 350 300 L 350 120 Q 214 60 70 120 Z" class="tank-shell" />
      <ellipse cx="210" cy="300" rx="185" ry="30" class="tank-bottom" />
      <path d="M 92 130 L 92 282 Q 210 334 328 282 L 328 130 Q 210 170 92 130 Z" class="tank-water" />
      <ellipse cx="210" cy="138" rx="176" ry="24" class="tank-water-surface" />

      <g class="water-lines">
        <path d="M 110 175 Q 168 210 210 215 T 310 175" />
        <path d="M 108 225 Q 171 258 210 264 T 308 228" />
        <path d="M 112 270 Q 169 298 210 302 T 308 270" />
      </g>

      <g class="tank-grid">
        <path d="M 110 120 L 110 288" />
        <path d="M 158 120 L 158 288" />
        <path d="M 210 120 L 210 288" />
        <path d="M 260 120 L 260 288" />
        <path d="M 310 120 L 310 288" />
        <path d="M 110 180 Q 210 230 310 180" />
        <path d="M 110 236 Q 210 286 310 236" />
      </g>

      <g class="tank-rocks">
        <path d="M 108 286 Q 150 270 168 290 Q 134 305 108 286 Z" />
        <path d="M 165 290 Q 205 276 228 295 Q 200 312 165 290 Z" />
        <path d="M 235 294 Q 278 279 304 298 Q 270 314 235 294 Z" />
      </g>

      <g class="tank-plants">
        <path d="M 125 260 C 134 215, 142 218, 142 256" />
        <path d="M 150 258 C 164 214, 172 220, 174 260" />
        <path d="M 179 260 C 196 214, 206 218, 208 259" />
        <path d="M 274 260 C 286 214, 294 217, 294 257" />
      </g>
    </g>

    <g class="fish-group">
      <Fish :x="148" :y="210" :scale="0.92" />
      <Fish :x="210" :y="245" :scale="0.8" :flip="true" />
      <Fish :x="256" :y="182" :scale="0.78" />
      <Fish :x="292" :y="230" :scale="0.7" :flip="true" />
    </g>

    <g class="air-stone-group">
      <path d="M 298 230 L 332 230" class="air-delivery" />
      <circle cx="338" cy="230" r="6" class="bubble tiny" />
      <circle cx="350" cy="230" r="8" class="bubble small" />
      <circle cx="364" cy="230" r="10" class="bubble medium" />
    </g>
  </g>
</template>

<style scoped>
.fish-tank {
  filter: drop-shadow(0 18px 26px rgba(22, 72, 82, 0.12));
}

.tank-shell {
  fill: rgba(197, 232, 239, 0.9);
  stroke: #1a202c;
  stroke-width: 4;
}

.tank-rim,
.tank-bottom {
  fill: rgba(151, 205, 217, 0.8);
  stroke: #1a202c;
  stroke-width: 4;
}

.tank-water {
  fill: rgba(74, 177, 202, 0.32);
  stroke: rgba(28, 89, 108, 0.8);
  stroke-width: 2.5;
}

.tank-water-surface {
  fill: rgba(173, 240, 255, 0.3);
  stroke: rgba(26, 84, 103, 0.6);
  stroke-width: 1.5;
}

.water-lines,
.tank-grid,
.tank-rocks,
.tank-plants {
  fill: none;
}

.water-lines path,
.tank-grid path {
  stroke: rgba(41, 116, 139, 0.7);
  stroke-linecap: round;
  stroke-width: 2.5;
}

.tank-grid {
  stroke-dasharray: 0 0;
}

.tank-rocks path {
  fill: rgba(111, 142, 157, 0.7);
  stroke: rgba(26, 32, 44, 0.55);
  stroke-width: 2;
}

.tank-plants path {
  stroke: rgba(38, 121, 72, 0.8);
  stroke-width: 4;
  stroke-linecap: round;
  animation: plant-sway 4.5s ease-in-out infinite alternate;
}

.air-delivery {
  fill: none;
  stroke: #1a202c;
  stroke-width: 3;
  stroke-linecap: round;
}

.bubble {
  fill: rgba(118, 220, 255, 0.88);
  stroke: rgba(34, 88, 104, 0.7);
  stroke-width: 1.3;
  animation: bubble-rise 2.4s ease-in-out infinite;
}

.tiny {
  r: 5;
}

.small {
  animation-delay: 0.35s;
}

.medium {
  animation-delay: 0.7s;
}

@keyframes plant-sway {
  0% {
    transform: rotate(-4deg);
    transform-origin: center bottom;
  }
  100% {
    transform: rotate(4deg);
    transform-origin: center bottom;
  }
}

@keyframes bubble-rise {
  0% {
    transform: translateY(8px) scale(0.78);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-18px) scale(1.15);
    opacity: 0;
  }
}
</style>
