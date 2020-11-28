const database = require("../../../database/database");
const utils = require("../../../utils");
const aws = require("../../AWS/main");
const response = require("../../responseController");
const table = require("../../../database/tables");
const tableKeys = table.TABLE_KEYS;
const tables = table.TABLES;
const uuid = require("uuid");
const common = response.ResponseMessages.common;
const socialMessages = response.ResponseMessages.social;
const socialCode = response.ErrorResponseCode.social;
const code = response.ErrorResponseCode.common;
const socialClass = require("./socialClass");
const queries = require("../../../database/queries");

const unknown = (res, e, req) =>
  res
    .status(utils.UNKNOWN)
    .send(
      utils.SET_RESPONSE(
        utils.FIVE_HUNDRED,
        e,
        false,
        utils.CURRENT_DATE,
        req.originalUrl
      )
    );

const search = async (req, res) => {
  try {
    const superUser = req.superUser;
    const params = req.params;
    const name = req.params.name.trim().toLowerCase();
    if (isNaN(params.count) || isNaN(params.start)) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED,
        socialMessages.invalidSearchParams,
        utils.DATE,
        req.originalUrl
      );
      res.status(utils.BAD_REQUEST).send(badResponse);
      return;
    } else if (!name.match(/^([a-z|0-9]){1,20}$/)) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED,
        socialMessages.invalidSearchName,
        utils.DATE,
        req.originalUrl
      );
      res.status(utils.BAD_REQUEST).send(badResponse);
      return;
    }
    const response = await database.getUsers(
      superUser.id,
      name,
      params.count,
      params.start
    );
    console.log(response);
    if (response.length > 0) {
      response[1] = response[1].map((resp) => {
        return {
          ...resp,
          image:
            resp.image && resp.image.toString().length > 0
              ? resp.image.toString()
              : null,
        };
      });
    }
    res.status(utils.SUCCESS).send({ ...response[0][0], users: response[1] });
    return;
  } catch (e) {
    console.log(e);
    unknown(res, e, req);
  }
};

const sendRequest = async (req, res) => {
  try {
    const fromUserData = req.superUser;
    const toUserId = req.body.toUserId;
    const response = await database.sendFriendRequest(
      fromUserData.id,
      toUserId
    );
    if (response.affectedRows === 0) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED,
        socialMessages.requestPending,
        utils.CURRENT_DATE,
        req.originalUrl
      );
      res.status(utils.BAD_REQUEST).send(badResponse);
      return;
    }
    res.send();
    return;
  } catch (e) {
    unknown(res, e, req);
  }
};

const removeUser = async (req, res) => {
  try {
    const fromUserData = req.superUser;
    const toUserId = req.body.toUserId;
    const response = await database.removeFriendRequest(
      fromUserData.id,
      toUserId
    );
    if (response.affectedRows === 0) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED_FOUR,
        socialMessages.requestNotFound,
        utils.CURRENT_DATE,
        req.originalUrl
      );
      res.status(utils.NOT_FOUND).send(badResponse);
      return;
    }
    res.send();
    return;
  } catch (e) {
    unknown(res, e, req);
  }
};

const respondRequest = async (req, res) => {
  try {
    const fromUserData = req.superUser;
    const toUserId = req.body.toUserId;
    const answer = req.body.answer;
    const response = await database.respondRequest(
      fromUserData.id,
      toUserId,
      answer
    );
    if (response.affectedRows === 0) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED_FOUR,
        socialMessages.requestNotFound,
        utils.CURRENT_DATE,
        req.originalUrl
      );
      res.status(utils.NOT_FOUND).send(badResponse);
      return;
    }
    res.send();
    return;
  } catch (e) {
    console.log(e);
    unknown(res, e, req);
  }
};

const getMyNetwork = async (req, res) => {
  try {
    const superUser = req.superUser;
    const type = req.params.type;
    const start = req.params.start;
    const count = req.params.count;
    const response = await database.getMyNetwork(
      superUser.id,
      type,
      start,
      count
    );
    console.log(response);
    if (response.length > 0) {
      response[1] = response[1].map((resp) => {
        return {
          ...resp,
          image:
            resp.image_blob 
              ? Buffer.from(resp.image_blob).toString()
              : null,
        };
      }).filter(user => user.userId != superUser.id);
    }
    res.status(utils.SUCCESS).send({ ...response[0][0], users: response[1] });
  } catch (ee) {
    console.log(ee);
  }
};

const removeFriend = async (req, res) => {
  try {
    const fromUserData = req.superUser;
    const toUserId = req.body.toUserId;
    const response = await database.deleteFriend(fromUserData.id, toUserId);
    if (response.affectedRows === 0) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED_FOUR,
        socialMessages.userNotFound,
        utils.CURRENT_DATE,
        req.originalUrl
      );
      res.status(utils.NOT_FOUND).send(badResponse);
      return;
    }
    res.send();
    return;
  } catch (e) {
    console.log(e);
    unknown(res, e, req);
  }
};

const revokeRequest = async (req, res) => {
  try {
    const fromUserData = req.superUser;
    const toUserId = req.body.toUserId;
    const response = await database.revokeRequest(fromUserData.id, toUserId);
    if (response.affectedRows === 0) {
      const badResponse = new queries.Response(
        utils.FOUR_HUNDRED_FOUR,
        socialMessages.requestPending,
        utils.CURRENT_DATE,
        req.originalUrl
      );
      res.status(utils.NOT_FOUND).send(badResponse);
      return;
    }
    res.send();
    return;
  } catch (e) {
    unknown(res, e, req);
  }
};

const getStatus = async (req, res) => {
  try {
    const fromUserData = req.superUser;
    const toUserId = req.params.id;
    const response = await database.getStatus(fromUserData.id, toUserId);
    res.send(response);
    return;
  } catch (e) {
    unknown(res, e, req);
  }
};

exports.search = search;
exports.sendRequest = sendRequest;
exports.removeUser = removeFriend;
exports.respondRequest = respondRequest;
exports.revokeRequest = revokeRequest;
exports.getMyNetwork = getMyNetwork;
exports.getStatus = getStatus;
// exports.removeRequest = removeRequest
