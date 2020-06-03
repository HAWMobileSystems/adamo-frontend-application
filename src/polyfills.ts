import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');
(window as any).process = {
  env: { DEBUG: undefined }
};
if (process.env.ENV === 'production') {
    // Production
} else {
    // Development
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
declare global {
  interface Window {
    File: any;
    FileReader: any;
    FileList: any;
  }
}

(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;