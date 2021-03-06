/**
 * This file was generated by st-open-api
 */

import {http} from '../function/http';
import {openApi} from '../function/open-api';

export class TestService {

    testControllerGetStatistics = async (): Promise<void> => {
    
        await http({
                method: 'GET',
                url: `${openApi.endpointUrl}/test/adminPanel/{class}`,
                header: {
                },
            },
            openApi.requestInterceptor
        );
    };

}