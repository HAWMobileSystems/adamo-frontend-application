// import { TestBed, async, inject } from '@angular/core/testing';
// import { HttpClientModule, HttpClient, HttpResponse, HttpXhrBackend, HttpHeaders } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// // import { MockBackend } from '@angular/ht/testing';
// import { ApiService } from './api.service';
// import { environment } from '../../environments/environment';
// import { TabbarService } from './tabbar.service';
// import { Model } from '../models/model';
//
// describe('ApiService', () => {
//   let service: TabbarService;
//   let httpMock: HttpTestingController;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         TabbarService,
//         //{ provide: XHRBackend, useClass: MockBackend }
//       ],
//     });
//     service = TestBed.get(TabbarService);
//     httpMock = TestBed.get(HttpTestingController);
//   });
//   it('should have a service instance', () => {
//     expect(service).toBeDefined();
//   });
//
//   describe('roleCreate()', () => {
//     it('should return Object when created', () => {
//       // const model = new Model();
//       // service.addTab(model);
//       expect(service.getModelTabs().subscribe()).toBe(0);
//   });
//
//   it('it should return, if a role already exists', () => {
//     service
//       .roleCreate({
//         roleName: 'Admin',
//         canRead: true,
//         canWrite: true,
//         isAdmin: true,
//       })
//       .subscribe((data: any) => {
//         expect(data).toBeDefined();
//         expect(data.success).toBeUndefined();
//         expect(data.status).toBeDefined();
//       });
//
//     const req = httpMock.expectOne(`${environment.SERVER_HOST}:${environment.SERVER_PORT}/role/create`);
//     expect(req.request.method).toBe('POST');
//
//     req.flush({
//       status: 'Role name already exists',
//     });
//   });
//
//   describe('roleUpdate()', () => {
//     it('it should return if role was succesfully updated', () => {
//       service.roleUpdate(1, 'Admin', true, true, true).subscribe((data: any) => {
//         expect(data).toBeDefined();
//         expect(data.success).toBeDefined();
//         expect(data.status).toBeUndefined();
//       });
//
//       const req = httpMock.expectOne(`${environment.SERVER_HOST}:${environment.SERVER_PORT}/role/create`);
//       expect(req.request.method).toBe('POST');
//
//       req.flush({
//         status: 'role updated successfully',
//         success: true,
//       });
//     });
//
//     it('should return success false, if role could not be updated', () => {
//       service.roleUpdate(1, 'Admin', true, true, true).subscribe((data: any) => {
//         expect(data).toBeDefined();
//         expect(data.success).toBeUndefined();
//         expect(data.status).toBeDefined();
//       });
//
//       const req = httpMock.expectOne(`${environment.SERVER_HOST}:${environment.SERVER_PORT}/role/create`);
//       expect(req.request.method).toBe('POST');
//
//       req.flush({
//         status: 'Database not available',
//       });
//     });
//   });
//   // describe("roleDelete()", () => {
//   //
//   //     it("should return a role object",
//   //         inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//   //
//   //             const mockResponse = {
//   //                 status: "Role deleted successfully",
//   //                 success: true
//   //             };
//   //
//   //             mockBackend.connections.subscribe((connection: any) => {
//   //                 connection.mockRespond(new Response(new ResponseOptions({
//   //                     body: JSON.stringify(mockResponse)
//   //                 })));
//   //             });
//   //
//   //             expect(typeof(apiService.roleDelete( 1))).toEqual("object");
//   //
//   //         }));
//   //
//   //     it("it should work in case of a failure",
//   //         inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//   //
//   //             const mockResponse = {
//   //                 status: "Database not available"
//   //             };
//   //
//   //             mockBackend.connections.subscribe((connection: any) => {
//   //                 connection.mockRespond(new Response(new ResponseOptions({
//   //                     body: JSON.stringify(mockResponse)
//   //                 })));
//   //             });
//   //
//   //             expect(typeof(apiService.roleDelete(1))).toEqual("object");
//   //             apiService.roleDelete(1).subscribe((response: any) => {
//   //                 expect(response).toBeDefined();
//   //                 expect(response.success).toBeUndefined();
//   //                 expect(response.status).toBeDefined();
//   //             });
//   //         }));
//   //     it("it shouldnt work when their is no role id",
//   //         inject([ApiService, XHRBackend], (apiService: ApiService, mockBackend: any) => {
//   //
//   //             const mockResponse = {
//   //                 status: "Role does not exist"
//   //             };
//   //
//   //             mockBackend.connections.subscribe((connection: any) => {
//   //                 connection.mockRespond(new Response(new ResponseOptions({
//   //                     body: JSON.stringify(mockResponse)
//   //                 })));
//   //             });
//   //
//   //             expect(typeof(apiService.roleDelete(1))).toEqual("object");
//   //             apiService.roleDelete(1).subscribe((response: any) => {
//   //                 expect(response).toBeDefined();
//   //                 expect(response.success).toBeUndefined();
//   //                 expect(response.status).toBeDefined();
//   //             });
//   //         }));
//   // });
// });
