$.fn.lineHelper = {
    paper: null,
    _readjustHTML5CanvasHeight: function () {
        var canvasDiv = $('#stageContainer');
        var svg = $('#stage2 svg');


        var body = $("body");
        var maxX = body.width();
        var maxY = body.height();
        $(".window").each(function (i, v) {
            var $this = $(v);
            var x = $this.offset().left + $this.width() + 100;
            var y = $this.offset().top + $this.height() + 100;
            if (x > maxX)maxX = x;
            if (y > maxY)maxY = y;
        });
        svg.width(maxX);
        svg.height(maxY);
        canvasDiv.width(maxX);
        canvasDiv.height(maxY);

        if (this.paper == null)this.paper = new Raphael("stage2", maxX, maxY);
        this.paper.width = maxX;
        this.paper.height = maxY;
        this.paper.clear();
    },
    _drawLineBetweenElements: function (sourceElement, targetElement) {
        var sourceParent = sourceElement.parents(".window");
        var targetParent = targetElement.parents(".window");
        var sourceX = 0;
        var sourceY = 0;
        if (sourceParent.hasClass("minimized")) {
            sourceX = sourceParent.offset().left + sourceParent.width() - 5;
            sourceY = sourceParent.offset().top + sourceParent.height() / 2;
        } else {
            sourceX = sourceElement.offset().left + sourceElement.width() / 2;
            sourceY = sourceElement.offset().top + sourceElement.height() / 2;
        }
        var targetX = 0;
        var targetY = 0;
        if (targetParent.hasClass("minimized")) {
            targetX = targetParent.offset().left + 5;
            targetY = targetParent.offset().top + targetParent.height() / 2;
        } else {
            targetX = targetElement.offset().left + targetElement.width() / 2;
            targetY = targetElement.offset().top + targetElement.height() / 2;
        }
        var path;
        if (sourceX > targetX) {
            path=this.paper.path([
                ["M", sourceX, sourceY],
                ["C",
                    sourceX + 300, sourceY-200,
                    targetX - 300, targetY-200,
                    targetX, targetY
                ]
            ]);
        } else {
            path=this.paper.path([
                ["M", sourceX, sourceY],
                ["C", sourceX + 100, sourceY, targetX - 100, targetY, targetX, targetY]
            ]);
        }
        DEBUG=path;
        path.node.setAttribute("class","line "+sourceElement.attr("type"));
    },


    drawLines: function (elements) {
        $().lineHelper._readjustHTML5CanvasHeight();

        $.each(elements, function (i, startEndPair) {
            var start = startEndPair.start;
            start = $("[data-selector='" + start.join("-output-") + "']");

            var end = startEndPair.end;
            end = $("[data-selector='" + end.join("-input-") + "']");

            $().lineHelper._drawLineBetweenElements(start, end);
        });
    }
};