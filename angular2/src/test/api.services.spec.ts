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
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';

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

  });
});