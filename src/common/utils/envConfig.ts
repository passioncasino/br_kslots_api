import dotenv from "dotenv";
import { cleanEnv, port, str, testOnly, bool } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  GAMESERVERHOST : str(),
  OPERATOR_HOST : str(),
  REPLAY_HOST : str(),
  ASSET_HOST : str(),
  SERVER_HOST : str(),
  VERIFY_HOST : str(),
  LOBBY_HOST : str(),
  CASHIER_HOST : str(),

  CONNECTION_STRING : str(),
  DBNAME : str(),

  SERVER_PORT: port(),

  SSL_PRIVATE_KEY: str(),
  SSL_CERTIFICATE: str(),
  SSL_CA_BUNDLE: str(),

  USE_HTTPS: bool({ default: false }),
});