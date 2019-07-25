import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { AdamoMqttService } from "../../services/mqtt.service";
import { SnackBarService } from "../../services/snackbar.service";

@Component({
  selector: "user-management",
  templateUrl: "./user.template.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent {
  private selected: any;
  private newUser: any;
  private users: any;
  private profiles: any;
  private mqtt: any;

  constructor(
    private apiService: ApiService,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService
  ) {}

  public ngOnInit() {
    //defines the structure for a new empty user
    this.newUser = {
      uid: "",
      email: "",
      password: "",
      lastlogin: "",
      firstname: "",
      lastname: "",
      profile: ""
    };

    this.getAllUsers();
    this.getAllProfiles();

    this.mqttService.getClient().subscribe("administrations/user");
    const i = this;
    this.mqttService.getClient().on("message", (topic: any, message: any) => {
      if (topic.startsWith("administrations/user")) {
        console.log("Test from remote:" + message.toString());
        i.getAllUsers();
      }
    });
  }

  //checks if the email which is entered is valid or not
  private validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  //gets a list of all profiles from DB
  public getAllProfiles() {
    this.profiles = [];

    this.apiService.getAllProfiles().subscribe(
      (response: { success: any; data: any; _body: string }) => {
        if (response.success) {
          this.profiles = response.data;
        } else {
          this.snackbarService.error(response._body);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
      }
    );
  }

  //gets a list of all users from DB
  public getAllUsers() {
    this.users = [];

    this.apiService.getAllUsers().subscribe(
      (response: { success: any; data: any; _body: string }) => {
        if (response.success) {
          this.users = response.data;
          this.selected = null;
        } else {
          this.snackbarService.error(response._body);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
      }
    );
  }

  //updates the selected user
  public userUpdate() {
    //E-Mail validation Abfrage
    if (this.validateEmail(this.selected.email)) {
      this.apiService
        .userUpdate(
          this.selected.uid,
          this.selected.email,
          this.selected.firstname,
          this.selected.lastname,
          this.selected.profile
        )
        .subscribe(
          (response: { success: any; status: string; _body: string }) => {
            if (response.success) {
              this.mqttService
                .getClient()
                .publish("administrations/user", JSON.stringify({}));
              this.snackbarService.success(response.status);
              console.log(response);
            } else {
              this.snackbarService.error(response._body);
            }
          },
          (error: { _body: string }) => {
            this.snackbarService.error(JSON.parse(error._body).status);
          }
        );
    } else {
      this.snackbarService.error("Not a valid E-Mail!");
    }
  }

  //updates the password of the selected user
  public userPassword() {
    this.apiService
      .userPassword(this.selected.uid, this.selected.password)
      .subscribe(
        (response: { success: any; status: string; _body: string }) => {
          if (response.success) {
            this.mqttService
              .getClient()
              .publish("administrations/user", JSON.stringify({}));
            this.snackbarService.success(response.status);
            console.log(response);
          } else {
            this.snackbarService.error(response._body);
          }
        },
        (error: { _body: string }) => {
          this.snackbarService.error(JSON.parse(error._body).status);
        }
      );
  }

  //creates a new user
  public userCreate() {
    if (this.validateEmail(this.selected.email)) {
      this.apiService
        .userCreate(
          this.selected.email,
          this.selected.firstname,
          this.selected.lastname,
          this.selected.profile,
          this.selected.password
        )
        .subscribe(
          (response: { success: any; status: string; _body: string }) => {
            console.log("debug");
            if (response.success) {
              this.mqttService
                .getClient()
                .publish("administrations/user", JSON.stringify({}));
              this.snackbarService.success(response.status);
              console.log(response);
            } else {
              this.snackbarService.error(response._body);
            }
          },
          (error: { _body: string }) => {
            this.snackbarService.error(JSON.parse(error._body).status);
          }
        );
    } else {
      this.snackbarService.error("Not a valid E-Mail!");
    }
  }

  //deletes the selected user
  public userDelete() {
    this.apiService.userDelete(this.selected.uid).subscribe(
      (response: { success: any; _body: string }) => {
        if (response.success) {
          this.mqttService
            .getClient()
            .publish("administrations/user", JSON.stringify({}));
          this.snackbarService.success("User successfully deleted");
        } else {
          this.snackbarService.error(response._body);
        }
      },
      (error: { _body: string }) => {
        this.snackbarService.error(JSON.parse(error._body).status);
      }
    );
  }
}
