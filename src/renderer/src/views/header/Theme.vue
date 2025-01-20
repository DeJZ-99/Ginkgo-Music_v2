<template>
  <div class="theme-checkbox">
    <input ref="switchRef" value="private" name="switch" id="switch" type="checkbox" class="switch" @click="setTheme" />
    <label for="switch">
      <span class="toggletext">
        <span class="unchecked">
          <span class="iconfont">&#xe866;</span>
        </span>
        <span class="checked">
          <span class="iconfont">&#xe61a;</span>
        </span>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@renderer/store/store";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";

const store = useThemeStore();

const { theme } = storeToRefs(store);
const switchRef = ref<HTMLInputElement | null>(null);

const setTheme = (): void => {
  const isDark: boolean = theme.value.includes('dark');
  theme.value = isDark ? theme.value.replace('dark', 'light') : theme.value.replace('light', 'dark');
};

watch(
  () => theme.value,
  (val: string) => {
    const isDark: boolean = val.includes('dark');
    switchRef.value!.checked = isDark ? false : true;
  }
);

onMounted(() => {
  switchRef.value!.checked = theme.value === 'dark' || theme.value === 'dark-colorful' ? false : true;
});
</script>

<style lang="less" scoped>
.theme-checkbox {
  -webkit-app-region: no-drag;

  .switch {
    display: none;

    &:checked+label::before {
      background-color: #ffd700;
    }

    &:checked+label::after {
      transform: translate3d(10px, 0, 0);
    }

    &:checked+label .unchecked {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }

    &:checked+label .checked {
      opacity: 1;
      transform: none;
    }
  }

  .switch+label {
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 12px;
    line-height: 18px;
    position: relative;
    user-select: none;

    &::after,
    &::before {
      content: "";
      display: block;
    }

    &::before {
      border-radius: 500px;
      height: 15px;
      margin-right: 8px;
      transition: background-color 0.125s ease-out;
      width: 25px;
      background-color: #333333;
    }

    &::after {
      border-radius: 13px;
      height: 13px;
      left: 1px;
      position: absolute;
      top: 2.5px;
      transition: transform 0.125s ease-out;
      width: 13px;
      background-color: #ffffff;
      box-shadow: 0 0 0 #b8b8b8, 0 0 0 #ffffff, inset 8px 8px 8px #b8b8b8,
        inset -8px -8px 8px #ffffff;
    }

    .toggletext {
      display: block;
      font-weight: bold;
      height: 18px;
      overflow: hidden;
      position: relative;
      width: 25px;
    }

    .unchecked,
    .checked {
      left: 0;
      position: absolute;
      top: 0;
      transition: transform 0.125s ease-out, opacity 0.125s ease-out;
    }

    .unchecked {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }

    .checked {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
  }
}
</style>