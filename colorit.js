
    var canvas = document.getElementById("colorit"), context = canvas.getContext("2d");

    function drawIt(image) {
        var width = image.naturalWidth,
            height = image.naturalHeight,
            drawWidth = width, drawHeight = height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        width = (width === 0) ? 600 : width;
        height = (height === 0) ? 600 : height;

        if (height >= width) {
            drawHeight = 550;
            drawWidth = (width / height) * 550;
        } else {
            drawWidth = 650;
            drawHeight = (height / width) * 650;
        }
        context.drawImage(image, (700 - drawWidth) / 2, (600 - drawHeight) / 2, drawWidth, drawHeight);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text"),
            image = document.getElementById(data);
        drawIt(image);
    }
    var image = new Image();
    image.src = "https://1.bp.blogspot.com/-hphGL6Hj2Rw/WS1GppLacWI/AAAAAAAACN0/jqSGuQWT9A87FJClBMRseb0ZsA57_lkSgCLcB/s1600/elephant.gif";
    image.onload = function () {
        drawIt(image);
    };

    document.getElementById("addImage").addEventListener("click", function () {
        var url = prompt("Add Image URL : ");
        var image = new Image();
        image.src = url;
        image.onload = function () {
            drawIt(image);
        };
    }, false);

    var brushSize = document.getElementById("brush-size");
    var range = document.getElementById("myRange");
    var color = "#000000";
    range.addEventListener("input", function () {
        brushSize.innerHTML = this.value;
    }, false);
    document.getElementById("myColor").addEventListener("change", function () {
        color = this.value;
    }, false);

    function Mouse(element) {
        var rect, view, offset;
        rect = element.getBoundingClientRect();
        view = element.ownerDocument.defaultView;
        offset = {
            top: rect.top + view.pageYOffset,
            left: rect.left + view.pageXOffset
        };
        this.position = function (event) {
            return {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };
        };
    };

    function Pencil(width, color) {
        this.lineWidth = width || 10;
        this.lineJoin = "round";
        this.points = [];
        this.strokeStyle = color || "black";
    }

    Pencil.prototype.constructor = Pencil;

    Pencil.prototype.start = function (point) {
        this.points.push({ point: point });
    };

    Pencil.prototype.end = function (point) {
        this.points.push({ point: point });
    };

    Pencil.prototype.draw = function (context) {
        var i, length;
        length = this.points.length;
        context.save();
        context.beginPath();
        context.lineWidth = this.lineWidth;
        context.lineJoin = this.lineJoin;
        context.lineCap = this.lineJoin;
        context.strokeStyle = this.strokeStyle;
        context.moveTo(this.points[0].point.x, this.points[0].point.y);
        for (i = 1; i < length; i = i + 1) {
            context.lineTo(this.points[i].point.x, this.points[i].point.y);
        }
        context.stroke();
        context.restore();
    };

    var pencil, mouse = new Mouse(canvas);
    function mouseMove(event) {
        event.preventDefault();
        pencil.end(mouse.position(event));
        pencil.draw(context);
    }
    function mouseup() {
        event.preventDefault();
        canvas.removeEventListener("mousemove", mouseMove, false);
        canvas.removeEventListener("mouseup", mouseup, false);
    }
    function mouseDown(event) {
        event.preventDefault();
        pencil = new Pencil(range.value, color);
        pencil.start(mouse.position(event));
        canvas.addEventListener("mousemove", mouseMove, false);
        canvas.addEventListener("mouseup", mouseup, false);
    }
    canvas.addEventListener("mousedown", mouseDown, false);
