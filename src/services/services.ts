import * as auth from "./auth";
import * as media from "./media";
import * as students from "./students";
const services = {
  ...auth,
  ...media,
  ...students,
};

export default services;
