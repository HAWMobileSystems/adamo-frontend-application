/**
 * This file was generated by st-open-api
 */

import {http} from '../function/http';
import {openApi} from '../function/open-api';
import {IRoleEntity} from '../interface/components/i-role-entity';

export class RoleService {

    roleControllerListRoles = async (): Promise<void> => {
    
        await http({
                method: 'GET',
                url: `${openApi.endpointUrl}/role`,
                header: {
                },
            },
            openApi.requestInterceptor
        );
    };

    roleControllerUpdate = async (body: IRoleEntity): Promise<void> => {
    
        await http({
                method: 'PUT',
                url: `${openApi.endpointUrl}/role/{id}/update`,
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            },
            openApi.requestInterceptor
        );
    };

    roleControllerCreate = async (): Promise<void> => {
    
        await http({
                method: 'POST',
                url: `${openApi.endpointUrl}/role/create`,
                header: {
                },
            },
            openApi.requestInterceptor
        );
    };

    roleControllerDelete = async (): Promise<void> => {
    
        await http({
                method: 'DELETE',
                url: `${openApi.endpointUrl}/role/{id}/delete`,
                header: {
                },
            },
            openApi.requestInterceptor
        );
    };

}