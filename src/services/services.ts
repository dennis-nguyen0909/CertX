import * as auth from "./auth";
import * as media from "./media";
import * as certificatesType from "./certificates-type";
import * as user from "./user";
import * as permission from "./permission";
import * as student from "./student";

const services = {
  ...auth,
  ...media,
  ...certificatesType,
  ...user,
  ...permission,
  ...student,
};

export default services;
