import fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import { app, logger } from "@/server";
import { env } from "@/common/utils/envConfig";

const useHttps = process.env.USE_HTTPS === 'true';

let server;
let protocol;

if (useHttps) {
  const certOptions = {
    key: fs.readFileSync(env.SSL_PRIVATE_KEY),
    cert: fs.readFileSync(env.SSL_CERTIFICATE),
    ca: fs.readFileSync(env.SSL_CA_BUNDLE),
  };
  server = https.createServer(certOptions, app);
  protocol = 'https';
} else {
  server = http.createServer(app);
  protocol = 'http';
}

server.listen(env.SERVER_PORT, () => {
  logger.info(`Server (${process.env.NODE_ENV}) running on ${protocol}://${process.env.GAMESERVERHOST}:${env.SERVER_PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
