
import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";

import { AdamoMqttService } from "../../services/mqtt.service";
import { SnackBarService } from "../../services/snackbar.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "permission-management",
  templateUrl: "./permission.component.html"
})
export class PermissionComponent {
  private selectedUser: any;
  private selectedPermission: any;
  private selectedModel: any;
  private selectedRole: any;
  private users: any;
  private roles: any;
  private models: any;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService
  ) {}

  //selects a user that is maintained in a permission
  private selectUser(user: any) {
    this.selectedUser = user;
    if (this.selectedModel) {
      this.getPermission(user.id, this.selectedModel.id);
    }
  }

  //selects a model that is maintained in a permission
  private selectModel(model: any) {
    this.selectedModel = model;
    if (this.selectedUser) {
      this.getPermission(this.selectedUser.id, model.id);
    }
  }

  //creates a new permission
  private permissionCreate(uid: any, mid: any, role: any) {
    this.apiService.permissionCreate(uid, mid, role).subscribe(
      (response: any) => {

          this.snackbarService.success("Permission successfully created");
          this.selectedPermission = null;
          this.selectedUser = null;
          this.selectedModel = null;
       
      },
      (error:any) => {
        this.snackbarService.error(error);
        console.log(error);
      }
    );
  }

  //deletes the selected permission
  private permissionDelete(pid: any) {
    this.apiService.permissionDelete(pid).subscribe(
      (response: { success: any; error: string }) => {
        if (response.success) {
          this.snackbarService.success("Permission deleted");
          this.selectedPermission = null;
          this.selectedUser = null;
          this.selectedModel = null;
        } else {
          this.snackbarService.error(response.error);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      }
    );
  }

  //updates the selected permission
  private permissionUpdate(role: any, pid: any) {
    this.apiService.permissionUpdate(role, pid).subscribe(
      (response: { success: any; error: string }) => {
        if (response.success) {
          this.snackbarService.success("Permission updated");
          this.selectedPermission = null;
          this.selectedUser = null;
          this.selectedModel = null;
        } else {
          this.snackbarService.error(response.error);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
        console.log(error);
      }
    );
  }

  public ngOnInit() {
    this.roles = this.getAllRoles();
    this.getAllUsers();
    this.getAllModels();
    this.mqttService.getClient().subscribe("PERMISSION");
    const self = this;
    this.mqttService.getClient().on("message", (topic: any, message: any) => {
      if (topic === "PERMISSION") {
        console.log("PermissonMQTT");
        self.getAllModels();
        self.getAllUsers();
      }
    });
  }

  //gets a list of all roles from DB
  public getAllRoles() : any{
    this.roles = [];
    return this.apiService.getAllRoles().subscribe(
      (response: any) => {

          this.roles = response;
          return response;
      
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      }
    );
  }

  //gets a list of all users from DB
  public getAllUsers() {
    this.users = [];
    this.userService.getAllUsers().subscribe(
      (response: any) => {

          this.users = response;
          this.selectedUser = null;
       
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      }
    );
  }

  //gets a list of all models from DB
  public getAllModels() {
    this.models = [];
    this.apiService.getAllModels().subscribe(
      (response: any) => {

          this.models = response;
          this.selectedModel = null;
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      }
    );
  }

  //gets the permission of the selected user and model
  public getPermission(user: any, model: any) {
    this.apiService.getPermission(user, model).subscribe(
      (response: any) => {
          this.selectedPermission = response[0].role_name;
        
      },
      (error: any) => {
        this.snackbarService.error("Error receiving permissions");
        console.log(error);
      }
    );
  }
}
