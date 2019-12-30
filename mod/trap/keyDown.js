function keyDown(e) {

    if (!e.repeat) {
        const c = lab.control

        switch(e.key) {
        case 'ArrowUp': c.touch(c.UP); break;
        case 'ArrowLeft': c.touch(c.LEFT); break;
        case 'ArrowDown': c.touch(c.DOWN); break;
        case 'ArrowRight': c.touch(c.RIGHT); break;
        }
    }
}
