import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService } from "../services/alert.service";
import { ApiService } from "../services/api.service";
import { AdamoMqttService } from "../services/mqtt.service";
import { environment } from "../../environments/environment";
import { NGXLogger } from "ngx-logger";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { AuthService } from "../services";
import { first } from "rxjs/operators";
import { AuthService } from "../services";

// import {version} from "./../../../package.json"; TODO
//Include components for interface and styling
@Component({
  selector: "front-page",
  templateUrl: "./frontpage.component.html",
  styleUrls: ["./frontpage.component.less"]
})
export class FrontPageComponent implements OnInit {
  public loginForm: FormGroup;

  private project = environment.PROJECTNAME;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logger: NGXLogger,
    private authService: AuthService
  ) {
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(["/"]);
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.logger.debug("submit pressed");
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.logger.debug("login form invalid");
      return;
    }

    this.logger.debug("form valid");
    this.loading = true;
    this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.logger.debug(`data received ${this.returnUrl}`);
          this.router.navigate(["/overview"]);
          // this.router.navigate([this.returnUrl]);
        },
        (error: any) => {
          this.logger.debug("error received ", error);
          this.error = error;
          this.loading = false;
        }
      );
  }
}
