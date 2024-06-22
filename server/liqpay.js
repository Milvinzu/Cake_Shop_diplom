"use strict";

import axios from "axios";
import CryptoJS from "crypto-js";

export default function LiqPay(public_key, private_key) {
  this.host = "https://www.liqpay.ua/api/";
  this.availableLanguages = ["ru", "uk", "en"];
  this.buttonTranslations = { ru: "Оплатить", uk: "Сплатити", en: "Pay" };

  this.api = async function api(path, params) {
    if (!params.version) {
      throw new Error("version is null");
    }
    params.public_key = public_key;
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(params))));
    const signature = this.str_to_sign(private_key + data + private_key);

    const dataToSend = new URLSearchParams();
    dataToSend.append("data", data);
    dataToSend.append("signature", signature);

    try {
      const response = await axios.post(this.host + path, dataToSend, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Request failed with status code: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  this.cnb_form = function cnb_form(params) {
    let buttonText = this.buttonTranslations["uk"];
    if (params.language) {
      buttonText =
        this.buttonTranslations[params.language] ||
        this.buttonTranslations["uk"];
    }
    params = this.cnb_params(params);
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(params))));
    const signature = this.str_to_sign(private_key + data + private_key);
    return (
      '<form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">' +
      '<input type="hidden" name="data" value="' +
      data +
      '" />' +
      '<input type="hidden" name="signature" value="' +
      signature +
      '" />' +
      '<script type="text/javascript" src="https://static.liqpay.ua/libjs/sdk_button.js"></script>' +
      '<sdk-button label="' +
      buttonText +
      '" background="#77CC5D" onClick="submit()"></sdk-button>' +
      "</form>"
    );
  };

  this.cnb_signature = function cnb_signature(params) {
    params = this.cnb_params(params);
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(params))));
    return this.str_to_sign(private_key + data + private_key);
  };

  this.cnb_params = function cnb_params(params) {
    params.public_key = public_key;

    if (params.version) {
      if (
        typeof params.version === "string" &&
        !isNaN(Number(params.version))
      ) {
        params.version = Number(params.version);
      } else if (typeof params.version !== "number") {
        throw new Error(
          "version must be a number or a string that can be converted to a number"
        );
      }
    } else {
      throw new Error("version is null");
    }

    if (params.amount) {
      if (typeof params.amount === "string" && !isNaN(Number(params.amount))) {
        params.amount = Number(params.amount);
      } else if (typeof params.amount !== "number") {
        throw new Error(
          "amount must be a number or a string that can be converted to a number"
        );
      }
    } else {
      throw new Error("amount is null");
    }

    const stringParams = ["action", "currency", "description", "language"];
    for (const param of stringParams) {
      if (params[param] && typeof params[param] !== "string") {
        params[param] = String(params[param]);
      } else if (!params[param] && param !== "language") {
        throw new Error(`${param} is null or not provided`);
      }
    }

    if (params.language && !this.availableLanguages.includes(params.language)) {
      params.language = "uk";
    }

    return params;
  };

  this.str_to_sign = function str_to_sign(str) {
    if (typeof str !== "string") {
      throw new Error("Input must be a string");
    }

    const sha1 = CryptoJS.SHA1(str);
    return CryptoJS.enc.Base64.stringify(sha1);
  };

  this.cnb_object = function cnb_object(params) {
    params.language = params.language || "uk";
    params = this.cnb_params(params);
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(params))));
    const signature = this.str_to_sign(private_key + data + private_key);
    return { data: data, signature: signature };
  };

  return this;
}