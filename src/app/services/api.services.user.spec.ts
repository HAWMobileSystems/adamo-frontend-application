// import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
//
// import {ApiService} from './api.service';
// import { Observable } from 'rxjs';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import api from '@fortawesome/fontawesome';
//
// describe('UserService', () => {
//
//     let injector: TestBed;
//     let service: ApiService;
//     let httpMock: HttpTestingController;
//   beforeEach(() => {
//
//       TestBed.configureTestingModule({
//           imports: [HttpClientTestingModule],
//           providers: [
//               ApiService,
//               // { provide: XHRBackend, useClass: MockBackend }
//             ]
//         });
//         injector = getTestBed();
//         service = injector.get(ApiService);
//         httpMock = injector.get(HttpTestingController);
//   });
//
//     describe('userCreate()', () => {
//
//         it('should return an object', () => {
//
//             //     const mockResponse = {
//             //         status: 'user created successfully',
//             //         success: true
//             //     };
//
//             service.userCreate('masood@md.de', 'Masood', 'Ahm', 'Admin', 'masood').subscribe( response => {
//                 expect(response).toBeDefined()
//             })
//
//         }
//             // inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//
//             //     mockBackend.connections.subscribe((connection: any) => {
//             //         connection.mockRespond(new Response(new ResponseOptions({
//             //             body: JSON.stringify(mockResponse)
//             //         })));
//             //     });
//
//             //     expect(typeof(apiService.userCreate('masood@md.de', 'Masood', 'Ahm', 'Admin', 'masood'))).toEqual('object');
//
//             // }));
//         // it('it should work in case of a failure',
//         //     inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//         //
//         //         const mockResponse = {
//         //             status: 'Database not available'
//         //         };
//         //
//         //         mockBackend.connections.subscribe((connection: any) => {
//         //             connection.mockRespond(new Response(new ResponseOptions({
//         //                 body: JSON.stringify(mockResponse)
//         //             })));
//         //         });
//         //
//         //         expect(typeof(apiService.userCreate('masood@md.de', 'Masood', 'Ahm', 'Admin', 'masood'))).toEqual('object');
//         //         apiService.userCreate('masood@md.de', 'Masood', 'Ahm', 'Admin', 'masood').subscribe((response: any) => {
//         //             expect(response).toBeDefined();
//         //             expect(response.success).toBeUndefined();
//         //             expect(response.status).toBeDefined();
//         //         });
//         //     }));
//         it('it shouldnt work when email is not valid',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'E-Mail is not valid'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//                 expect(typeof(apiService.userCreate('masood@@md.de', 'Masood', 'Ahm', 'Admin', 'masood'))).toEqual('object');
//                 apiService.userCreate('masood@@md.de', 'Masood', 'Ahm', 'Admin', 'masood').subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//         it('it shouldnt work when first name is empty',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'First name may not be empty'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//                 expect(typeof(apiService.userCreate('masood@md.de', '', 'Ahm', 'Admin', 'masood'))).toEqual('object');
//                 apiService.userCreate('masood@md.de', '', 'Ahm', 'Admin', 'masood').subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//         it('it shouldnt work when last name is empty',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'Last name may not be empty'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//                 expect(typeof(apiService.userCreate('masood@md.de', 'Masood', '', 'Admin', 'masood'))).toEqual('object');
//                 apiService.userCreate('masood@md.de', 'Masood', '', 'Admin', 'masood').subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//         it('it shouldnt work when password is empty',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'Password may not be empty'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//                 expect(typeof(apiService.userCreate('masood@md.de', 'Masood', 'Ahm', 'Admin', ''))).toEqual('object');
//                 apiService.userCreate('masood@md.de', 'Masood', 'Ahm', 'Admin', '').subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//         it('it shouldnt work when user profil is empty',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'User profil may not be empty'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//                 expect(typeof(apiService.userCreate('masood@md.de', 'Masood', 'Ahm', '', 'masood'))).toEqual('object');
//                 apiService.userCreate('masood@md.de', 'Masood', 'Ahm', '', 'masood').subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//     });
//
//     describe('userUpdate()', () => {
//
//         it('should return an object',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'User updated successfully',
//                     success: true
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//
//                 expect(typeof(apiService.userUpdate(1, 'masood@md.de', 'Masood', 'Ahm', 'Admin'))).toEqual('object');
//             }));
//         it('it should work in case of a failure',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'Database not available'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//
//                 expect(typeof(apiService.userUpdate(1, 'masood@md.de', 'Masood', 'Ahm', 'Admin'))).toEqual('object');
//                 apiService.userUpdate(1, 'masood@md.de', 'Masood', 'Ahm', 'Admin').subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//     });
//     describe('userDelete()', () => {
//
//         it('should return an user object',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'User deleted successfully',
//                     success: true
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//
//                 expect(typeof(apiService.userDelete( 1))).toEqual('object');
//
//             }));
//
//         it('it should work in case of a failure',
//             inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//
//                 const mockResponse = {
//                     status: 'Database not available'
//                 };
//
//                 mockBackend.connections.subscribe((connection: any) => {
//                     connection.mockRespond(new Response(new ResponseOptions({
//                         body: JSON.stringify(mockResponse)
//                     })));
//                 });
//
//                 expect(typeof(apiService.userDelete(1))).toEqual('object');
//                 apiService.userDelete(1).subscribe((response: any) => {
//                     expect(response).toBeDefined();
//                     expect(response.success).toBeUndefined();
//                     expect(response.status).toBeDefined();
//                 });
//             }));
//     });
//
// });