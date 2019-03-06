import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {ApiService} from '../app/services/api.service';
import { Observable } from 'rxjs';

describe('ApiService', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ApiService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

    describe('roleCreate()', () => {

        it('should return a role object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'role created successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleCreate('Admin', true, true, true))).toEqual('object');

            }));
        it('it should work in case of a failure',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Database not available'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleCreate('Admin', true, true, true))).toEqual('object');
                apiService.roleCreate('Admin', true, true, true).subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
        it('if role-name already exists, then it shouldnt create a role',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Role name already exists'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });
            }));
    });

    describe('roleUpdate()', () => {

        it('should return a role object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'role updated successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleUpdate(1, 'Admin', true, true, true))).toEqual('object');
            }));
        it('it should work in case of a failure',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Database not available'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleUpdate(1, 'Admin', true, true  , true))).toEqual('object');
                apiService.roleUpdate(1, 'Admin', true, true, true).subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
    });
    describe('roleDelete()', () => {

        it('should return a role object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Role deleted successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleDelete( 1))).toEqual('object');

            }));

        it('it should work in case of a failure',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Database not available'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleDelete(1))).toEqual('object');
                apiService.roleDelete(1).subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
        it('it shouldnt work when their is no role id',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Role does not exist'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.roleDelete(1))).toEqual('object');
                apiService.roleDelete(1).subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
    });

});