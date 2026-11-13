<script setup lang="ts">
</script>

<template>
  <g class="water-pipes" aria-label="Water circulation route">
    <g class="water-path path-inlet">
      <path d="M 410 472 C 490 472, 510 465, 620 430" class="pipe water-flow" />
      <path d="M 475 460 L 495 472 L 475 484" class="water-arrow" />
      <path d="M 540 448 L 560 460 L 540 472" class="water-arrow" />
    </g>

    <g class="water-path path-filter">
      <path d="M 900 400 L 1028 400" class="pipe water-flow" />
      <path d="M 960 386 L 980 400 L 960 414" class="water-arrow" />
      <path d="M 1010 386 L 1030 400 L 1010 414" class="water-arrow" />
    </g>

    <g class="water-path path-secondary">
      <path d="M 1100 430 C 1175 430, 1230 400, 1288 330" class="pipe water-flow" />
      <path d="M 1200 392 L 1218 402 L 1202 418" class="water-arrow" />
    </g>

    <g class="water-path path-return">
      <path d="M 1318 650 C 1220 720, 1010 715, 760 705 C 580 696, 420 630, 280 560 C 250 540, 220 520, 182 510" class="pipe water-flow return-flow" />
      <path d="M 1150 695 L 1170 708 L 1154 726" class="water-arrow" />
      <path d="M 780 694 L 800 708 L 784 726" class="water-arrow" />
      <path d="M 290 550 L 268 540 L 286 522" class="water-arrow" />
    </g>
  </g>
</template>

<style scoped>
.water-pipes {
  pointer-events: none;
}

.pipe {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 22;
  stroke: url(#pipe-gradient);
}

.water-flow {
  stroke-dasharray: 22 18;
  animation: water-move 3.8s linear infinite;
}

.return-flow {
  stroke: url(#pipe-gradient);
}

.water-arrow {
  fill: none;
  stroke: rgba(255, 255, 255, 0.96);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@keyframes water-move {
  0% {
    stroke-dashoffset: 0;
    opacity: 0.82;
  }
  100% {
    stroke-dashoffset: -220;
    opacity: 1;
  }
}
</style>
