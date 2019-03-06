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

    describe('permissionCreate()', () => {

        it('should return a permission object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Permission created successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.permissionCreate(1, 2, 'Admin'))).toEqual('object');

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

                expect(typeof(apiService.permissionCreate(1, 2, 'Admin'))).toEqual('object');
                apiService.permissionCreate(1, 2, 'Admin').subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
        it('it shouldnt work when Mid is empty',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Mid may not be empty'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });
            }));
        it('it shouldnt work when Uid is empty',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Uid may not be empty'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });
            }));
        it('it shouldnt work when Role is empty',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Role may not be empty'
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });
            }));
    });

    describe('permissionUpdate()', () => {

        it('should return a permission object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    //status: 'Permission updated successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.permissionUpdate(1, 2))).toEqual('object');
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

                expect(typeof(apiService.permissionUpdate(1, 2))).toEqual('object');
                apiService.permissionUpdate(1, 2).subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
    });
    describe('permissionDelete()', () => {

        it('should return a permission object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Permission deleted successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.permissionDelete( 1))).toEqual('object');

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

                expect(typeof(apiService.permissionDelete(1))).toEqual('object');
                apiService.permissionDelete(1).subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
    });
});