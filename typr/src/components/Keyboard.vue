<script setup lang="ts">
import Key from './Key.vue'
</script>

<template>
  <div
    class="m-1 flex h-fit w-120 flex-col gap-1.5 rounded-md bg-base-200 p-1.5 text-neutral-content shadow-md"
  >
    <div class="flex flex-row gap-1.5">
      <Key char="Esc" />
      <Key char="1" />
      <Key char="2" />
      <Key char="3" />
      <Key char="4" />
      <Key char="5" />
      <Key char="6" />
      <Key char="7" />
      <Key char="8" />
      <Key char="9" />
      <Key char="0" />
      <Key char="-" />
      <Key char="=" />
      <Key char="Bspace" :size="2" />
      <Key char="Del" />
    </div>
    <div class="flex flex-row gap-1">
      <Key char="Tab" :size="1.5" />
      <Key char="Q" />
      <Key char="W" />
      <Key char="E" />
      <Key char="R" />
      <Key char="T" />
      <Key char="Y" />
      <Key char="U" />
      <Key char="I" />
      <Key char="O" />
      <Key char="P" />
      <Key char="[" />
      <Key char="]" />
      <Key char="\" :size="1.5" />
      <Key char="Home" />
    </div>

    <div class="flex flex-row gap-1">
      <Key char="Caps" :size="1.75" />
      <Key char="A" />
      <Key char="S" />
      <Key char="D" />
      <Key char="F" />
      <Key char="G" />
      <Key char="H" />
      <Key char="J" />
      <Key char="K" />
      <Key char="L" />
      <Key char=";" />
      <Key char="'" />
      <Key char="Enter" :size="2.25" />
      <Key char="PgUp" />
    </div>

    <div class="flex flex-row gap-1">
      <Key char="Shift" :size="2.25" />
      <Key char="Z" />
      <Key char="X" />
      <Key char="C" />
      <Key char="V" />
      <Key char="B" />
      <Key char="N" />
      <Key char="M" />
      <Key char="," />
      <Key char="." />
      <Key char="/" />
      <Key char="Shift" :size="1.75" />
      <Key char="Up" />
      <Key char="PgDn" />
    </div>

    <div class="flex flex-row gap-1">
      <Key char="Ctrl" :size="1.25" />
      <Key char="Win" :size="1.25" />
      <Key char="Alt" :size="1.25" />
      <Key char="" :size="6.25" />
      <Key char="Alt" />
      <Key char="Fn" />
      <Key char="Left" />
      <Key char="Down" />
      <Key char="Right" />
    </div>
  </div>
</template>

<style scoped>
#keyboard-grid div {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--color-base-200);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  user-select: none;
}
</style>
