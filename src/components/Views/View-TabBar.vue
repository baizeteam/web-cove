<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import moodCodeIcon from "@/assets/images/tab-bar/moodCode.png";
import moodCodeActiveIcon from "@/assets/images/tab-bar/moodCode-active.png";
import WarningIcon from "@/assets/images/tab-bar/warning.png";
import WarningActiveIcon from "@/assets/images/tab-bar/warning-active.png";
import TalkIcon from "@/assets/images/tab-bar/talk.png";
import TalkActiveIcon from "@/assets/images/tab-bar/talk-active.png";
import UserIcon from "@/assets/images/tab-bar/user.png";
import UserActiveIcon from "@/assets/images/tab-bar/user-active.png";
import { useLayoutStore } from "@/stores/layout.store";

const router = useRouter();
const route = useRoute();
enum promiseEnum {
  warning = "warning",
  talk = "talk",
  moodCode = "moodCode",
  user = "user",
}

interface ITabbarItem {
  title: string;
  icon: string;
  activeIcon: string;
  path: string;
  name: promiseEnum;
}
const tabbarList = ref<ITabbarItem[]>([
  {
    title: "预警",
    icon: WarningIcon,
    activeIcon: WarningActiveIcon,
    path: "/warning",
    name: promiseEnum.warning,
  },
  {
    title: "谈话",
    icon: TalkIcon,
    activeIcon: TalkActiveIcon,
    path: "/talk",
    name: promiseEnum.talk,
  },
  {
    title: "红码",
    icon: moodCodeIcon,
    activeIcon: moodCodeActiveIcon,
    path: "/moodCode",
    name: promiseEnum.moodCode,
  },
  {
    title: "我的",
    icon: UserIcon,
    activeIcon: UserActiveIcon,
    path: "/user",
    name: promiseEnum.user,
  },
]);

const layoutStore = useLayoutStore();
const { footer } = toRefs(layoutStore);

function getCurrentTab() {
  return tabbarList.value.findIndex((item) => item.path === route.path);
}

const activeIdx = ref(getCurrentTab());

function onRoute(item: ITabbarItem) {
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
        v-for="(tab, idx) in tabbarList"
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
