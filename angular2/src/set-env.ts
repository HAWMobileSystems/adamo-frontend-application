import { writeFile } from 'fs';
import { argv } from 'yargs';
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file

require('dotenv').config({
  path: './../../.env'
});
// Notice: environment could be called from project root so double check on config path
// Added logs will provide further insights.
//console.log('current path', process.cwd()); // adamo\adamo-frontend-application\angular2
//console.log(__dirname); // adamo\adamo-frontend-application\angular2\src
// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  PROJECTNAME: '${process.env.PROJECTNAME}',
  production: ${isProduction},
  NODE_ENV: '${process.env.NODE_ENV}',
  SERVER_HOST: '${process.env.SERVER_HOST}',
  SERVER_PORT: ${process.env.SERVER_PORT},
  MQTT_HOST: '${process.env.MQTT_HOST}',
  MQTT_PORT: ${process.env.MQTT_PORT},
  DB_HOST: '${process.env.DB_HOST}',
  DB_NAME: '${process.env.DB_NAME}',
  DB_USER: '${process.env.DB_USER}',
  DB_PASSWORD: '${process.env.DB_PASSWORD}',
  DB_PORT: ${process.env.DB_PORT},
  DATA_SAVE_PATH: '${process.env.DATA_SAVE_PATH}',
  POSTGRES_IMAGE_VERSION: '${process.env.POSTGRES_IMAGE_VERSION}',
  APP_HOST: '${process.env.APP_HOST}',
  APP_PORT: ${process.env.APP_PORT},
  CAMUNDA_ENGINE_HOST: '${process.env.CAMUNDA_ENGINE_HOST}'
};
`;

console.log('Configuration for Environment: ', envConfigFile);
writeFile(targetPath, envConfigFile, err => {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
