// import {
//   writeFile
// } from 'fs';
// import {
//   argv
// } from 'yargs';
const argv = require('yargs').argv;
const fs = require('fs');
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file

require('dotenv').config({
  path: './../.env',
});

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = process.env.NODE_ENV
const isProduction = environment === 'prod';

const targetPath = `./src/environments/environment.ts`;

//const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `export const environment = {
  PROJECTNAME: '${process.env.PROJECTNAME}',
  production: ${isProduction},
  NODE_ENV: '${process.env.NODE_ENV}',
  SERVER_HOST: '${process.env.SERVER_HOST}',
  SERVER_PORT: ${process.env.SERVER_PORT},
  MQTT_HOST: '${process.env.MQTT_HOST}',
  MQTT_PORT: ${process.env.MQTT_PORT},
  MQTT_WS_PORT: ${process.env.MQTT_WS_PORT},
  DATA_SAVE_PATH: '${process.env.DATA_SAVE_PATH}',
  APP_HOST: '${process.env.APP_HOST}',
  APP_PORT: ${process.env.APP_PORT},
  CAMUNDA_ENGINE_HOST: '${process.env.CAMUNDA_ENGINE_HOST}'
};
`;

/*

  POSTGRES_IMAGE_VERSION: '${process.env.POSTGRES_IMAGE_VERSION}',
 POSTGRES_HOST: '${process.env.POSTGRES_HOST}',
  POSTGRES_DATABASE: '${process.env.POSTGRES_DATABASE}',
  POSTGRES_USER: '${process.env.POSTGRES_USERNAME}',
  POSTGRES_PASSWORD: '${process.env.POSTGRES_PASSWORD}',
  POSTGRES_PORT: ${process.env.POSTGRES_PORT},
 */
fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
