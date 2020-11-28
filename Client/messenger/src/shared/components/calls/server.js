import { url } from "./config";
import { defaultHeaders } from "../utils/short";
import axios from "axios";
import { Subject } from "rxjs";
const request = require("request");
const formData = require("form-data");
const globalMessages = new Subject();
class Api {
  static nonSecretUrls = [
    url.base + url.login,
    url.base + url.thirdpartylogin,
    url.base + url.thirdPartyAuth
  ];

  static initApiInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        console.log("intercepting --", config);
        if (this.nonSecretUrls.indexOf(config.url) == -1) {
          const lS = localStorage.getItem(
            Object.keys(localStorage).filter((v) => v != "id")[0]
          );
          if (!lS) {
            Promise.reject({
              type: "intercept",
              message: url.clientAccessDenied,
            });
            return;
          }
          config.headers = { ...config.headers, secret: lS, type: "web" };
          return config;
        }
        config.headers = { ...config.headers, type: "web" };
        return config;
      },
      (error) => {
        console.log(error);
        Promise.reject({ type: "intercept", message: url.clientAccessDenied });
      }
    );

    axios.interceptors.response.use(null, (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        this.nonSecretUrls.indexOf(error.response.config.url) == -1
      ) {
        globalMessages.next({ message: "Login", reset: true });
      }
      return Promise.reject(error);
    });
  }

  static generateOtp(identity, isAuthorized) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.login;
      const body = { identity: identity, isAuth: isAuthorized };
      let a = !isAuthorized ? delete body.isAuth : false;
      axios
        .post(finalUrl, body)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static verifyOtp(otp, identity) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.login;
      const body = { otp: otp, identity: identity };
      axios
        .post(finalUrl, body)
        .then((response) => {
          console.log(response)
          resolve(response)
        })
        .catch((err) => reject(err));
    });
  }

  static logout(userId) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.logout;
      axios
        .get(finalUrl, { headers: { userId: userId } })
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static getProfile(id) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.profile.get + `/${id}`;
      axios
        .get(finalUrl)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static updateProfile(name, imageBlob) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.profile.update;
      const body = { name: name, imageBlob: imageBlob };
      axios
        .put(finalUrl, body)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static sendRequest(id) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.social.send;
      axios
        .put(finalUrl, { toUserId: id })
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static revokeRequest(id) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.social.revoke;
      axios
        .put(finalUrl, { toUserId: id })
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static respondRequest(id, answer) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.social.respond;
      axios
        .put(finalUrl, { toUserId: id, answer: answer })
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static removeUser(id) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.social.remove;
      axios
        .put(finalUrl, { toUserId: id })
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static getSocialStatus(id) {
    return new Promise((resolve, reject) => {
      const finalUrl = url.base + url.social.getStatus + "/" + id;
      axios
        .get(finalUrl)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static getMyNetwork(type, start, count) {
    return new Promise((resolve, reject) => {
      const finalUrl =
        url.base + url.social.network + `/${type}/${start}/${count}`;
      axios
        .get(finalUrl)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static formatResponse(response) {
    if (response.status_code <= 201) {
      console.log(response);
      return response;
    }
    throw new Error(response.message);
  }

  static getGoogleId(accessToken) {
    return axios.get(url.googleOauth, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "content-type": "application/x--www-form-urlencoded",
      },
    });
  }

  static thirdPartyAuthorization(type, token){
    const finalUrl = url.base + url.thirdPartyAuth;
    return axios.get(finalUrl,{ headers: { token: token, loginType : type }});
  }

  static googleOauth =
    "https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http://localhost:3000/thirdpartylogin&client_id=317523125768-tlh2b4ur3mbod03cu7f3gp4ripscms56.apps.googleusercontent.com";

  static getUsers(displayName, startIndex, totalCount) {
    return new Promise((R, r) => {
      const finalUrl =
        url.base +
        url.social.get +
        `${displayName}/${startIndex}/${totalCount}`;
      axios
        .get(finalUrl)
        .then((resp) => R(resp))
        .catch((e) => r(e));
    });
  }
}

class ErrorMessages {}
export { Api, ErrorMessages, globalMessages };
