function keyUp(e) {
    const c = lab.control

    switch(e.key) {
    case 'ArrowUp': c.stop(c.UP); break;
    case 'ArrowLeft': c.stop(c.LEFT); break;
    case 'ArrowDown': c.stop(c.DOWN); break;
    case 'ArrowRight': c.stop(c.RIGHT); break;
    }
}
