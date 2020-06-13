import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ViewComponent } from './view/view.component';
import { SearchComponent } from './search/search.component';
import { HeaderComponent } from './_shared-module/components/header/header.component';
import { FooterComponent } from './_shared-module/components/footer/footer.component';
import { CreateComponent } from './create/create.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ListViewComponent } from './_shared-module/components/list-view/list-view.component';
import { UpdateDialogBoxComponent } from './_shared-module/components/update-dialog-box/update-dialog-box.component';

import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './details/details.component';
import { DeleteDialogBoxComponent } from './_shared-module/components/delete-dialog-box/delete-dialog-box.component';
import { NotificationDialogBoxComponent } from './_shared-module/components/notification-dialog-box/notification-dialog-box.component';

import { PeopleService } from './_shared-module/services/people.service';
import { PeopleList } from './_shared-module/models/person.model';
import { HomeComponent } from './home/home.component';
import { AlertOnPageComponent } from './_shared-module/components/alert-on-page/alert-on-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    ListViewComponent,
    UpdateDialogBoxComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    CreateComponent,
    DetailsComponent,
    DeleteDialogBoxComponent,
    NotificationDialogBoxComponent,
    HomeComponent,
    AlertOnPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgbModule,
    FormsModule,
    MatPaginatorModule
  ],
  providers: [PeopleService, PeopleList, AlertOnPageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
