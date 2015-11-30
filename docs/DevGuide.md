#Develop Guide

1. [Usando os componentes Jedi](#usando-os-componentes-jedi)
    1. [Configurações Iniciais](#configurações-iniciais)
    1. [CRUD](#crud)
    1. [Criando Services](#criando-services)
    1. [Criando Modais](#criando-modais)
    1. [Criando Directives](#criando-directives)
    1. [Criando Filters](#criando-filters)
1. [Composição do HTML](#composição-do-html)

##Usando os componentes Jedi
###Configurações Iniciais

* CORS + Headers + Restangular

    ```javascript
    app.config(['$routeProvider', '$httpProvider', 'RestangularProvider', 'jedi.utilities.UtilitiesProvider',  function ($routeProvider, $httpProvider, RestangularProvider,  Utilities) {
    //...

    // configuração dos headers padrões para funcionamento do CORS
    Utilities.enableCors($httpProvider);

    // configuração dos headers para evitar bug com If-Modified-Since no iis
    Utilities.fixIISHttpHeaders($httpProvider);

    // configura Restangular
    Utilities.configureRestangular(RestangularProvider);

    //...
    }]);
    ```

* Rotas

    ```javascript
    var $routeProviderReference;

    app.config(['$routeProvider',  function ($routeProvider) {
	   //...

    	// atribui $routeProvider para ser usado posteriormente para configuração das rotas dinamicamente
        $routeProviderReference = $routeProvider;

    	//...
    }]);

    app.run(['$route', function ($route) {
        // load app modules (e.g.: core, billing)
        jd.factory.loadModules(['core'], function (module) {
            // adiciona path para i18n do sistema
            localize.addResource('app/' + module + '/i18n/resources_{lang}.json');
        }, function () {
            // after load all modules and its dependencies, it can load routes

            $log.info('Load routes');

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

* Incluindo novas dependências
    * bower install package-name --save
    * Após baixar o novo módulo, é necessários incluir os diretórios no arquivo assetsfiles.json, que por sua vez, será responsável por dizer qual diretório do seu projeto a rotina do grunt deverá copiar os arquivos da pasta bower_components. e.g.:
    
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
    * Agora é necessários incluir as dependências do novo módulo na sua aplicação Angular. Para isso, abra o arquivo main.tpl.js e siga o exemplo:
    
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
        deps: ["app“]
    });
    ```
    
###CRUD

* Controller

    ```javascript
    /*
        Controlador da sua primeira tela.
    */
    jd.factory.newController('app.yourSystem.yourModule.yourFeature.YourFeatureCtrl', ['jedi.dialogs.AlertHelper', 'yourSystemRestService', 'toastr', function (alertHelper, yourSystemRestService, toastr) {
    
    'use strict';

    //#region View/Model initialize
    //Utilize o padão ViewModel(vm) para construção dos controllers
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
    //Caso tenha a necessidade, chame functions ao iniciar a página.
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
                toastr.success('A funcionalidade ' + yourFeature.name + ' foi removida com sucesso!');
                filter();
            });
        });
    }

    function openEditModal(yourFeature) {
        //Chamada da modal para edição
        modalHelper.open('yourFeatureEdit.html', ['$scope', '$modalInstance', 'yourFeature', 'action', SystemRegistrationEditCtrl], { yourFeature: yourFeature, action: 'edit' }, function () {
            vm.filter();
        });
    }

    function openCreateModal() {
        //Chamada da modal para inclusão
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
            <input jd-input jd-label="Nome" type="text" ng-model="yourFeatureCtrl.yourFeatureModel.nameFilter" />
            <input jd-input jd-label="Apelido" type="text" ng-model="yourFeatureCtrl.yourFeatureModel.aliasFilter" />
        </div>
        <div class="row">
            <div class="col-xs-12">
                <button class="btn btn-primary" ng-click="yourFeatureCtrl.filter()" jd-i18n>Filtrar</button>
                <button class="btn btn-info" ng-click="yourFeatureCtrl.clear()" jd-i18n>Limpar</button>
                <button class="btn btn-info" ng-click="yourFeatureCtrl.openCreateModal()" jd-i18n>Novo</button>
            </div>
        </div>
    </div>

    <div jd-panel jd-title="Resultado" jd-toggle="yourFeatureCtrl.togglePanelResults">
        <table jd-table="yourFeatureCtrl.resultTableConfig" jd-paginated>
            <tbody>
                <tr>
                    <td jd-sortable jd-attribute="name" jd-title="Nome"></td>
                    <td jd-sortable jd-attribute="alias" jd-title="Apelido"></td>
                    <td jd-sortable jd-attribute="code" jd-title="Código"></td>
                    <td jd-sortable jd-attribute="description" jd-title="Descrição"></td>
                    <td jd-title="Ações" class="text-center" width="100px">
                        <a href="javascript:;" jd-i18n title="Editar" ng-click="yourFeatureCtrl.openEditModal(item)"><i class="glyphicon glyphicon-pencil"></i></a>
                        &nbsp;
                        <a href="javascript:;" jd-i18n title="Excluir" ng-click="yourFeatureCtrl.remove(item)"><i class="glyphicon glyphicon-remove"></i></a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</form>
```

###Criando Services

```javascript
jd.factory.newService("yourService", 'api/myAction/:userId', {'get': {method: 'GET'}}, {itemId:'@id'});

// using 'yourService' in a controller
app.controller(['yourService', function (yourService) {
  var item = yourService.get(id);
  item.post();
}]);
```

###Criando Modais

```javascript
jd.factory.newModal("yourModalDirective", 'app/view/yourModal.html', 'yourModalCtrl', ['myService', ['param1', 'param2'], function (myService, param1, param2) {
  	// your controller body
 	// we recommend writing the controller using the vm pattern
}], {size: 'lg'});
```
```html
<!-- using 'yourModalDirective'-->
<button your-modal-directive></button>
<!-- Or -->
<input your-modal-directive="onblur">
```

###Criando Directives
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

###Criando Filters

```javascript
jd.factory.newFilter('yourFilter', [function () {
  return function (values) {
     return ...;
  }
]);
```

###Composição do HTML

* Projeto utiliza twitter bootstrap, este por sua vez divide os espaços de uma determinada área em 12 partes. Sempre procurar preencher as 12 áreas para evitar espaços na tela. A diretiva jd-input já está preparada para trabalhar com estes 12 tamanhos, tendo como default a divisão de cada linha da tela em 6 campos para telas grandes, 4 campos para telas desktops convencionais, 2 campos para telas tablet e 1 campo para mobile. Para usar outros valores basta usar atributos jd-XX-size e redefinir. Mais informações na doc da diretiva.

* Sempre usar elemento principal do tipo form com diretiva jd-panel (para telas abertas via navegação) ou jd-modal (para telas abertas via modal). Ex.:
```html
<form jd-panel jd-title="TÍTULO" ng-controller="NomeControlador as aliasControlador">
```
   Obs.: modais não precisam ter a diretiva ng-controller.

* Campos iniciais do form devem ficar dentro de uma div.row:
```html
<form ...>
   <div class="row">
      ... campos
   </div>
</form>
```

    Obs.: Telas de consulta/seleção deverão encobrir os campos e botões em uma jd-panel, com título padrão “Filtros” e a diretiva jd-toggle. Sempre que houver mais de um contexto em uma mesma tela, separar cada contexto em áres, através do jd-panel.

* Botões sempre abaixo dos campos, com a classe btn, dentro de uma div.row e div.col:
```html
<form ...>
   <div class="row">
      <div class="col-xs-12">
         <button class="btn btn-primary">Botão 1</button>
         <button class="btn btn-info">Botão 2</button>
      </div>
   </div>
</form>
```

    Obs.: Todo botão da ação principal deve usar a classe btn-primary, sendo o primeiro botão à esquerda, demais usar a classe btn-info. Não deve haver mais de um botão com btn-primary.

* Grids devem usar a diretiva at-table

     * Caso seja utilizado área contextual para exibição de resultado, utilizar jd-panel juntamente com o jd-toggle:
```html
<form ...>
   <div jd-panel="Resultado" jd-toggle>
      <table at-table ...>
         ...
      </table>
   </div>
</form>
```

     * Caso seja uma grid dentro de uma área existente, junto com outros elementos, deverá ficar em uma div.col-xs-12, dentro de outra div.row:
```html
<form ...>
   <div class="row">
      <div class="col-xs-12">
         <table at-table ...>
            ...
         </table>
      </div>
   </div>
</form>
```

* Textarea, checkbox múltiplo e radio múltiplo devem ocupar uma linha inteira, utilizar um div.row e tamanho 12:
```html
<form ...>
   ...
   <div class="row">
      <input jd-input="12" jd-grouplabel="LABEL GRUPO" type="radio|checkbox" jd-repeat="...">
   </div>
   <div class="row">
      <textarea jd-input="12" jd-label="LABEL TEXTAREA">
   </div>
</form>
```
* Áreas dentro do form devem usar div com diretiva jd-panel dentro de uma div.col definindo o tamanho e uma div.row para compor as áreas:
```html
<form ...>
   ...
   <div class="row">
      <div class="col-md-6"> --> md-6 irá dividir a metade da tela para essa área apenas em resolução desktop
         <div jd-panel jd-title="NOME AREA">
         </div>
      </div>
      <div class="col-md-6"> --> md-6 irá dividir a metade da tela para essa área apenas em resolução desktop
         <div jd-panel jd-title="NOME AREA">
         </div>
      </div>
   </div>
</form>
```

* Sempre que quiser dividir explicitamente a quebra de determinados campos em linhas separadas, usar div.row em cada agrupamento:
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
      <input jd-input jd-grouplabel="LABEL GRUPO" type="radio|checkbox" jd-repeat="...">
   </div>
   <div class="row">
      <textarea jd-input jd-label="LABEL TEXTAREA">
   </div>
</form>
```

* Textos de help deverão usar o elemento <small class=”help-block”>. Caso se deseje aplicar em um input, basta usar o jd-input juntamente com o jd-help=”Texto do help”:
```html
<form ...>
   ...
   <div class="row">
      <input jd-input jd-label="LABEL" jd-help="TEXTO HELP">
   </div>
</form>
```
para HTML puro:
```html
<form ...>
   ...
   <div class="row">
      ...
      <input ...>
      <small class="help-block">TEXTO HELP</small>
      ...
   </div>
</form>
```
* Campos com botões de contexto (como botão pra buscar ou limpar o campo) devem usar a seguinte estrutura:
```html
<div jd-input jd-label="LABEL" jd-element-class="input-group">
	<input jd-validation-tooltip class="form-control" required type="text" ...>
	<span class="input-group-btn">
		<button jd-i18n title="Selecionar" class="btn btn-warning" ...><i class=" glyphicon glyphicon-list-alt"></i></button>
	</span>
</div>
```
    Obs.: O div principal com o jd-input e campo input com jd-validation-tooltip, se no input for usado jd-input o layout quebrará pois esta diretiva fará wrapper do elemento com o template de form-control bootstrap.

* Botões
    * Salvar:
        * Ícone: glyphicon-floppy-disk
        * Estilo: btn-primary

    * Excluir:
        * Ícone: glyphicon-remove
        * Estilo: btn-danger (se for um button)

    * Editar:
        * Ícone: glyphicon-pencil
        * Estilo: btn-info (se for um button)

    * Incluir/Adicionar:
        * Ícone: glyphicon-plus
        * Estilo: btn-info (se for um button)

    * Modal de seleção:
        * Ícone: glyphicon-list-alt
        * Estilo: btn-warning

    * Botão de seleção em grid:
        * Ícone: glyphicon-ok
        * Estilo: btn-info (se for um button)

    * Botão de visualizar detalhes:
        * Ícone: glyphicon-zoom-in
        * Estilo: btn-info (se for um button)

    * Botão de limpar seleção (vinda de modal por exemplo):
        * Ícone: glyphicon-remove
        * Estilo: btn-danger (se for um button)

Obs.: Botões com apenas ícone é obrigatório informar um title com a descrição da ação.
