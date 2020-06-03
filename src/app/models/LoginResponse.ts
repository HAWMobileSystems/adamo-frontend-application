export class LoginResponse implements Response {
  public headers: Headers;
  public ok: boolean;
  public redirected: boolean;
  public status: number;
  public statusText: string;
  public trailer: Promise<Headers>;
  public type: ResponseType;
  public url: string;
  public clone(): Response {
    throw new Error('Method not implemented.');
  }
  public body: ReadableStream<Uint8Array>;
  public bodyUsed: boolean;
  public arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Method not implemented.');
  }
  public blob(): Promise<Blob> {
    throw new Error('Method not implemented.');
  }
  public formData(): Promise<FormData> {
    throw new Error('Method not implemented.');
  }
  public json(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  public text(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public email: string;
  public permission: string;

  public message: string;

  public profile: string;
  public success: boolean;
  public loggedIn: boolean;
}
