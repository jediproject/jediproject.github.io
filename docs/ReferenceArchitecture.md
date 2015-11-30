 
#AngularJs Reference Architecture

1. [Goals](#Goals)
1. [Foundations](#Foundations)
1. [Target](#Target)
1. [Overview](#Overview)
    1. [Traditional Model](#Traditional-Model)
    1. [SPA Model](#SPA-Model)
1. [Logic View](#Logic-View)
    1. [Views](#Views)
    1. [Controllers](#Controllers)
    1. [Services](#Services)
1. [Code Structure](#Code-Structure)
    1. [General Resources](#General-Resources)
    1. [Foundation Structure](#Foundation-Structure)
    1. [Module Structure](#Module-Structure)
1. [Patterns and Restrictions](#Patterns-and-Restrictions)
    1. [General](#General)
    1. [Controllers](#Controllers)
    1. [Services](#Servies)
    1. [Views](#Views)
    1. [Directives](#Directives)
    1. [Filters](#Filters)
1. [Recommended Tools](#Recommended-Tools)
    1. [Dependency Management - Bower vs NPM](#Dependency-Management---Bower-vs-NPM)
    1. [Build e Deploy](#Build-e-Deploy)
    1. [Automated Tests](#Automated-Tests)
    1. [Code Generation](#Code-Generation)
    1. [Mocks](#Mocks)
    1. [Debugging](#Debugging)
1. [Components](#Components)

##<a name="Goals"></a>Goals

Provide guidance and recommendations on the tools, best practices, standards, constraints and solution design that can/should be used to develop an application SPA (Single Page Application) with angularjs.

##Foundations

* Promoting productivity for projects
* Standardize SPA applications
* Facilitate the training of teams
* Adoption of standards and market practices

##Target
Mainly applications with angularjs SPA, since it is more widespread, stable and evolving. Presented techniques can mostly be adopted in other frameworks SPA or even Web applications.

##Overview

###Traditional Model

![Communication](../dist/img/Communication.png)

In this traditional model the navigation between pages, occurred in the browser, request or send data waiting to return a new HTML to be rendered on top of the current page, even in situations where the request to stay on the same page. Usually this HTML is prepared dynamically in the web application server.

Frameworks like JSF, Spring MVC, ASP.NET MVC, django, Play, Rails, among others, implement this building model.

###SPA Model

![SPAModel](../dist/img/SPAModel.png)

Já neste modelo em SPA, as requisições de páginas HTML são menores, são realizadas quando muda-se de página, entretanto é retornado HTMLs estáticos sem preparação adiciona no servidor de aplicações. Dados são trocados (enviados ou recebidos do servidor) através de requisições AJAX em APIs REST, trafegando dados em formato JSON ou XML.

Este modelo é composto por basicamente 3 tecnologias base:
* HTML: páginas ou fragmento de páginas
* JavaScript: controladores e outros recursos programáticos
* CSS: folha de estilos visuais

Existem alguns frameworks que implementam este modelo (Ember, knockout, backbone.js, etc), porém o recomendado, como já dito acima, é utilizar AngularJs.

##Logic View

![LogicStructure](../dist/img/LogicStructure.png)

Em aplicações SPA a recomendação é a adoção do modelo acima, basicamente adotar o padrão MVC no lado client, separando e organizando o código por responsabilidade.

AngularJs já direciona a construção para este padrão MVC e possui tipos de componentes atuando em cada uma destas camadas.

###Views

Camada onde teremos a implementação da tela e componentes visuais. Nesta camada encontramos os seguintes componentes/recursos AngularJs:

* HTML/Templates
* Data Binds
* Directives
* Filters

###Controllers

Camada onde teremos a implementação dos controladores de fluxo e navegação entre telas. Nesta camada encontramos os seguintes componentes/recursos AngularJs:

* Controller
* Router e Location

###Services
Camada onde teremos a implementação dos serviços, com regras de negócio (quando não há backend) ou chamadas ao backend. Nesta camada encontramos os seguintes componentes/recursos AngularJs:

* Service
* Factory
* Provider

##Code Structure

Segue abaixo a organização base proposta para projetos SPA, baseado em padrões de mercado e evoluído com incremento de algumas divisões pontuais.

Referência base: https://scotch.io/tutorials/angularjs-best-practices-directory-structure

###General Resources

```
assets --> componentes externos ou implementaçao de código não vinculado ao SPA
assets\libs --> bibliotecas externas (ex: angular, jquery, bootstrap, etc)
assets\css --> css de terceiros
assets\css\app.css --> css customizado no projeto (o único que deve ser modificado)
assets\fonts --> fontes utilizadas pelo projeto
assets\img --> imagens utilizadas na montagem do site/projeto
assets\js --> js não angular customizados ou criados no projeto
```

Esta estruturação é utilizada por vários componentes de mercado, por exemplo, o Twitter Bootstrap utiliza estes caminhos de pastas em seus CSS, para obter imagens, fontes, etc.

###Foundation Structure

```
app --> componentes da aplicação SPA
app\app.js --> js com as configurações gerais da aplicação
app\common --> módulo de foundation técnico, contendo componentes gerais da app
app\common\env\common-env.js --> json com variaveis de ambiente gerais da app
app\common\i18n\resources_[en|pt|*].js --> json de resources para i18n
app\common\components --> componentes e recursos especializados para o projeto
app\common\components\[component] --> organizado por componente, contendo js, html…
app\common\components\[component]\[component].js
app\common\components\[component]\[component].html
app\common\components\header --> componente de tela para montagem do header
app\common\components\navigation --> componente de tela para montagem do menu
app\common\features\[submodule]\[feature] --> feature/telas globais de todo projeto
	Rota recomendada: /common/[submodule]/[feature]
app\common\features\auth --> telas globais relacionadas com autenticação
app\common\features\auth\signin --> telas de login
	Rota: /common/auth/signin
app\common\features\auth\signup --> telas de cadastro do usuário
	Rota: /common/auth/signup
```

###Module Structure

```
app\[module]
app\[module]\[module]-app.js --> js para configuração do módulo
app\[module]\env\[module]-env.js --> json com variaveis de ambiente do módulo
app\[module]\i18n\resources_[en|pt|*].js --> json de resources para i18n
app\[module]\components\[component]\ --> componentes especializados no módulo
app\[module]\components\[component]\[component].js
app\[module]\components\[component]\[component].html
app\[module]\features\[submodule*]\[feature] --> feature/telas do módulo
	Rota recomendada: /[module]/[submodule]/[feature]
app\[module]\features\[submodule*]\[feature]\[feature]-ctrl.js --> controller
app\[module]\features\[submodule*]\[feature]\[feature]-service.js --> service
app\[module]\features\[submodule*]\[feature]\[feature]-directive.js --> directive
app\[module]\features\[submodule*]\[feature]\[feature]-filter.js --> filter
app\[module]\features\[submodule*]\[feature]\[feature].html --> página
app\[module]\features\[submodule*]\[feature]\[feature]\view\*.html --> se mais que 1 html
```

Nesta organização, propõem-se separar componentes reutilizáveis de telas funcionais. Entende-se por componentes aqueles recursos de tela (fragmentos) ou mecanismos reutilizáveis, em AngularJs seriam as directives, filters, interceptors… Já features seriam as telas funcionais, onde teremos o html que compõe toda tela e seu controlador (e/ou demais recursos específicos da tela).

Recomenda-se que arquivos e pastas sempre em minúsculo. Para scripts .js utilizar sempre o sufixo que indique seu tipo, ex: myprofile-ctrl.js, myprofile-service.js, myprofile-directive.js, etc.

Para componentes escritos em AngularJs, é recomendado que o nome possua a concatenação do módulo e submódulo, como um package/namespace, para evitar sobreposição de nomes de componentes em distintos módulos.

##Patterns and Restrictions

###General
1. Sempre codificar os scripts para suportar requirejs, module do nodejs ou inclusão diretamente no index.html. Ex.:
```javascript
(function (factory) {
    if (typeof define === 'function') {
        define(['myDep', ...], factory);
    } else {
        if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
            module.exports = 'COMPONENT_NAME';
            require('myDep');
        }
        return factory();
    }
}(function() {
    … código do componente
}));
```

1. Se preferir, utilize o mecanismo disponúvel no componente [ng-jedi-factory](https://github.com/jediproject/ng-jedi-factory), que realiza a abstração desta implementação acima para codificação de controllers, services, filters, directives, modais, etc.

1. Sempre incluir dependências externas utilizando [bower](http://bower.io/} e configura-la no main.js, no block shim, caso a mesma não esteja codificada para suportar requirejs.
```shell
bower install [nome_dep] --save && grunt
```

1. Recursos ligados a uma funcionalidade devem ser criados na estrutura de pastas da funcionalidade
```javascript
app\[module]\features\[submodule*]\[feature]\[recursos da feature]
```

1. Componentes devem ser criados na estrutura abaixo e não devem ser funcionalidades completas, mas sim recursos reutilizáveis em funcionalidades/telas
```javascript
app\[module]\components\[component]\[recursos do componente]
```

1. Scripts de terceiros não devem ser alterados, em vez disso tente criar uma versão nova e publicar no bower, no pior caso customize e versione na pasta **assets\js\**

1. Valores hardcode que representam diretórios ou informações que podem ser alteradas de acordo com o ambiente, devem ser codificados no **[*module*]-env.js** do módulo específico. No componente [ng-jedi-factory](https://github.com/jediproject/ng-jedi-factory) este json é carregado na variável envSettings, e a constante pode ser acessada assim:
```javascript
envSettings[.module].[variable]
```

1. Caso haja requisitos de internacionalização, utilizar o mecanismo [ng-jedi-i18n](https://github.com/jediproject/ng-jedi-i18n), incluindo em todos os textos dos htmls a diretiva [jd-i18n](https://github.com/jediproject/ng-jedi-i18n#translate), para possibilitar a internacionalização posterior.

1. Métodos, classes, variáveis, etc... sempre escritos em inglês.

1. Parâmetros de métodos, métodos e variáveis sempre no formato camelCase.

1. Nome do recurso (controller, modal, service, etc.) sempre no formato PascalCase.

1. Todos os componentes/recursos devem ter o namespace no padrão:
```javascript
app.[module].[submodule].[feature*].[component] 
//e.g.: app.security.auth.userprofile.UserProfileCtrl
```

1. Sempre usar a declaração **'use strict';** ao início de todo arquivo .js

1. Nomes de pastas e arquivos devem ser em minúsculo.

1. Todos os componentes angular devem ter dependencias injetadas pelo nome, evitar declarar apenas no construtor do componente, uma vez que a minificação encurtará os nomes dos parâmetros.

1. Fazer uso de logs atravez do componente [$log](https://docs.angularjs.org/api/ng/service/$log) em vez do console.log

1. Não usar a function “alert” nativa do js, em vez disso usar o componente [toastr](https://github.com/Foxandxss/angular-toastr) ou [ng-jedi-dialogs](https://github.com/jediproject/ng-jedi-dialogs), ex.: 
```javascript
toastr.success(“Mensagem”); 
AlertHelper.addInfo(“Mensagem”);
```

1. Todo script envolvendo implementação angular deve ser carregado pelo [module]-app.js de seu módulo

1. Tratamento de exceções em chamadas às APIs deverá ser realizado por meio de interceptors disponíveis no componente [$httpProvider.interceptors](https://docs.angularjs.org/api/ng/service/$http#interceptors). Exceções envolvendo falhar de javascript, utilizar [$exceptionHandler](https://docs.angularjs.org/api/ng/service/$exceptionHandler).

###Controllers

1. Nomenclatura:
  1. Pasta física: app\[**module**]\features\[**submodule\***]\[**feature**]\[**feature**]-ctrl.js
  1. Nome Controller: app.[**module**].[**submodule\***].[**feature**].[**feature**]Ctrl
  1. Model: [**feature**]Model
  
1. No corpo do controle deve-se seguir a seguinte ordem de declaração:

  - Declaração dos serviços
```javascript
 var service = SecurityRestService.all('admin/feature');
 ```
  - Declaração do vm
```javascript
 var vm = this;
```

  - Declaração do model e demais variáveis de controle
```javascript
 vm.featureModel = { name: null };
vm.pageSize = 0;
```

  - Bind dos métodos
```javascript
 vm.filter = filter;
vm.remove = remove;
vm.clear = clear;
```

  - Execuções de métodos, carregamentos de dados ou qualquer execução na inicialização da tela
```javascript
 loadSystems(function (systems) {
        vm.featureRegistrationModel.systems = systems;
});
```

  - Declaração dos métodos e seu statement
```javascript
 function loadSystems(success) {
        console.log('Recuperando systems');
        SecurityRestService.all('admin/system').getList().then(success);
}
```

1. Não deve haver regra de negócio nos controllers, o mesmo deverá estar presente no escopo das APIs apenas.
1. Não chamar APIs diretamente nos controllers, em vez disso consumí-los pela camada de serviço.
1. Serviços não devem ser expostos no vm nem em nenhum outro atributo, devem sempre passar por métodos do controller.
1. Todos os atributos da tela relacionados ao modelo devem ser declarados no vm.[feature]Model, ex:
```javascript
vm.featureModel = { name: null };
```
1. Atributos de controle deverão ser declarados na raiz do vm, ex:
```javascript
vm.pageSize = 10;
```

###Services

1. Nomenclatura:
  - Pasta física: app\[**module**]\features\[**submodule\***]\[**feature**]\[**feature**]-service.js
  - Nome Controller: app.[**module**].[**submodule\***].[**feature**].[**feature**]Service
1. Opte por service (caso seja serviços simples) ou provider (caso seja serviço que exija algum tipo de configuração prévia).
1. Caso o serviço seja apenas para abstrair o acesso às APIs, opte por [$resources](https://docs.angularjs.org/api/ngResource/service/%24resource)ou [Restangular](https://github.com/mgonto/restangular), ambos abstraem as operações de CRUD nas instancias dos objetos json. Com Restangular pode-se inclusive chama-lo diretamente no controller em vez de criar uma camada adicional, no componente [ng-jedi-factory](https://github.com/jediproject/ng-jedi-factory) esta é a abordagem utilizada, podendo-se injetar um Restangular service com os apontamentos de URL pre-configurados.
1. São componentes singleton, portanto evite variáveis de negócio que possam se sobrepor em fluxos paralelos.

###Views

1. Nomenclatura:
  - Pasta física: app\[**module**]\features\[**submodule\***]\[**feature**]\
  - Nome página: [**feature**].html
1. Sempre construído com html puro, com estrutura e css preferencialmente utilizando [Twitter Bootstrap](http://getbootstrap.com/), sem javascript e usando apenas diretivas angular
1. ng-repeat deve sempre ser declarado com [track by](http://www.bennadel.com/blog/2556-using-track-by-with-ngrepeat-in-angularjs-1-2.htm), para evitar problemas de performance
1. Se preferir, usar a diretiva [jd-input](https://github.com/jediproject/ng-jedi-layout#jdinput) em todos os campos, para mantê-los todos no mesmo padrão visual e ganhar produtividade escrevendo menos html
1. Se preferir, usar por padrão grids com a diretiva jd-table com paginação via api
1. Na declaração do controller da tela, usar alias em formato camelCase para o nome, ex:
```javascript
ng-controller="app.framework.imports.importfiles.ImportFilesCtrl as importFilesCtrl"
```
1. Não declarar styles nos elementos html, usar classes css do projeto
1. Se necessário aplicar internalizalização, opte por usar a diretiva jd-i18n em todos os textos do html
  - <jd-i18n>Texto qualquer<jd-i18n>
  - ou <a jd-i18n>Texto qualquer<\a>
1. Css devem ser codificados/customizados apenas no arquivo **assets\css\app.css** , demais são de terceiros. Utilizar processador [SASS](http://sass-lang.com/) para geração deste css customizado.
1. Navegação entre páginas deverá ser feito utilizando componente [ngRoute](https://docs.angularjs.org/api/ngRoute)

###Directives

1. Diretivas sempre declaradas com o nome do módulo e submódulo, para evitar duplicidade e sobreposição em caso de projetos grandes e distribuídos
2. Nomenclatura:
  - Se geral para o módulo
    - Arquivo: app\[**module**]\components\[**component**]\[**component**]-directive.js
    - Nome diretiva: app-[**module**]-[**component**]-[**diretiva**]
  - Se for de uma feature
    - Arquivo: app\[**module**]\features\[**submodule\***]\[**feature**]\[**feature**]-directives.js
    - Nome diretiva: app-[**module**]-[**submodule\***]-[**feature**]-[**diretiva**]
1. Caso utilize algum plugin [jQuery](https://jquery.com/) para renderizar elementos ou adicionar eventos, sempre realize tratamento dos eventos de destroy do escopo e dos elementos, para remover elementos e eventos adicionados pelo jQuery e não controlados pelo AngularJs.

###Filters

1. Filters sempre declaradas com o nome do módulo e submódulo, para evitar duplicidade e sobreposição em caso de projetos grandes e distribuídos
1. Nomenclatura:
  - Se geral para o módulo
    - Arquivo: app\[**module**]\components\[**component**]\[**component**]-filter.js
    - Nome diretiva: app[**Module**][**Component**][**Filter**]
  - Se for de uma feature
    - Arquivo: app\[**module**]\features\[**feature**]\[**feature**]-filters.js
    - Nome diretiva: app[**Module**][**Submodule\***][**Feature**][**Filter**]
1. Evitar filters aninhados pois pode acarretar em problemas de performance.

##Recommended Tools

###Dependency Management - Bower vs NPM

1. [NPM](https://www.npmjs.com/) é utilizado para o gerenciamento de módulos em Node.js, destinado a gestão de ferramentas utilizadas como suporte e automação do desenvolvimento(builds, geração de código, tasks e afins). Assim como é capaz de gerenciar componentes de front-end quando utilizado em conjunto com o [Browserify](http://browserify.org/), porém esta prática não é recomendada por englobar libs web + backend NodeJS juntos.
  - Um ponto importante ao se utilizar o npm é que os arquivos da pasta **node\_modules** não devem ser versionados, apenas o arquivo **package.json**.
1. [Bower](http://bower.io/) por sua vez foi criado especialmente para o gerenciamento de pacotes de front-end, sendo otimizado para este propósito. Portanto é o mais recomendado quando se trata de projetos web.
  - Um ponto importante ao se utilizar o bower é que os arquivos da pasta **bower\_components** não devem ser versionados, apenas o arquivo **bower.json**.

###Build e Deploy

Como ferramenta de Task Runners, usados para automatizar processos de build e deploy, recomendamos usar Grunt, por ser bem difundido e possuir muitos plugins para resolver vários problemas envolvendo automatização.

Para o processo de Build, considere como fundamental a utilização dos seguintes pontos:

- Cópia de arquivos entre diretórios, ex: cópia dos arquivos da pasta bower\_components para a pasta assets/, ou mesmo para gerar uma pasta de build, contendo apenas arquivos que serão implantados
  - ○○use o plugin [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy)
- Geração dos arquivos de configuração por ambiente, ex.: [module]-env.json
  - ○○use o plugin [grunt-replace](https://www.npmjs.com/package/grunt-replace)
- Verificar sintaxe e eventuais erros nos arquivos javascripts
  - ○○use o plugin [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)
- Minificação/compressão de arquivos JS, CSS, HTML e imagens
  - ○○para JS, use o plugin [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)
  - ○○para CSS, use o plugin [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin)
  - ○○para HTML, use o plugin [grunt-contrib-htmlmin](https://github.com/gruntjs/grunt-contrib-htmlmin)
  - ○○para imagens, use o plugin [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)
- Renomear arquivos de implantação para evitar cache pelo browser de versões antigas
  - ○○use o plugin [grunt-filerev](https://github.com/yeoman/grunt-filerev)
  - ○○no demo e gerador jedi é utilizado este plugin juntamente com outros passos para gerar um arquivo de-para entre o arquivo original e o arquivo com a hash concatenada, que servirá para uso integrado ao requirejs, no mapeamento de rotas onde o controlador é carregado dinamicamente. No componente [ng-jedi-factory](https://github.com/jediproject/ng-jedi-factory) o método getFileVersion pode ser usado para esta finalidade durante execução da aplicação.
- Execução de testes automatizados, tanto protractor quanto karma possuem plugins em grunt para sua execução.
- Geração dos CSS a partir do processador SASS
  - ○○use o plugin [grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass)
- "Concatenação" de imagens em uma única imagem com classes css posicionando em cada imagem, estratégia conhecida como Compass Sprites
  - ○○usar o plugin [grunt-contrib-compass](https://github.com/gruntjs/grunt-contrib-compass)

Para auxílo no deploy, existem plugins que podem ser utilizados, como o próprio [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy), mas vai depender de qual é o servidor web e como será a transferência do código para ele. Existem plugins para conexão ftp, post de arquivos via http, dentre outros.

Em ambiente de desenvolvimento, recomenda-se utilizar o módulo NodeJs http-server, que sobe rapidamente um servidor web de arquivos estáticos, existe plugins dele para execução integrada via grunt. Caso seja utilizado processador SASS, Compass Sprites e/ou outra task que necessite rodar após qualquer alteração em código e antes do acesso via browser, para testes de desenvolvimento, se quiser que tais tasks sejam executadas automaticamente após a modificação faça uso do plugin [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).

###Automated Tests

Existem duas ferramentas de testes que são recomendadas pela documentação do AngularJs (escritos em Node.js). São elas:

1. [Karma](http://karma-runner.github.io/0.13/index.html): test runner para testes unitários, fazendo uso das ferramentas [mocha](https://mochajs.org/) (test framework), [chai](http://chaijs.com/) (assertion library) e [jasmine](http://jasmine.github.io/) para a escrita dos testes.
1. [Protractor](https://angular.github.io/protractor/): framework para a escrita de testes end-to-end (e2e).

Ambas instanciam o navegador, carregam os arquivos previamente configurados, executam os testes e retornam seu resultado.

###Code Generation

É recomendado que se utilize geradores de código sempre que possível, para reduzir consideravelmente o tempo gasto com escrita de código repetitivo, incluindo:

- Cruds padronizados.
- Mecanismos recorrentes.
- v0 do projeto.

[Yeoman](http://yeoman.io/) é um projeto da comunidade que reúne um conjunto de geradores e é extremamente recomendado.

- Utiliza de outras ferramentas no seu workflow como [Grunt](http://gruntjs.com/) e [Gump](https://www.npmjs.com/package/gump) para build, [bower](http://bower.io/) e [npm](https://www.npmjs.com/) para gerenciamento de pacotes.
- É possível utilizar geradores criados por terceiros ou criar o seu.

###Mocks

Mocks de API são bastante úteis quando o time de front-end não quer depender ou aguardar a finalização da API/back-end para construção das views.

Utilize o [json-server](https://github.com/typicode/json-server) para fazer mocks de serviços REST, ele possui suporte a routes, filters, slice, sort, range, full text search e relationships.

Para gerar as mocks com o json-server de forma bem rápida, pode-se utilizar o [json-server-init](https://www.npmjs.com/package/json-server-init), que possui um wizard bem facilitado.

Quando for necessário criar retornos diferenciados, a partir dos dados de entrada, uma boa alternativa é usar o [apimocker](https://github.com/gstroup/apimocker).

###Debugging

Recomenda-se não minificar, ofuscar ou agrupar os arquivos javascript, css e html para build de desenvolvimento, facilitando o debug da aplicação.

Ferramentas como Google Chrome e Firebug (para Firefox) são recomendadas para realização de debugging, elas permitem depuração e manipulação de javascript e css, além de recursos para Network Debugging.

Além dessas ferramentas é recomendado o uso do [AngularJS Batarang](https://github.com/angular/batarang) para depurar scope e watch no contexto do angular.

##Components

Stack utilizada pelo [demo](https://github.com/jediproject/ng-jedi-demo) e [gerador](https://github.com/jediproject/generator-jedi) Jedi:

- [AngularJs 1.4.4](https://docs.angularjs.org)
- [Requirejs](http://requirejs.org/) - lazy load scripts
- [AngularAMD](https://github.com/marcoslin/angularAMD) - integrador AngularJs+requirejs
- [Restangular](https://github.com/mgonto/restangular) - usado para abstrair camada service
- [Twitter Bootstrap](http://getbootstrap.com/) - componentes bootstrap integrados ao AngularJs
- [lodash](https://lodash.com/) - mecanismo para auxílio na manipulação de arrays, strings, etc.
- [angular-loading-bar](http://chieffancypants.github.io/angular-loading-bar/) - componente para exibição de barras de progresso
- [angular-file-upload](https://github.com/nervgh/angular-file-upload) - mecanismo para realização de upload de arquivos
- [angular-ngMask](https://github.com/candreoliveira/ngMask) - componente de máscara
- [angular-toastr](https://github.com/Foxandxss/angular-toastr) - lib para apresentar mensagens no formato toastr
- [file-saver-saveas-js](https://github.com/eligrey/FileSaver.js/) - lib para salvar arquivos (download)
- [moment](http://momentjs.com/) - manipulação de datas
- [eonasdan-bootstrap-datetimepicker](https://github.com/Eonasdan/bootstrap-datetimepicker) - componente para datetimepicker com bootstrap
- [ng-currency-mask](https://github.com/VictorQueiroz/ngCurrencyMask) - componente de máscara para valores decimais
- [angular-dynamic-locale](https://github.com/lgalfaso/angular-dynamic-locale) - mecanismo para carregamento dinâmico do ngLocale
- [Protractor](https://angular.github.io/protractor/) - mecanismo para testes de tela
- [Karma](http://karma-runner.github.io/0.13/index.html) - mecanismo para testes unitários
- [Bower](http://bower.io/) - tool para versionamentos de libs
- [npm](https://www.npmjs.com/) - tool para versionamentos de libs
- [Grunt](http://gruntjs.com/) - tool para execução de builds
- [apimocker](https://github.com/gstroup/apimocker) - tool para mocks estáticas
- [json-server](https://github.com/typicode/json-server) - tool para mocks de CRUDs
- [http-server](https://www.npmjs.com/package/http-server) - servidor web para sites estáticos
- [Yeoman](http://yeoman.io/) - ferramenta para geração de código

Atualmente o Jedi Project conta com os seguintes componentes:

- [ng-jedi-activities](https://github.com/jediproject/ng-jedi-activities): gerencia atividades em 2º plano (ex: download)
- [ng-jedi-dialogs](https://github.com/jediproject/ng-jedi-dialogs): componente para apresentação de alertas e modais customizadas
- [ng-jedi-table](https://github.com/jediproject/ng-jedi-table): grid paginado em memória ou via API
- [ng-jedi-security](https://github.com/jediproject/ng-jedi-security): módulo de autenticação/autorização via token
- [ng-jedi-factory](https://github.com/jediproject/ng-jedi-factory): facilitador na criação de componentes em AngularJs (controllers, services. directives, filters…), carregamento de módulos dinamicamente e tratamento de versão dos arquivos estáticos, integrado ao grunt-filerev
- [ng-jedi-utilities](https://github.com/jediproject/ng-jedi-utilities): dunções, diretivas e filtros úteis e reutilizáveis (ex: validação de CPF, CNPJ, tratamentos para CORS, máscaras padrões, etc)
- [ng-jedi-loading](https://github.com/jediproject/ng-jedi-loading): barra de progresso ou loading exibidas através de interceptor de requisições http
- [ng-jedi-breadcrumb](https://github.com/jediproject/ng-jedi-breadcrumb): componente para apresentar a navegação estruturada em formato breadcrumb
- [ng-jedi-i18n](https://github.com/jediproject/ng-jedi-i18n): componente de internacionalização
- [ng-jedi-layout](https://github.com/jediproject/ng-jedi-layout): componentes de tela prontos para uso com uma simples diretiva (Input, Datepicker, Modais, TreeView, Tooltip, Panel, etc)