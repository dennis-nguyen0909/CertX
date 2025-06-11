import * as auth from "./auth";
import * as media from "./media";
import * as certificatesType from "./certificates-type";
import * as certificates from "./certificates";
import * as user from "./user";
import * as permission from "./permission";
import * as student from "./student";
import * as classService from "./class";
import * as dashboard from "./dashboard";

const services = {
  ...auth,
  ...media,
  ...certificatesType,
  ...certificates,
  ...user,
  ...permission,
  ...student,
  ...classService,
  ...dashboard,
};

export default services;
