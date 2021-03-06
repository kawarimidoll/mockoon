import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, SecurityContext } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireRemoteConfigModule } from '@angular/fire/remote-config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { BannerComponent } from 'src/app/components/banner.component';
import { ChangelogModalComponent } from 'src/app/components/changelog-modal.component';
import { ContextMenuComponent } from 'src/app/components/context-menu/context-menu.component';
import { EditorModalComponent } from 'src/app/components/editor-modal/editor-modal.component';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { EnvironmentLogsComponent } from 'src/app/components/environment-logs.component';
import { EnvironmentsMenuComponent } from 'src/app/components/environments-menu/environments-menu.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeadersListComponent } from 'src/app/components/headers-list.component';
import { RouteResponseRulesComponent } from 'src/app/components/route-response-rules/route-response-rules.component';
import { RoutesMenuComponent } from 'src/app/components/routes-menu/routes-menu.component';
import { SettingsModalComponent } from 'src/app/components/settings-modal.component';
import { TitleSeparatorComponent } from 'src/app/components/title-separator/title-separator.component';
import { WelcomeModalComponent } from 'src/app/components/welcome-modal.component';
import { Config } from 'src/app/config';
import { FocusOnEventDirective } from 'src/app/directives/focus-event.directive';
import { InputNumberDirective } from 'src/app/directives/input-number.directive';
import { MousedragDeadzoneDirective } from 'src/app/directives/mousedrag-deadzone.directive';
import { ResizeColumnDirective } from 'src/app/directives/resize-column.directive';
import { ValidPathDirective } from 'src/app/directives/valid-path.directive';
import { MarkedOptionsFactory } from 'src/app/modules-config/markdown-factory';
import { GlobalErrorHandler } from 'src/app/services/global-error-handler';
import { AppComponent } from './app.component';
import { DuplicateRouteModalComponent } from './components/move-route-modal/duplicate-route-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    InputNumberDirective,
    ResizeColumnDirective,
    ValidPathDirective,
    MousedragDeadzoneDirective,
    FocusOnEventDirective,
    ContextMenuComponent,
    WelcomeModalComponent,
    SettingsModalComponent,
    ChangelogModalComponent,
    EditorModalComponent,
    EnvironmentLogsComponent,
    HeadersListComponent,
    BannerComponent,
    RouteResponseRulesComponent,
    EnvironmentsMenuComponent,
    RoutesMenuComponent,
    TitleSeparatorComponent,
    FooterComponent,
    DuplicateRouteModalComponent,
    EditorComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: MarkedOptionsFactory
      }
    }),
    AngularFireModule.initializeApp(Config.firebaseConfig),
    AngularFireAuthModule,
    AngularFireRemoteConfigModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule {}
