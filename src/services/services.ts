import * as auth from "./auth";
import * as media from "./media";
import * as students from "./students";
import * as certificates from "./certificates";
const services = {
  ...auth,
  ...media,
  ...students,
  ...certificates,
};

export default services;
