window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.90;
    canvas.height = window.innerHeight * 0.70;

    // clearn canvas on reset button click
    const reset_btn = document.querySelector("#reset-btn");
    reset_btn.onclick = resetCanvas;

    // resizing canvas to the display size
    resizeCanvasToDisplaySize(canvas);

    let painting = false;

    function paint() {
        painting = true;
    }

    function stopPaint() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        // checks whether we're drawing or not
        if (!painting) {
            return;
        }

        // get mouse pointer position
        let pos = getMousePosition(canvas, e);

        const line_width = document.querySelector("#line-width");
        const color_picker = document.querySelector("#color-picker");

        ctx.lineCap = "round";

        ctx.lineWidth = line_width.value;
        line_width.oninput = function () {
            ctx.lineWidth = this.value;
        };

        ctx.strokeStyle = color_picker.value;

        color_picker.oninput = function () {
            ctx.strokeStyle = this.value;
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    // event listeners for desktop
    canvas.addEventListener("mousedown", paint);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopPaint);

    // event listeners for touchscreen devices
    canvas.addEventListener("touchstart",
        (e) => {
            preventScrollBehavior(e)
            let touch = e.touches[0];
            let mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
            // paint();
        }, false);
    canvas.addEventListener("touchmove",
        (e) => {
            preventScrollBehavior(e)
            let touch = e.touches[0];
            let mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
            // draw(e);
        }, false);
    canvas.addEventListener("touchend",
        (e) => {
            preventScrollBehavior(e)
            let touch = e.touches[0];
            let mouseEvent = new MouseEvent("mouseup", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
            // stopPaint();
        }, false);
});

// prevents default event action
function preventScrollBehavior(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}

// resets canvas on button click
function resetCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// resizes canvas when window size is changed
function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

// gets mouse pointer position by caluclating the 
// relation between canvas bitmap and canvas element dimensions
function getMousePosition(canvas, e) {
    // absolute size of the canvas element
    let rect = canvas.getBoundingClientRect();
    // relationship between bitmap and element for X
    let scaleX = canvas.width / rect.width;
    // relationship between bitmap and element for Y
    let scaleY = canvas.height / rect.height;

    return {
        // scale mouse coordinates after they have
        // been adjusted to be relative to element
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    }
}