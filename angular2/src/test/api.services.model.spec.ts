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

  describe('getModel()', () => {

    it('should return an object',
        inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

        const mockResponse = {
          data: {
            modelxml: 'modelString!',
            modelname: 'testModel',
            mid: 13,
            version: '1'
            },
          success: true
        };

        mockBackend.connections.subscribe((connection: any) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        expect(typeof(apiService.getModel('13'))).toEqual('object');

    }));

    it('should return modelData',
        inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

        const mockResponse = {
          data: {
            modelxml: 'modelString!',
            modelname: 'testModel',
            mid: 13,
            version: '1'
            },
          success: true
        };

        mockBackend.connections.subscribe((connection: any) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        apiService.getModel('13').subscribe((response: any) => {
          expect(response).toBeDefined();
          expect(response.success).toBe(true);
          expect(response.data.modelxml).toEqual('modelString!');
          expect(response.data.modelname).toEqual('testModel');
          expect(response.data.mid).toEqual(13);
          expect(response.data.version).toEqual('1');
        });

    }));

    it('should be callable with a version parameter',
        inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

        const mockResponse = {
          data: {
            modelxml: 'modelString!',
            modelname: 'testModel',
            mid: 13,
            version: '1'
            },
          success: true
        };

        mockBackend.connections.subscribe((connection: any) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        apiService.getModel('13', '1').subscribe((response: any) => {
          expect(response).toBeDefined();
          expect(response.success).toBe(true);
          expect(response.data.modelxml).toEqual('modelString!');
          expect(response.data.modelname).toEqual('testModel');
          expect(response.data.mid).toEqual(13);
          expect(response.data.version).toEqual('1');
        });

    }));

      it('should also function in case of no success',
          inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

              const mockResponse = {
                  data: {
                      modelxml: 'modelString!',
                      modelname: 'testModel',
                      mid: 13,
                      version: '1'
                  },
                  success: false
              };

              mockBackend.connections.subscribe((connection: any) => {
                  connection.mockRespond(new Response(new ResponseOptions({
                      body: JSON.stringify(mockResponse)
                  })));
              });

              apiService.getModel('13', '1').subscribe((response: any) => {
                  expect(response).toBeDefined();
                  expect(response.success).toBe(false);
                  expect(response.data.modelxml).toEqual('modelString!');
                  expect(response.data.modelname).toEqual('testModel');
                  expect(response.data.mid).toEqual(13);
                  expect(response.data.version).toEqual('1');
              });

          }));
  });
    describe('modelCreate()', () => {

        it('should return an object',
            inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                const mockResponse = {
                    status: 'Model created successfully',
                    success: true
                };

                mockBackend.connections.subscribe((connection: any) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })));
                });

                expect(typeof(apiService.modelCreate('PizzaModell', 'yourmodeldata'))).toEqual('object');

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

                expect(typeof(apiService.modelCreate('PizzaModell', 'yourmodeldata'))).toEqual('object');
                apiService.modelCreate('PizzaModell', 'yourmodeldata').subscribe((response: any) => {
                    expect(response).toBeDefined();
                    expect(response.success).toBeUndefined();
                    expect(response.status).toBeDefined();
                });
            }));
    });
        describe('modelUpdate()', () => {

            it('should return an object',
                inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                    const mockResponse = {
                        status: 'Model updated successfully',
                        success: true
                    };

                    mockBackend.connections.subscribe((connection: any) => {
                        connection.mockRespond(new Response(new ResponseOptions({
                            body: JSON.stringify(mockResponse)
                        })));
                    });

                    expect(typeof(apiService.modelUpdate(1, 'PizzaModell', '2018-08-22', 'yourmodeldata', '1.0'))).toEqual('object');
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

                    expect(typeof(apiService.modelUpdate(1, 'PizzaModell', '2018-08-22', 'yourmodeldata', '1.0'))).toEqual('object');
                    apiService.modelUpdate(1, 'PizzaModell', '2018-08-22', 'yourmodeldata', '1.0').subscribe((response: any) => {
                        expect(response).toBeDefined();
                        expect(response.success).toBeUndefined();
                        expect(response.status).toBeDefined();
                    });
            }));
        });
        describe('modelDelete()', () => {

            it('should return an object',
                inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {

                    const mockResponse = {
                        status: 'Model deleted successfully',
                        success: true
                    };

                    mockBackend.connections.subscribe((connection: any) => {
                        connection.mockRespond(new Response(new ResponseOptions({
                            body: JSON.stringify(mockResponse)
                        })));
                    });

                    expect(typeof(apiService.modelDelete( 1, '1.0'))).toEqual('object');

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

                    expect(typeof(apiService.modelDelete(1, '1.0'))).toEqual('object');
                    apiService.modelDelete(1, '1.0').subscribe((response: any) => {
                        expect(response).toBeDefined();
                        expect(response.success).toBeUndefined();
                        expect(response.status).toBeDefined();
                    });
                }));
        });
});