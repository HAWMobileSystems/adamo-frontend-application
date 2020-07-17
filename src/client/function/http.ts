import {getQueryParameters, IQueryParam} from "./get-query-params";

/**
 * Build url replace parameter
 * @param url
 * @param urlParameter
 */
const buildUrl = (url: string, urlParameter: IParameter = {}): string => {
    let resultUrl = url;
    for (const key of Object.keys(urlParameter)) {
        resultUrl = resultUrl.replace(`{${key}}`, encodeURI(urlParameter[key]));
    }
    return resultUrl;
};

export interface IRequest {
    method: string;
    url: string;
    urlParameter?: IParameter;
    queryParameter?: Array<IQueryParam>;
    header?: IParameter;
    body?: string;
}

export interface IParameter {
    [name: string]: string
}

/**
 * Make an http request
 * @param request the http request parameters
 * @param requestInterceptor an request interceptor will be called before every request call
 */
export const http = async (request: IRequest,
                           requestInterceptor: (request: IRequest
                           ) => Promise<IRequest>): Promise<string> => {

    if (requestInterceptor) {
        request = await requestInterceptor(request);
    }

    return await new Promise((resolve, reject) => {

        // 1. Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        const buildQuery = getQueryParameters(request.queryParameter);
        const url = `${buildUrl(request.url, request.urlParameter)}${buildQuery}`;

        // 2.0 Configure it: GET-request for the URL
        xhr.open(request.method, url);

        // 2.1 Set header
        if (request.header) {
            for (const headerName of Object.keys(request.header)) {
                xhr.setRequestHeader(headerName, request.header[headerName]);
            }
        }

        // 3. Send the request over the network
        xhr.send(request.body);

        // 4. This will be called after the response is received
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = xhr.responseText;
                resolve(response);
            } else {
                reject({status: xhr.status, message: xhr.responseText});
            }
        };

        xhr.onerror = () => {
            reject({status: xhr.status, message: xhr.responseText});
        }
    });
};
