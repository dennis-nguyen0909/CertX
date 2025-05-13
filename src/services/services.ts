import * as auth from "./auth";
import * as media from "./media";
import * as certificatesType from "./certificates-type";
const services = {
  ...auth,
  ...media,
  ...certificatesType,
};

export default services;
