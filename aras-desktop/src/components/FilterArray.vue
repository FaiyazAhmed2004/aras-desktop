<script setup lang="ts">
</script>

<template>
  <g class="filter-array" aria-label="Filter array" transform="translate(620 180)">
    <g class="stand" filter="url(#softShadow)">
      <rect x="0" y="328" width="420" height="34" rx="16" class="stand-base" />
      <rect x="32" y="308" width="360" height="24" rx="12" class="stand-top" />
    </g>

    <g class="filter-group" filter="url(#softShadow)">
      <g class="filter filter-1">
        <rect x="0" y="0" width="82" height="250" rx="20" class="filter-body" />
        <rect x="18" y="-22" width="46" height="26" rx="12" class="filter-cap" />
        <path d="M 24 58 C 34 82, 38 103, 44 127" class="filter-inside" />
        <path d="M 45 58 C 58 90, 60 104, 66 128" class="filter-inside" />
      </g>

      <g class="filter filter-2">
        <rect x="94" y="0" width="82" height="250" rx="20" class="filter-body" />
        <rect x="112" y="-22" width="46" height="26" rx="12" class="filter-cap" />
        <path d="M 118 58 C 130 82, 136 104, 140 128" class="filter-inside" />
        <path d="M 139 58 C 150 84, 156 104, 161 128" class="filter-inside" />
      </g>

      <g class="filter filter-3">
        <rect x="188" y="0" width="82" height="250" rx="20" class="filter-body" />
        <rect x="206" y="-22" width="46" height="26" rx="12" class="filter-cap" />
        <path d="M 212 58 C 224 82, 230 104, 236 128" class="filter-inside" />
        <path d="M 234 58 C 247 84, 252 104, 259 128" class="filter-inside" />
      </g>

      <g class="filter filter-4">
        <rect x="282" y="0" width="82" height="250" rx="20" class="filter-body" />
        <rect x="300" y="-22" width="46" height="26" rx="12" class="filter-cap" />
        <path d="M 307 58 C 318 82, 324 104, 330 128" class="filter-inside" />
        <path d="M 327 58 C 340 84, 346 104, 352 128" class="filter-inside" />
      </g>
    </g>

    <g class="connector-lines">
      <path d="M 82 118 H 94" class="connector" />
      <path d="M 176 118 H 188" class="connector" />
      <path d="M 270 118 H 282" class="connector" />
    </g>
  </g>
</template>

<style scoped>
.filter-array {
  opacity: 0.97;
}

.stand-base,
.stand-top {
  fill: #8aa0a8;
  stroke: #1a202c;
  stroke-width: 3;
}

.stand-top {
  fill: #9eb1b8;
}

.filter-body {
  fill: #dfeef3;
  stroke: #1a202c;
  stroke-width: 4;
}

.filter-cap {
  fill: #edf9ff;
  stroke: #1a202c;
  stroke-width: 3;
}

.filter-inside {
  fill: none;
  stroke: rgba(52, 98, 116, 0.8);
  stroke-width: 3;
  stroke-linecap: round;
}

.connector {
  fill: none;
  stroke: #7eb7d9;
  stroke-width: 14;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
