import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Environment, Route } from '@mockoon/commons';
import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith
} from 'rxjs/operators';
import { RoutesContextMenu } from 'src/app/components/context-menu/context-menus';
import { ContextMenuEvent } from 'src/app/models/context-menu.model';
import { Settings } from 'src/app/models/settings.model';
import { EnvironmentsService } from 'src/app/services/environments.service';
import { EventsService } from 'src/app/services/events.service';
import { UIService } from 'src/app/services/ui.service';
import {
  DuplicatedRoutesTypes,
  EnvironmentsStatuses,
  Store
} from 'src/app/stores/store';

@Component({
  selector: 'app-routes-menu',
  templateUrl: './routes-menu.component.html',
  styleUrls: ['./routes-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutesMenuComponent implements OnInit {
  @ViewChild('routesMenu') private routesMenu: ElementRef;
  public settings$: Observable<Settings>;
  public activeEnvironment$: Observable<Environment>;
  public routeList$: Observable<Route[]>;
  public activeRoute$: Observable<Route>;
  public environmentsStatus$: Observable<EnvironmentsStatuses>;
  public duplicatedRoutes$: Observable<DuplicatedRoutesTypes>;
  public routeFilter: FormControl;
  public dragIsDisabled = false;

  constructor(
    private environmentsService: EnvironmentsService,
    private store: Store,
    private eventsService: EventsService,
    private uiService: UIService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * WIP
   * - ignore leading slash when searching (DONE)
   * - (maybe) highlight the searched term
   * - move search input next to the plus + (DONE => need to valid with Guillaume escape between title and filter)
   * - add a cross to remove the filter (DONE)
   * - what to do with drag and drop: should be deactivated (DONE)
   * - add tests
   */

  ngOnInit() {
    this.routeFilter = this.formBuilder.control('');

    this.activeEnvironment$ = this.store.selectActiveEnvironment();
    this.activeRoute$ = this.store.selectActiveRoute();
    this.duplicatedRoutes$ = this.store.select('duplicatedRoutes');
    this.environmentsStatus$ = this.store.select('environmentsStatus');
    this.settings$ = this.store.select('settings');

    this.routeList$ = combineLatest([
      this.store.selectActiveEnvironment().pipe(
        filter((activeEnvironment) => !!activeEnvironment),
        distinctUntilChanged(),
        map((activeEnvironment) => activeEnvironment.routes)
      ),
      this.routeFilter.valueChanges.pipe(
        debounceTime(50),
        startWith(''),
        map((search) => search as string)
      )
    ]).pipe(
      map(([routes, search]) => {
        this.dragIsDisabled = search.length > 0;
        if (search.charAt(0) === '/') {
          search = search.substring(1);
        }

        return routes.filter(
          (route) =>
            route.endpoint.includes(search) ||
            route.documentation.includes(search)
        );
      })
    );

    this.uiService.scrollRoutesMenu.subscribe((scrollDirection) => {
      this.uiService.scroll(this.routesMenu.nativeElement, scrollDirection);
    });
  }

  /**
   * Callback called when reordering routes
   *
   * @param event
   */
  public reorderRoutes(event: CdkDragDrop<string[]>) {
    this.environmentsService.moveMenuItem(
      'routes',
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Create a new route in the current environment. Append at the end of the list
   */
  public addRoute() {
    this.environmentsService.addRoute();

    if (this.routesMenu) {
      this.uiService.scrollToBottom(this.routesMenu.nativeElement);
    }
  }

  /**
   * Select a route by UUID, or the first route if no UUID is present
   */
  public selectRoute(routeUUID: string) {
    this.environmentsService.setActiveRoute(routeUUID);
  }

  /**
   * Show and position the context menu
   *
   * @param event - click event
   */
  public openContextMenu(routeUUID: string, event: MouseEvent) {
    // if right click display context menu
    if (event && event.button === 2) {
      const menu: ContextMenuEvent = {
        event,
        items: RoutesContextMenu(routeUUID, this.store.get('environments'))
      };

      this.eventsService.contextMenuEvents.next(menu);
    }
  }

  /**
   * Clear the filter route
   */
  public clearFilter() {
    this.routeFilter.patchValue('');
  }
}
