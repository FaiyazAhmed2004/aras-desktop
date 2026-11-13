<script setup lang="ts">
</script>

<template>
  <g class="azolla-beds" aria-label="Azolla growing beds" transform="translate(1030 230)">
    <g class="support-frame" filter="url(#softShadow)">
      <rect x="0" y="0" width="280" height="24" rx="12" class="rack-beam top" />
      <rect x="0" y="126" width="280" height="24" rx="12" class="rack-beam middle" />
      <rect x="0" y="252" width="280" height="24" rx="12" class="rack-beam bottom" />
      <rect x="20" y="0" width="18" height="288" rx="9" class="rack-column" />
      <rect x="120" y="0" width="18" height="288" rx="9" class="rack-column" />
      <rect x="220" y="0" width="18" height="288" rx="9" class="rack-column" />
    </g>

    <g class="tray tray-top" filter="url(#softShadow)">
      <rect x="36" y="36" width="200" height="76" rx="16" class="bed-shell" />
      <g class="bed-plants">
        <path d="M 58 92 C 70 70, 77 71, 77 97" />
        <path d="M 88 92 C 100 66, 108 70, 108 97" />
        <path d="M 118 92 C 130 67, 140 72, 140 97" />
        <path d="M 150 92 C 164 69, 174 70, 174 97" />
        <path d="M 182 92 C 196 69, 206 70, 206 97" />
      </g>
    </g>

    <g class="tray tray-mid" filter="url(#softShadow)">
      <rect x="36" y="162" width="200" height="76" rx="16" class="bed-shell" />
      <g class="bed-plants">
        <path d="M 58 218 C 70 192, 78 194, 78 224" />
        <path d="M 90 218 C 104 194, 112 196, 112 224" />
        <path d="M 122 218 C 136 192, 146 196, 146 224" />
        <path d="M 156 218 C 170 194, 180 198, 180 224" />
        <path d="M 188 218 C 202 192, 212 196, 212 224" />
      </g>
    </g>

    <g class="tray tray-bottom" filter="url(#softShadow)">
      <rect x="36" y="288" width="200" height="76" rx="16" class="bed-shell" />
      <g class="bed-plants">
        <path d="M 58 344 C 72 316, 80 320, 80 352" />
        <path d="M 92 344 C 106 316, 114 320, 114 352" />
        <path d="M 126 344 C 140 316, 148 320, 148 352" />
        <path d="M 160 344 C 174 316, 182 320, 182 352" />
        <path d="M 194 344 C 208 316, 216 320, 216 352" />
      </g>
    </g>
  </g>
</template>

<style scoped>
.support-frame {
  fill: none;
}

.rack-beam,
.rack-column {
  fill: #6d7a82;
  stroke: #1a202c;
  stroke-width: 3;
}

.bed-shell {
  fill: #5a6d68;
  stroke: #1a202c;
  stroke-width: 4;
}

.bed-plants path {
  stroke: #79d567;
  stroke-width: 5;
  fill: none;
  stroke-linecap: round;
  animation: plant-sway 4s ease-in-out infinite alternate;
}

@keyframes plant-sway {
  0% {
    transform: rotate(-3deg);
    transform-origin: center bottom;
  }
  100% {
    transform: rotate(3deg);
    transform-origin: center bottom;
  }
}
</style>
