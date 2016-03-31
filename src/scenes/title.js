(function (root) {
    'use strict';

    var TitleScene = function () {
        Arcadia.Scene.apply(this, arguments);

        this.color = 'black';
        this.add(new Arcadia.Label({
            text: 'YAJ↓RUSH↑',
            font: '40px monospace',
            color: 'rgba(255, 255, 255, 0.8)'
        }))
    }

    TitleScene.prototype.onKeyDown = function(key) {
        Arcadia.changeScene(Game);
    };

    TitleScene.prototype.onPointStart = function(points) {
        Arcadia.changeScene(Game);
    };

    root.TitleScene = TitleScene;
}(window));


/*
@description Title scene
 */
