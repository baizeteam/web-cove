import {
  Button,
  List,
  Loading,
  Popup,
  Radio,
  RadioGroup,
  Slider,
  Tab,
  Tabs,
  Toast,
} from "vant";

export default {
  install(app) {
    app.use(Popup);
    app.use(Button);
    app.use(RadioGroup);
    app.use(Radio);
    app.use(Toast);
    app.use(Loading);
    app.use(Tab);
    app.use(Tabs);
    app.use(List);
    app.use(Slider);
  },
};
