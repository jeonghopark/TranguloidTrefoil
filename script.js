var scene, camera, renderer, controls;
var stats;
var wireMeshS = new Array();
var objectS = new Array();;

var parameters;

init();
animate();


//-----------------------------------------------------------------------------
function init() {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    parameters = {
        Speed: 0.5,
        RotationY: 45,
        RotationZ: 25
    }

    var clock = new THREE.Clock();
    clock.start();

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xFFEAB0 );
    // scene.fog = new THREE.FogExp2( 0xcccccc, 0.01 ); 

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 300;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.domElement.style.position = "relative";
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    renderer.setClearColor(0x000000, 0.0);

    stats = new Stats();

    var _container = document.getElementById('container');
    document.body.appendChild(renderer.domElement);
    _container.appendChild(stats.dom);

    lightSetting();
    controlsSetting();

    geoMeshSetting();

    guiSetting();

}



//-----------------------------------------------------------------------------
function geoMeshSetting() {
    var _wireMatE = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0.3,
        wireframe: true,
        transparent: true,
        overdraw: true
    });

    var _norMatS = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0.85,
        transparent: true,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide
    });

    var _pointMat = new THREE.PointsMaterial({
        // color: 0x00ff00,
        vertexColors: THREE.VertexColors,
        size: 1
    });

    scene.remove(objectS);
    var _geomS = geom(30);
    objectS = new THREE.Points(_geomS, _pointMat);
    wireMeshS = new THREE.Mesh(_geomS, _wireMatE);
    scene.add(objectS);
    // scene.add(wireMeshS[i]);

}


//-----------------------------------------------------------------------------
function geoMeshUpdate() {
    var _delta = Math.PI * counter() * 1.0 / 180.0;
    objectS.rotation.x = Math.PI / 180 * 30;
    objectS.rotation.y = _delta;
    objectS.rotation.z = _delta;
    wireMeshS.rotation.x = Math.PI / 180 * 30;
    wireMeshS.rotation.y = _delta;
    wireMeshS.rotation.z = Math.PI / 180 * 45;
}


//-----------------------------------------------------------------------------
function geom(_size) {
    this._geom = new THREE.Geometry();
    this._step = 2;
    this._size = _size;
    for (var i = 0; i < 360; i += _step) {
        for (var j = 0; j < 360; j += _step) {
            u = Math.PI / 180 * i - Math.PI / 180;
            v = Math.PI / 180 * j - Math.PI / 180;
            var xUp = 2 * Math.sin(3 * u) / (2 + Math.cos(v)) * _size;
            var yUp = 2 * (Math.sin(u) + 2 * Math.sin(2 * u)) / (2 + Math.cos(v + 2 * Math.PI / 3)) * _size;
            var zUp = (Math.cos(u) - 2 * Math.cos(2 * u)) * (2 + Math.cos(v)) * (2 + Math.cos(v + 2 * Math.PI / 3)) / 4 * _size;
            var _v1 = new THREE.Vector3(xUp, yUp, zUp);
            _geom.vertices.push(_v1);
        }
    }

    for (var i = 0; i < _geom.vertices.length; i++) {
        var _color = new THREE.Color(0x00ff00);
        _color.setHSL(i / _geom.vertices.length, 1, 0.5);
        _geom.colors[i] = _color;
    }

    return _geom
}


//-----------------------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update();
    stats.update();
}



//-----------------------------------------------------------------------------
function render() {
    geoMeshUpdate();
    renderer.render(scene, camera);
}


//-----------------------------------------------------------------------------
function counter() {
    counter.count = counter.count + (1.0 * parameters.Speed) || 1;
    return counter.count;
}


//-----------------------------------------------------------------------------
function lightSetting() {
    var light = new THREE.PointLight(0xffffff, 1, 50);
    var _vLight = new THREE.Vector3(0, 2, 15);
    light.position.set(_vLight.x, _vLight.y, _vLight.z);
    light.intensity = 1;

    var lightIn = new THREE.PointLight(0xFEF8D1, 1, 10);
    var _vLightIn = new THREE.Vector3(0, 2, 15);
    lightIn.position.set(_vLightIn.x, _vLightIn.y, _vLightIn.z);
    lightIn.intensity = 1;

    scene.add(light);
    scene.add(lightIn);
    scene.add(new THREE.AmbientLight(0x333355));
}


//-----------------------------------------------------------------------------
function controlsSetting() {
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
}


//-----------------------------------------------------------------------------
function guiSetting() {
    var gui = new dat.GUI();

    gui.add(parameters, 'Speed').min(0.0).max(1.0).step(0.1).listen();

    // var _stripWidth = gui.add(parameters, 'StripWidth').min(0.2).max(3.0).step(0.1).listen();
    // _stripWidth.onChange(function() {
    //     geoMeshSetting();
    // });
}
