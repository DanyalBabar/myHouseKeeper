import express, { response } from "express";
import cors from "cors";
import users from "./api/users/users.route.js";
import houses from "./api/houses/houses.route.js";
import nodemailer from "nodemailer";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", users);
app.use("/api/v1/houses", houses);

app.post("/api/v1/send_invite", cors(), async (req, res) => {
  let { toAddress, houseName, inviteLink } = req.body;

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: `${toAddress}`,
    subject: `Join ${houseName} on MyHouseKeeper!`,
    html: `
    <div style="
    font-family: sans-serif;
    color: black;">
    <p>Hello! <br/><br/> You've been invited to join ${houseName}!</p>
    
    <p>Sign up to MyHouseKeeper using <a href=${inviteLink}>this link</a> and join this house automatically.</p>

    <h3>MyHouseKeeper Team</h3>
    </div>
    `,
  });

  return res.json({ status: "Success." });
});

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
