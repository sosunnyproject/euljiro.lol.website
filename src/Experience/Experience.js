import Sizes from "./Utils/Sizes";

export default class Experience {
    constructor(canvas) {
        console.log("start threejs canvas experience");
        window.experience = this;
        this.canvas = canvas;
        this.sizes = new Sizes();

        console.log(this.sizes);
        // resize event
        this.sizes.on('resize', () => {
            console.log('A resize occured');
            this.resize();
        })
    }

    resize() {

    }
}