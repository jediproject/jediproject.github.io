#Develop Guide

1. [Using Jedi Components](#using-jedi-components)
    1. [Initial Configs](#initial-configs)
    1. [CRUD](#crud)
    1. [Creating Services](#creating-services)
    1. [Creating Modals](#creating-modals)
    1. [Creating Directives](#creating-directives)
    1. [Creating Filters](#creating-filters)
1. [HTML Guidelines](#html-guidelines)

##Using Jedi Components
###Initial Configs

* CORS + Headers + Restangular
```javascript
    app.config(['$routeProvider', '$httpProvider', 'RestangularProvider', 'jedi.utilities.UtilitiesProvider',  function ($routeProvider, $httpProvider, RestangularProvider,  Utilities) {
    //...

    // config the standard headers to enable CORS
    Utilities.enableCors($httpProvider);

    // config headers to avoid "If-Modified-Since" bug on IIS
    Utilities.fixIISHttpHeaders($httpProvider);

    // config restangular
    Utilities.configureRestangular(RestangularProvider);

    //...
    }]);
```
* Routes
```javascript
    var $routeProviderReference;

    app.config(['$routeProvider',  function ($routeProvider) {
       //...

        // save the $routeProvider to be used later in the route configuration
        $routeProviderReference = $routeProvider;

        //...
    }]);

    app.run(['$route', function ($route) {
        // load app modules (e.g.: core, billing)
        jd.factory.loadModules(['core'], function (module) {
            // add i18n path on system
            localize.addResource('app/' + module + '/i18n/resources_{lang}.json');
        }, function () {
            // after loading all modules and its dependencies, it can load the routes

            $log.info('Loading routes');

            // to load the routes dynamically you could make a http request to your back-end service and retrieve all feature routes that the user has access.
            $routeProviderReference
                //#===== yeoman route hook =====#
                .when('/core/animals', angularAMD.route({
                    breadcrumb: ['Core', 'Animais'],
                    templateUrl: jd.factory.getFileVersion('app/core/features/animals/animals.html'),
                    controllerUrl: jd.factory.getFileVersion('app/core/features/animals/animals-ctrl.js')
                }))
                .when('/core/donate', angularAMD.route({
                    breadcrumb: ['Core', 'Quero Doar'],
                    templateUrl: jd.factory.getFileVersion('app/core/features/donate/donate.html'),
                    controllerUrl: jd.factory.getFileVersion('app/core/features/donate/donate-ctrl.js')
                }))
                .when('/common/components', angularAMD.route({
                    breadcrumb: ['Comum', 'Componentes'],
                    templateUrl: jd.factory.getFileVersion('app/common/features/components/components.html'),
                    controllerUrl: jd.factory.getFileVersion('app/common/features/components/components-ctrl.js')
                }));
    
            $route.reload();
        });
    }]);
```
* Including new dependencies:

    * Install or download them to your machine using whatever you see fit. You can try using bower, e.g:
	```shell
	    bower install package-name --save
	```
    * Add the path to the desired files to **assetsfiles.json**, specifying source ("*src*") and destination ("*dest*"). Source is the file you want to include in your project, and destination is where in your project should grunt copy that file to, e.g:
	```json
	    {
	            "files": [
	                {
	                    "src": "bower_components/angular/angular.js",
	                    "dest": "assets/libs/angular/angular.js"
	                },
	                {
	                    "src": "bower_components/jquery/dist/jquer.js",
	                    "dest": "assts/libs/jquery/jquery.js"
	                }
	            ]
	        }
	```

    * Then include these deps in the new module on your Angular app. Open the **main.tpl.js** and do like in the following example:
	```javascript
	    "use strict";
	
	    require.config({
	        baseUrl: "",
	    
	        // alias libraries paths. Must set "angular"
	        paths: {
	            'app'= 'app/app.js',
	            'version': 'version.json',
	            'modules': 'app/modules.json',
	    
	            // main Dependencies
	            'ng-jedi-utilities': 'assets/libs/ng-jedi-utilities/utilities.js',
	    
	            // ## Common Components
	            'app-common': 'app/common/common-app.js',
	    
	            //## 3rd party angular scripts
	            'angular': 'assets/libs/angular/angular.js',
	    
	            //## 3rd party non angular scripts
	            'jquery': 'assets/libs/jquery/jquery.js'
	    
	        },
	        
	        // Add angular modules that does not support AMD out of the box, put it in a shim
	        shim: {
	            "jquery"= {
	                exports: "$"
	            },
	            "angular": {
	                deps: ["jquery"],
	                exports: "angular"
	            }
	        },
	    
	        // kick start application
	        deps: ["app"]
	    ]);
	```
    
###CRUD

* Controller
```javascript
    /*
        Your first page controller.
    */
    jd.factory.newController('app.yourSystem.yourModule.yourFeature.YourFeatureCtrl', ['jedi.dialogs.AlertHelper', 'yourSystemRestService', 'toastr', function (alertHelper, yourSystemRestService, toastr) {
    
    'use strict';

    //#region View/Model initialize
    // Use the vm syntax to build your controller
    var vm = this;
    vm.yourFeatureModel = {};
    //#endregion

    //#region Service initialize
    var yourRestService = yourSystemRestService.all('your/api/url');
    //#endregion

    //#region Events binds
    vm.openEditModal = openEditModal;
    vm.openCreateModal = openCreateModal;
    vm.filter = filter;
    vm.remove = remove;
    vm.clear = clear;
    vm.resultTableConfig = {
        changeEvent: tableChangeEvt,
        loadOnStartup: true
    };
    //#endregion

    //#region Load controller
    // Any functions that should be called when the page is loaded.
    //#endregion

    //#region Events definitions
    function tableChangeEvt(pageInfo, deferred) {
        var _filter = {};

        if (vm.yourFeatureModel.nameFilter) {
            _filter.name = vm.importHistoryModel.systemFilter.alias;
        }
        if (vm.yourFeatureModel.aliasFilter) {
            _filter.alias = vm.importHistoryModel.moduleFilter.alias;
        }        

        angular.extend(pageInfo, _filter);

        yourRestService.getList(pageInfo).then(function (data) {
            deferred.resolve(data);
        });
    }

    function filter() {        
        vm.resultTableConfig.refresh();
        vm.togglePanelResults = true;
    }

    function clear() {
        vm.yourFeatureModel.nameFilter = null;
        vm.yourFeatureModel.aliasFilter = null;
        filter();
    }    

    function remove(yourFeature) {
        alertHelper.confirm('Deseja realmente excluir ' + yourFeature.name + '?', function () {            
            yourFeature.remove({ id: yourFeature.id }).then(function () {  
                toastr.success('The Feature ' + yourFeature.name + ' was succesfully removed!');          
                filter();
            });
        });
    }

    function openEditModal(yourFeature) {
        modalHelper.open('yourFeatureEdit.html', ['$scope', '$modalInstance', 'yourFeature', 'action', SystemRegistrationEditCtrl], { yourFeature: yourFeature, action: 'edit' }, function () {
            vm.filter();
        });
    }

    function openCreateModal() {
        modalHelper.open('yourFeatureEdit.html', ['$scope', '$modalInstance', 'yourFeature', 'action', SystemRegistrationEditCtrl], { yourFeature: {}, action: 'new' }, function () {
            vm.filter();
        });
    }
    //#endregion

    }]);
```
* View
```html
<form jd-panel jd-title="YourFeature" ng-controller="app.yourSystem.yourModule.yourFeature.YourFeature as yourFeatureCtrl">

	 <div jd-panel jd-title="Filtros" jd-toggle>
        <div class="row">
            <input jd-input jd-label="Name" type="text" ng-model="yourFeatureCtrl.yourFeatureModel.nameFilter" />
            <input jd-input jd-label="Alias" type="text" ng-model="yourFeatureCtrl.yourFeatureModel.aliasFilter" />
        </div>
        <div class="row">
            <div class="col-xs-12">
                <button class="btn btn-primary" ng-click="yourFeatureCtrl.filter()" jd-i18n>Filter</button>
                <button class="btn btn-info" ng-click="yourFeatureCtrl.clear()" jd-i18n>Clear</button>
                <button class="btn btn-info" ng-click="yourFeatureCtrl.openCreateModal()" jd-i18n>New</button>
            </div>
        </div>
    </div>

    <div jd-panel jd-title="Result" jd-toggle="yourFeatureCtrl.togglePanelResults">
        <table jd-table="yourFeatureCtrl.resultTableConfig" jd-paginated>
            <tbody>
                <tr>
                    <td jd-sortable jd-attribute="name" jd-title="Name"></td>
                    <td jd-sortable jd-attribute="alias" jd-title="Alias"></td>
                    <td jd-sortable jd-attribute="code" jd-title="Code"></td>
                    <td jd-sortable jd-attribute="description" jd-title="Description"></td>
                    <td jd-title="Actions" class="text-center" width="100px">
                        <a href="javascript:;" jd-i18n title="Edit" ng-click="yourFeatureCtrl.openEditModal(item)"><i class="glyphicon glyphicon-pencil"></i></a>
                        &nbsp;
                        <a href="javascript:;" jd-i18n title="Remove" ng-click="yourFeatureCtrl.remove(item)"><i class="glyphicon glyphicon-remove"></i></a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</form>
```

###Creating Services
```javascript
jd.factory.newService("yourService", 'api/myAction/:userId', {'get': {method: 'GET'}}, {itemId:'@id'});

// using 'yourService' in a controller
app.controller(['yourService', function (yourService) {
  var item = yourService.get(id);
  item.post();
}]);
```

###Creating Modals

Javascript: 
```javascript
jd.factory.newModal("yourModalDirective", 'app/view/yourModal.html', 'yourModalCtrl', ['myService', ['param1', 'param2'], function (myService, param1, param2) {
  	// your controller body
 	// we recommend writing the controller using the vm pattern
}], {size: 'lg'});
```
	
HTML:
```html
<!-- using 'yourModalDirective'-->
<button your-modal-directive></button>
<!-- Or -->
<input your-modal-directive="onblur">
```

###Creating Directives
```javascript
jd.factory.newDirective("yourDirective", [function () {
  return {
     restrict: 'A',
     link: function (scope, element, attrs) {
     ...
     }
  }
}]);
```

###Creating Filters
```javascript
jd.factory.newFilter('yourFilter', [function () {
  return function (values) {
     return ...;
  }
]);
```

###HTML Guidelines

* We use Twitter's [Bootstrap](http://getbootstrap.com/) in the project. Bootstraps works by always dividing the space in any html area in 12 columns and as many rows as needed. To avoid unplanned blank spaces try to always fill all the columns. 

* The **jd-input** directive is ready to work like that, and automatically try to fill all the spaces. The default behaviour for the jd-input is to fill each row with 6 components on large displays, 4 components on medium displays (regular desktop), 2 components on small displays (tablets), and 1 component on mobile displays. You can change the default value by using the jd-XX-size attributes. More info on the jd-input can be found in its own [docs](https://github.com/jediproject/ng-jedi-layout#ng-jedi-layout).

* See [this](http://getbootstrap.com/css/#grid) to read more about bootstrap's space organization and display sizes.

* Always use a **form** element as the root element (or the main element) of your current view. Use the directives **jd-panel** (to regular pages) or **jd-modal**. E.g:
```html
<form jd-panel jd-title="TÍTULO" ng-controller="ControllerName as controllerAlias">
```

Tip: modals don't need the ng-controller directive.

* Always use at least one row to organize things inside the **form**:
```html
<form ...>
   <div class="row">
      ...
   </div>
</form>
```

* Info or selection views should always wrap fields and buttons in a **jd-panel** having "Filters" as a standard title and with the **jd-toggle** attribute. Also use the **jd-panel** to separate the view in different contexts. E.g:
```html
<form ...>
   <div class="row">
        <div jd-panel jd-title="Filters" jd-toggle>
            <div class="row">
                ...
            </div>
            <div class="row">
                ...
            </div>
        </div>
        <div jd-panel jd-title="Info" jd-toggle>
            <div class="row">
                ...
            </div>
        </div>
   </div>
</form>
``` 

* Buttons should always be at the bottom of the context, using class *btn* inside a div.row and a div.col:
```html
<form ...>
    ...
   <div class="row">
      <div class="col-xs-12">
         <button class="btn btn-primary">Button 1</button>
         <button class="btn btn-info">Button 2</button>
      </div>
   </div>
   ...
</form>
```

Tip: The button with the main action on a page should have the *btn-primary* class. It also should be the first button on the left (in case of multiple buttons aligned). All the other button elements should use the *btn-info* class, and there should be only one button with *btn-primary* in a page.

* Grids should use the **jd-table** directive
    
    * When using grids to display data as a result of something (a search result, maybe) use a **jd-panel** and **jd-toggle** to form a context for the grid:
	```html
	<form ...>
	   <div jd-panel="Results" jd-toggle>
	      <table jd-table ...>
	         ...
	      </table>
	   </div>
	</form>
	```
    * If the grid is already part of any existent context or view it should be in div.col-xs-12 inside a div.row, like this:
	```html
	<form ...>
	   <div class="row">
	      <div class="col-xs-12">
	         <table jd-table ...>
	            ...
	         </table>
	      </div>
	   </div>
	</form>
	```

* A textarea, a group of checkboxes or a group of radio buttons should each use one entire line (or row), being inside a div.row and having size 12 as follow:
```html
<form ...>
   ...
   <div class="row">
      <input jd-input="12" jd-grouplabel="LABEL GROUP" type="radio|checkbox" jd-repeat="...">
   </div>
   <div class="row">
      <textarea jd-input="12" jd-label="LABEL TEXTAREA">
   </div>
</form>
```

* To create multiple contexts side by side use a div with **jd-panel** inside a div.col with the size of each area and inside a div.row:
```html
<form ...>
   ...
   <div class="row">
      <div class="col-md-6"> <!-- md-6 it will divide this area in half but only on desktop or bigger resolution (because of the "md") -->
         <div jd-panel jd-title="AREA NAME">
         </div>
      </div>
      <div class="col-md-6">
         <div jd-panel jd-title="AREA NAME">
         </div>
      </div>
   </div>
</form>
```

* Use div.row to explicitly organize the view having specific fields or elements in diferent lines:
```html
<form ...>
   <div class="row">
      <input jd-input jd-label="LABEL" ...>
      <input jd-input jd-label="LABEL" ...>
      <input jd-input jd-label="LABEL" ...>
   </div>
   <div class="row">
      <input jd-input jd-label="LABEL" ...>
   </div>
   <div class="row">
      <input jd-input jd-grouplabel="LABEL GROUP" type="radio|checkbox" jd-repeat="...">
   </div>
   <div class="row">
      <textarea jd-input jd-label="LABEL TEXTAREA">
   </div>
</form>
```

* Help or info texts should use the *small* html element with the *help-block* class. Or combine it in a **jd-input** field using the **jd-help** attribute.
```html
<form ...>
   ...
   <div class="row">
      <input jd-input jd-label="LABEL" jd-help="TEXT HELP">
   </div>
</form>
<!-- OR -->
<form ...>
   ...
   <div class="row">
      ...
      <input ...>
      <small class="help-block">TEXT HELP</small>
      ...
   </div>
</form>
```

* You can combine fields with buttons (like a selecting or cleaning button for a input field) should use the following structure:
```html
<div jd-input jd-label="LABEL" jd-element-class="input-group">
	<input jd-validation-tooltip class="form-control" required type="text" ...>
	<span class="input-group-btn">
		<button jd-i18n title="Select" class="btn btn-warning" ...><i class=" glyphicon glyphicon-list-alt"></i></button>
	</span>
</div>
```
Tip: The main div should have the **jd-input** directive and the input element only the **jd-validation-tooltip** attribute. If you set the input element with the **jd-input** directive the layout will break and not look good. 

* Buttons
    * Save:
        * Icon: glyphicon-floppy-disk
        * Class: btn-primary

    * Remove:
        * Icon: glyphicon-remove
        * Class: btn-danger (if it is a button)

    * Edit:
        * Icon: glyphicon-pencil
        * Class: btn-info (if it is a button)

    * Include/Add:
        * Icon: glyphicon-plus
        * Class: btn-info (if it is a button)

    * Selection Modal:
        * Icon: glyphicon-list-alt
        * Class: btn-warning

    * Button to select an element inside a grid (table):
        * Icon: glyphicon-ok
        * Class: btn-info (if it is a button)

    * Details or Info button:
        * Icon: glyphicon-zoom-in
        * Class: btn-info (if it is a button)

    * Clear Field or Clear Selection button:
        * Icon: glyphicon-remove
        * Class: btn-danger (if it is a button)
        
Tip: Buttons not containing text (buttons that only have an icon) must have a title describing its action.
