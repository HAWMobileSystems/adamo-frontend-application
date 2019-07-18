'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">angular2-webpack documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' : 'data-target="#xs-components-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' :
                                            'id="xs-components-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' }>
                                            <li class="link">
                                                <a href="components/AdministrationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdministrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AlertComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppFooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppFooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvalModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EvalModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FrontPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FrontPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InputModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InputVarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputVarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelLoaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelLoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModellerPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModellerPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PermissionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PermissionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RoleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SaveModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SaveModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubProcessModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubProcessModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TermModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsageModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsageModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VariableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VariableModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' : 'data-target="#xs-injectables-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' :
                                        'id="xs-injectables-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' }>
                                        <li class="link">
                                            <a href="injectables/AdamoMqttService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AdamoMqttService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AlertService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AlertService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApiService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ApiService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SnackBarService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SnackBarService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' : 'data-target="#xs-pipes-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' :
                                            'id="xs-pipes-links-module-AppModule-b6a164a5b02ce780020f2123c74c174e"' }>
                                            <li class="link">
                                                <a href="pipes/FilterUnique.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterUnique</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/Timestamp2Date.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Timestamp2Date</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/Version.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Version</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FrontPageModule.html" data-type="entity-link">FrontPageModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractDto.html" data-type="entity-link">AbstractDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractEntity.html" data-type="entity-link">AbstractEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthenticationResponse.html" data-type="entity-link">AuthenticationResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommandStack.html" data-type="entity-link">CommandStack</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entry.html" data-type="entity-link">Entry</a>
                            </li>
                            <li class="link">
                                <a href="classes/Evaluator.html" data-type="entity-link">Evaluator</a>
                            </li>
                            <li class="link">
                                <a href="classes/Link.html" data-type="entity-link">Link</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginPayloadDto.html" data-type="entity-link">LoginPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponse.html" data-type="entity-link">LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Model.html" data-type="entity-link">Model</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModelElement.html" data-type="entity-link">ModelElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/SnackBarMessage.html" data-type="entity-link">SnackBarMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenPayloadDto.html" data-type="entity-link">TokenPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link">UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link">UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/Variable.html" data-type="entity-link">Variable</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService-1.html" data-type="entity-link">ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticatedHttpService.html" data-type="entity-link">AuthenticatedHttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BPMNStore.html" data-type="entity-link">BPMNStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link">RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StoreService.html" data-type="entity-link">StoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/ErrorInterceptor.html" data-type="entity-link">ErrorInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/FakeBackendInterceptor.html" data-type="entity-link">FakeBackendInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/JwtInterceptor.html" data-type="entity-link">JwtInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link">RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FileReaderEvent.html" data-type="entity-link">FileReaderEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileReaderEventTarget.html" data-type="entity-link">FileReaderEventTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Window.html" data-type="entity-link">Window</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});