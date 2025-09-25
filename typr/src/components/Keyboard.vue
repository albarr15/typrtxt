<script setup lang="ts">
import Key from './Key.vue'

import { defineProps, ref, onMounted } from 'vue'

// Highlight key on press

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    event.preventDefault()

    // console.log('Key pressed: ' + event.code)

    const keyPressed = document.getElementById(event.code)
    if (keyPressed) {
      keyPressed.classList.add('bg-primary/50')
      setTimeout(() => {
        keyPressed.classList.remove('bg-primary/50')
      }, 100)
    }
  })
})
</script>

<template>
  <div
    class="m-1 flex h-fit w-150 flex-col gap-1.5 rounded-md bg-base-300 p-1.5 text-neutral-content shadow-md"
  >
    <div class="flex flex-row gap-1.5">
      <Key char="Esc" id="Escape" />
      <Key char="1" char2="!" id="Digit1" />
      <Key char="2" char2="@" id="Digit2" />
      <Key char="3" char2="#" id="Digit3" />
      <Key char="4" char2="$" id="Digit4" />
      <Key char="5" char2="%" id="Digit5" />
      <Key char="6" char2="^" id="Digit6" />
      <Key char="7" char2="&" id="Digit7" />
      <Key char="8" char2="*" id="Digit8" />
      <Key char="9" char2="(" id="Digit9" />
      <Key char="0" char2=")" id="Digit0" />
      <Key char="-" char2="_" id="Minus" />
      <Key char="=" char2="+" id="Equal" />
      <Key char="Bspace" :size="2" id="Backspace" />
      <Key char="Del" id="Delete" />
    </div>
    <div class="flex flex-row gap-1">
      <Key char="Tab" :size="1.5" id="Tab" />
      <Key char="Q" id="KeyQ" />
      <Key char="W" id="KeyW" />
      <Key char="E" id="KeyE" />
      <Key char="R" id="KeyR" />
      <Key char="T" id="KeyT" />
      <Key char="Y" id="KeyY" />
      <Key char="U" id="KeyU" />
      <Key char="I" id="KeyI" />
      <Key char="O" id="KeyO" />
      <Key char="P" id="KeyP" />
      <Key char="[" char2="{" id="BracketLeft" />
      <Key char="]" char2="}" id="BracketRight" />
      <Key char="\" char2="|" :size="1.5" id="Backslash" />
      <Key char="Home" id="Home" />
    </div>

    <div class="flex flex-row gap-1">
      <Key char="Caps" :size="1.75" id="CapsLock" />
      <Key char="A" id="KeyA" />
      <Key char="S" id="KeyS" />
      <Key char="D" id="KeyD" />
      <Key char="F" id="KeyF" />
      <Key char="G" id="KeyG" />
      <Key char="H" id="KeyH" />
      <Key char="J" id="KeyJ" />
      <Key char="K" id="KeyK" />
      <Key char="L" id="KeyL" />
      <Key char=";" char2=":" id="Semicolon" />
      <Key char="'" char2='"' id="Quote" />
      <Key char="Enter" :size="2.25" id="Enter" />
      <Key char="PgUp" id="PageUp" />
    </div>

    <div class="flex flex-row gap-1">
      <Key char="Shift" :size="2.25" id="ShiftLeft" />
      <Key char="Z" id="KeyZ" />
      <Key char="X" id="KeyX" />
      <Key char="C" id="KeyC" />
      <Key char="V" id="KeyV" />
      <Key char="B" id="KeyB" />
      <Key char="N" id="KeyN" />
      <Key char="M" id="KeyM" />
      <Key char="," char2="<" id="Comma" />
      <Key char="." char2=">" id="Period" />
      <Key char="/" char2="?" id="Slash" />
      <Key char="Shift" :size="1.75" id="ShiftRight" />
      <Key char="Up" id="ArrowUp" />
      <Key char="PgDn" id="PageDown" />
    </div>

    <div class="flex flex-row gap-1">
      <Key char="Ctrl" :size="1.25" id="ControlLeft" />
      <Key char="Win" :size="1.25" id="MetaLeft" />
      <Key char="Alt" :size="1.25" id="AltLeft" />
      <Key char="" :size="6.25" id="Space" />
      <Key char="Alt" id="AltRight" />
      <Key char="Fn" />
      <Key char="Left" id="ArrowLeft" />
      <Key char="Down" id="ArrowDown" />
      <Key char="Right" id="ArrowRight" />
    </div>
  </div>
</template>

<style scoped></style>
