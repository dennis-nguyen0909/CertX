import * as auth from "./auth";
import * as media from "./media";
import * as certificatesType from "./certificates-type";
import * as certificates from "./certificates";
import * as user from "./user";
import * as permission from "./permission";
import * as student from "./student";
import * as classService from "./class";
import * as degreeService from "./degree";
import * as ratingService from "./rating";
import * as educationModeService from "./education-mode";
import * as dashboardService from "./dashboard";
import * as walletService from "./wallet";

const services = {
  ...auth,
  ...media,
  ...certificatesType,
  ...certificates,
  ...user,
  ...permission,
  ...student,
  ...classService,
  ...degreeService,
  ...ratingService,
  ...educationModeService,
  ...dashboardService,
  ...walletService,
};

export default services;
