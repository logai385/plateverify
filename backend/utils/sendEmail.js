import "dotenv/config";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import { systemLogs } from "./logger.js";
import transporter from "../helpers/emailTransport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (email, subject, payload, template) => {
  try {
    const sourceDirectory = fs.readFileSync(
      path.join(__dirname, template),
      "utf-8"
    );
    const compiledTemplate = handlebars.compile(sourceDirectory);
    const emailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
    }
    await transporter.sendMail(emailOptions);
  } catch (err) {
    systemLogs.error(`email not sent: ${error}`);
  }
};

export default sendEmail;