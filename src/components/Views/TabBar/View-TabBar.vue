<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import recommendIcon from "@/assets/images/tab-bar/recommend.png";
import recommendActiveIcon from "@/assets/images/tab-bar/recommend-active.png";
import UserIcon from "@/assets/images/tab-bar/user.png";
import UserActiveIcon from "@/assets/images/tab-bar/user-active.png";
import { useLayoutStore } from "@/stores/layout.store.ts";

const router = useRouter();
const route = useRoute();
enum promiseEnum {
  moodCode = "moodCode",
  user = "user",
}

interface Item {
  title: string;
  icon: string;
  activeIcon: string;
  path: string;
  name: promiseEnum;
}
const list = ref<Item[]>([
  {
    title: "发现",
    icon: recommendIcon,
    activeIcon: recommendActiveIcon,
    path: "/recommend",
    name: promiseEnum.moodCode,
  },
  {
    title: "学习",
    icon: UserIcon,
    activeIcon: UserActiveIcon,
    path: "/study",
    name: promiseEnum.user,
  },
]);

const layoutStore = useLayoutStore();
const { footer } = toRefs(layoutStore);

function getCurrentTab() {
  return list.value.findIndex((item) => item.path === route.path);
}

const activeIdx = ref(getCurrentTab());

function onRoute(item: Item) {
  // talkStore.setTabActive("0");
  router.replace(item.path);
}
</script>

<template>
  <div class="tab-bar-wrap">
    <div
      class="tab-bar-content"
      :style="{
        height: footer.height,
      }"
    >
      <div
        v-for="(tab, idx) in list"
        v-show="promiseEnum[tab.name]"
        :key="idx"
        class="tab-item justify-center"
        @click="onRoute(tab)"
      >
        <div>
          <div
            class="tab-icon background-image-no-repeat"
            :style="{
              backgroundImage: `url(${activeIdx === idx ? tab.activeIcon : tab.icon})`,
            }"
          ></div>
          <div class="tab-text" :class="{ active: activeIdx === idx }">
            {{ tab.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url("@/assets/styles/modules/safe-area.less");
.background-image-no-repeat {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.tab-bar-wrap {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
  .safe-bottom-area();

  .tab-bar-content {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    //height: 55px;
    padding: 8px 0 9px;

    .tab-item {
      flex: 1;
      font-size: 0;
      text-align: center;

      .tab-icon {
        position: relative;
        width: 30px;
        height: 26px;
      }

      .tab-text {
        font-size: 12px;
        color: rgba(31, 34, 38, 0.8);
        line-height: 14px;
        margin-top: 2px;
      }

      .active {
        font-weight: bold;
        color: #4f80ff;
      }
    }
  }
}
</style>
