import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";
import jwt from "jsonwebtoken";
import cors from "cors";
import cron from "node-cron";
import crypto from "crypto";
import LiqPay from "./liqpay.js";
import util from "util";
import axios from "axios";
import * as RegularBakeryController from "./controllers/RegularBakeryController.js";
import * as SpecialCakeController from "./controllers/SpecialCakeController.js";
import * as TasteController from "./controllers/TasteController.js";
import * as OrderCakeController from "./controllers/OrderCakeController.js";
import * as OrderController from "./controllers/OrderController.js";
import * as UserController from "./controllers/UserController.js";
import * as ShablonCakeController from "./controllers/ShablonCakeController.js";
import { registerAdminValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import checkAdmin from "./utils/checkAdmin.js";
import * as deepl from "deepl-node";

dotenv.config();
const googleStorage = new Storage({
  projectId: process.env.GSC_ID,
  keyFilename: process.env.KEY_FILE_NAME,
});

const bucketName = process.env.GSC_BUCKET_NAME;
if (!bucketName) {
  throw new Error("GSC_BUCKET_NAME environment variable is not set");
}

export const bucket = googleStorage.bucket(bucketName);

const multerGoogleStorage = multer.memoryStorage();
const uploadImages = multer({ storage: multerGoogleStorage });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Db ok");
  })
  .catch((err) => console.log("db err", err));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// User routes
app.post("/user/register", UserController.register);
app.post("/user/login", UserController.login);
app.get("/user", checkAuth, UserController.userInf);
app.post(
  "/user/register/admin",
  checkAuth,
  checkAdmin,
  UserController.register
);
app.put("/user", checkAuth, UserController.updateUser);
app.post("/user/request-password-reset", UserController.requestPasswordReset);
app.post(
  "/user/verify-password-reset-token",
  UserController.verifyPasswordResetToken
);
app.post("/user/reset-password", UserController.resetPassword);
// Regular Bakery routes
app.post("/regularbakery", RegularBakeryController.createRegularBakery);
app.delete("/regularbakery/:id", RegularBakeryController.deleteRegularBakery);
app.put("/regularbakery/:id", RegularBakeryController.updateRegularBakery);
app.get("/regularbakery", RegularBakeryController.getAllRegularBakery);
app.get("/regularbakery/:id", RegularBakeryController.getRegularBakeryById);
app.get(
  "/regularbakery/category/:category",
  RegularBakeryController.getRegularBakeryByCategory
);

// Special Cake routes
app.post("/specialcake", SpecialCakeController.createSpecialCake);
app.delete("/specialcake/:id", SpecialCakeController.deleteSpecialCake);
app.put("/specialcake/:id", SpecialCakeController.updateSpecialCake);
app.get("/specialcake", SpecialCakeController.getAllSpecialCakes);
app.get("/specialcake/:id", SpecialCakeController.getSpecialCakeById);
app.get(
  "/specialcakes/user/:userId",
  SpecialCakeController.getSpecialCakesByUserId
);
app.put(
  "/specialcake/status/:cakeId",
  SpecialCakeController.updateSpecialCakeStatus
);

// Order routes
app.post("/order", OrderController.createOrder);
app.get("/order", OrderController.findAllOrders);
app.get("/order/:id", OrderController.findOrderById);
app.put("/order/:id", OrderController.updateOrder);
app.delete("/order/:id", OrderController.deleteOrder);
app.get("/order/user/:userId", OrderController.findOrdersByUserId);

// Order Cake routes
app.post("/order-cakes", OrderCakeController.createOrderCake);
app.get("/order-cakes", OrderCakeController.getAllOrderCakes);
app.get("/order-cakes/:id", OrderCakeController.getOrderCakeById);
app.put("/order-cakes/:id", OrderCakeController.updateOrderCakeById);
app.delete("/order-cakes/:id", OrderCakeController.deleteOrderCakeById);

// Shablon Cake routes
app.post("/shabloncake", ShablonCakeController.create);
app.get("/shabloncake", ShablonCakeController.findAll);
app.get("/shabloncake/:id", ShablonCakeController.findOneById);
app.put("/shabloncake/:id", ShablonCakeController.update);
app.delete("/shabloncake/:id", ShablonCakeController.remove);

// Taste routes
app.post("/taste", TasteController.createTaste);
app.delete("/taste/:id", TasteController.deleteTaste);
app.put("/taste/:id", TasteController.updateTaste);
app.get("/taste", TasteController.getAllTastes);
app.get("/taste/cake/:cakeId", TasteController.getTastesByCakeId);
app.get("/taste/:id", TasteController.getTasteById);

app.post("/upload/tastes", uploadImages.array("tastes"), async (req, res) => {
  try {
    const files = req.files;
    const tasteId = req.body.tasteId;
    if (files && tasteId) {
      const publicUrls = await uploadImagesToGCS(files, "tastes");
      const id = tasteId;
      const img = publicUrls[0];
      const updatedTaste = await TasteController.updateImg([id, img], res);
      res.status(200).json(updatedTaste);
    } else {
      throw new Error("Taste ID and images are required.");
    }
  } catch (error) {
    console.error("Error in route handler:", error);
    res
      .status(500)
      .json({ message: "Images upload failed", error: error.message });
  }
});

app.post("/upload/bakery", uploadImages.array("bakery"), async (req, res) => {
  try {
    const files = req.files;
    const bakeryId = req.body.bakeryId;
    if (files && bakeryId) {
      const publicUrls = await uploadImagesToGCS(files, "bakery");
      const id = bakeryId;
      const img = publicUrls[0];
      const updatedBakery = await RegularBakeryController.updateBakeryImg(
        [id, img],
        res
      );
      res.status(200).json(updatedBakery);
    } else {
      throw new Error("Bakery ID and images are required.");
    }
  } catch (error) {
    console.error("Error in route handler:", error);
    res
      .status(500)
      .json({ message: "Images upload failed", error: error.message });
  }
});
app.post("/upload/cake", uploadImages.array("cake"), async (req, res) => {
  try {
    const files = req.files;
    const cakeId = req.body.cakeId;
    if (files && cakeId) {
      const publicUrls = await uploadImagesToGCS(files, "cake");
      const id = cakeId;
      const img = publicUrls[0];
      const updatedCake = await ShablonCakeController.updateCakeImg(
        [id, img],
        res
      );
      res.status(200).json(updatedCake);
    } else {
      throw new Error("Cake ID and images are required.");
    }
  } catch (error) {
    console.error("Error in route handler:", error);
    res
      .status(500)
      .json({ message: "Images upload failed", error: error.message });
  }
});

export const uploadImagesToGCS = async (files, folder) => {
  const uploadPromises = [];

  try {
    files.forEach((file) => {
      console.log("Processing file:", file.originalname);
      const { originalname, buffer } = file;
      const fileName = `${folder}/${originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      const uploadPromise = new Promise((innerResolve, innerReject) => {
        blobStream
          .on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            console.log("Upload successful, public URL:", publicUrl);
            innerResolve(publicUrl);
          })
          .on("error", (err) => {
            console.error("Error during file upload:", err);
            innerReject(err);
          })
          .end(buffer);
      });

      uploadPromises.push(uploadPromise);
    });

    const publicUrls = await Promise.all(uploadPromises);
    return publicUrls;
  } catch (error) {
    console.error("Error in uploadImagesToGCS:", error);
    throw error;
  }
};

cron.schedule("0 0 * * *", async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const specialCakesToDelete = await SpecialCake.find({
      status: "received",
      createdAt: { $lte: sevenDaysAgo },
    });
    for (const specialCake of specialCakesToDelete) {
      await specialCake.remove();
      console.log(`Deleted special cake ${specialCake._id}`);
    }
  } catch (error) {
    console.error("Error deleting old special cakes:", error);
  }
});
const liqpay = new LiqPay(
  process.env.LIQPAY_PUBLIC_KEY,
  process.env.LIQPAY_PRIVATE_KEY
);

app.post("/api/payment-callback", async (req, res) => {
  const { data, signature } = req.body;

  const generatedSignature = liqpay.str_to_sign(
    process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY
  );

  if (generatedSignature === signature) {
    const paymentData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    console.log("Payment Data: ", paymentData);

    try {
      const updatedOrder = await OrderController.updateOrderStatus(
        paymentData.order_id
      );

      if (!updatedOrder) {
        console.error("Order not found for order_id:", paymentData.order_id);
        res.status(404).send("Order not found");
      } else {
        console.log("Order updated successfully:", updatedOrder);
        res.sendStatus(200);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(400).send("Invalid signature");
  }
});

app.post("/api/payment-callback/specialcake", async (req, res) => {
  const { data, signature } = req.body;

  const generatedSignature = liqpay.str_to_sign(
    process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY
  );

  if (generatedSignature === signature) {
    const paymentData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    console.log("Payment Data: ", paymentData);

    try {
      const updatedSpecialCake =
        await SpecialCakeController.updateSpecialCakeStatus(
          paymentData.order_id
        );

      if (!updatedSpecialCake) {
        console.error(
          "Special cake not found for cake_id:",
          paymentData.order_id
        );
        res.status(404).send("Special cake not found");
      } else {
        console.log("Special cake updated successfully:", updatedSpecialCake);
        res.sendStatus(200);
      }
    } catch (error) {
      console.error("Error updating special cake:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(400).send("Invalid signature");
  }
});

app.post("/translate", async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  if (!text || !sourceLang || !targetLang) {
    return res
      .status(400)
      .json({ error: "Missing required fields: text, sourceLang, targetLang" });
  }

  try {
    // Initialize DeepL translator with API key from environment variables
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

    // Perform translation
    const result = await translator.translateText(text, sourceLang, targetLang);

    // Return translated text as JSON response
    res.json({ translatedText: result.text });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});
