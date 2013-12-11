function SoundController($scope, $interval, $timeout, $http) {
    $scope.isConnected = function (type, selector) {
        return findLink(type, selector) != null
    };
    $scope.$watch(function () {
        return window.showDialog;
    }, function (val) {
        $scope.showDialog = val;

        $scope.nodeType = "";
    });
    $scope.$watch(function () {
        return window.showSave;
    }, function (val) {
        if (val)$http.get("/saves").success(function (data) {
            $scope.saves = data;
        });
        $scope.showSave = val;
    });
    $scope.$watch(function () {
        return window.showLoad;
    }, function (val) {
        if (val)$http.get("/saves").success(function (data) {
            $scope.saves = data;
        });
        $scope.showLoad = val;
    });
    $scope.$watch("loadName", function (val) {
        if (val != undefined && val != "") {
            $http.get("/saves/" + $scope.loadName).success(function (data) {
                positions = nodeHandlerInstance.import(data);
                $scope.links = nodeHandlerInstance.getLinks();
                $scope.nodes = nodeHandlerInstance.getNodes();
                $scope.refreshLines();
            });
            window.showLoad = false;
        }
    });
    $scope.$watch("nodeType", function (val) {
        if (val != undefined && val != "") {
            nodeHandlerInstance.addNode(val);
            window.showDialog = false;
        }
    });
    function findLink(type, selector) {
        var out = null;
        $scope.links.forEach(function (elem) {
            if (out != null)return;
            if (type == "input") {
                if (elem.end[0] == selector[0] && elem.end[1] == selector[1])out = elem;

            } else {
                if (elem.start[0] == selector[0] && elem.start[1] == selector[1])out = elem;
            }
        });
        return out;
    };

    $scope.addStart = null;
    $scope.target = "";
    $scope.type = "";

    $scope.removeLink = function (type, selector) {
        $scope.addStart = null;
        var elem = findLink(type, selector);
        if (elem != null) {
            nodeHandlerInstance.disconnect(elem);
            $scope.refreshLines();
        }
    };
    $scope.isValid = function (type, selector, valueType) {

        if ($scope.addStart == null)return false;
        if ($scope.type != valueType)return false;
        if ($scope.isConnected(type, selector)) return false;
        var elem = $scope.addStart;
        if ($scope.target == "input") {
            if (elem.end[0] == selector[0])return false;

        } else {
            if (elem.start[0] == selector[0])return false;
        }
        return ($scope.target != type);
    };
    $scope.isStart = function (type, selector) {
        if ($scope.addStart == null)return false;
        var elem = $scope.addStart;
        if ($scope.target != type)return false;
        if ($scope.target == "input") {
            if (elem.end[0] == selector[0] && elem.end[1] == selector[1])return true;
        } else {
            if (elem.start[0] == selector[0] && elem.start[1] == selector[1])return true;
        }
        return false;
    };
    $scope.addLink = function (type, selector, valueType) {
        if ($scope.addStart == null) {
            if ($scope.isConnected(type, selector))return;
            if (type == "input") {
                $scope.addStart = {end: selector};
            } else {
                $scope.addStart = {start: selector};
            }
            $scope.type = valueType;
            $scope.target = type;
        } else {
            if (type == $scope.target)return;
            if ($scope.isConnected(type, selector)) {
                $scope.addStart = null;
            } else if ($scope.type != valueType) {
                $scope.addStart = null;
                return;
            } else {
                if (type == "input") {
                    if ($scope.addStart["start"][0] == selector[0]) {
                        $scope.addStart = null;
                        return;
                    }
                    $scope.addStart["end"] = selector;
                } else {
                    if ($scope.addStart["end"][0] == selector[0]) {
                        $scope.addStart = null;
                        return;
                    }
                    $scope.addStart["start"] = selector;
                }
                nodeHandlerInstance.connect($scope.addStart.start, $scope.addStart.end);
                $scope.refreshLines();
                $scope.addStart = null;
            }
        }
    };
    $interval(function () {
        if ($scope.dragging)$().lineHelper.drawLines($scope.links);
        if (positions != null) {
            $.each(positions, function (selector, offset) {
                $(selector).offset(offset);
            });
            positions = null;
        }
    }, 50);
    var nodeHandlerInstance = new NodeHandler($scope, $interval);
    $scope.links = nodeHandlerInstance.getLinks();
    $scope.nodes = nodeHandlerInstance.getNodes();
    $scope.nodeTypes = nodeHandlerInstance.getNodeTypes();

    $scope.selectedNodeType = $scope.nodeTypes[0];
    $scope.addNode = function () {
        nodeHandlerInstance.addNode($scope.selectedNodeType);
    };
    var positions = null;
    $scope.removeNode = function (node) {
        nodeHandlerInstance.removeNode(node);
        $scope.refreshLines();
    }
    $scope.refreshLines = function () {
        $timeout(function () {
            $().lineHelper.drawLines($scope.links);
        }, 100);
    };
    $scope.save = function () {
        $.post("/saves", {name: $scope.saveName, data: nodeHandlerInstance.export()});
        window.showSave = false;
    };
}