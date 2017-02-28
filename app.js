(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
        .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'dirCtrl',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var ctrl = this;
        var items = ctrl.items;
        console.log('numbers of items: ' + items);
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.inputTxt = "";
        ctrl.noItem = false;

        ctrl.getItems = function () {
            ctrl.noItem = false;
            var input = ctrl.inputTxt;
            var promise = MenuSearchService.getMatchedMenuItems(input);
            promise.then(function (response) {
                ctrl.found = response;
                if (typeof(ctrl.found) === 'undefined' || ctrl.found.length === 0) {
                    console.log("no found results");
                    ctrl.noItem = true;
                }
            })
            .catch(function (error) {
                console.log("something was wrong.");
            });
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
            if (ctrl.found.length === 0) {
                console.log("delete all items");
                ctrl.noItem = true;
            }
        };

    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        var menuItems;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {
                // process result and only keep items that match
                menuItems = result.data.menu_items;

                if (searchTerm !== "") {
                    var foundItems = menuItems.filter(function (val) {
                        return val.description.indexOf(searchTerm) > -1;
                    });

                    return foundItems;
                }

            });
        };
    }

})();

