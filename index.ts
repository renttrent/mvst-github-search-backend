import express, { Application, Request, RequestHandler, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config()

const app: Application = express();
const port = 5000;

app.use(cors());
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: true }) as RequestHandler);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ message: "hey" })
  }
)

app.post(
  "/auth",
  async (req: Request, res: Response): Promise<Response> => {
    const { code } = req.body;
    console.log(code)
    console.log(process.env)
    try {
      const access_token_res = await axios.post("https://github.com/login/oauth/access_token", {
        "client_id": process.env.CLIENT_ID ? process.env.CLIENT_ID : "",
        "client_secret": process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : "",
        "redirect_uri": process.env.REDIRECT_URI ? process.env.REDIRECT_URI : "",
        "code": code
      })
      // access_token=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&scope=user&token_type=bearer
      const access_reg = new RegExp(/=(.*)&scope/)
      const token_type_reg = new RegExp(/&token_type=(.*)/)
      const access_token = access_token_res?.data.match(access_reg)[1]
      const token_type = access_token_res?.data.match(token_type_reg)[1]
      console.log(process.env.REDIRECT_URL)
      // console.log(access_token_res)
      return res.status(200).send({
        access_token,
        token_type
      });

    } catch (err) {
      console.log(err)
      return res.status(400).send("Bad request")
    }
  }
);

try {
  app.listen(process.env.PORT || port, (): void => {
    console.log(`⚡Listening on port ${port}`);
  });
} catch (error) {
  // @ts-ignore
  console.error(`Error occured: ${error.message}`);
}