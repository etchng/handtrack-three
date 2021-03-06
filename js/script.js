
// Setting scene for 3D Object
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
var vector = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creating 3D object
var geometry = new THREE.BoxGeometry(1, 2, 1);
var material = new THREE.MeshNormalMaterial({
    // color: "rgb(3, 197, 221)",
    // wireframe: true,
    // wireframeLinewidth: 1
});

var cube = new THREE.Mesh(geometry, material);

scene.add(cube);
camera.position.z = 5;



// Optional animation to rotate the element
var animate = function () {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};


animate();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Creating Canavs for video Input
const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1;
let isVideo = false;
let model = null;

// Params to initialize Handtracking js
const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 2,
    iouThreshold: 0.9,
    scoreThreshold: 0.9
};

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
    updateNote.innerText = "Loaded Model!";
    trackButton.disabled = false;
});
// Method to start a video
function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        if (status) {
            updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
        } else {
            updateNote.innerText = "Please enable video";
        }
    });
}

// Method to toggle a video
function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
    }
}
//Method to detect movement
function runDetection() {
    model.detect(video).then(predictions => {
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
        if (predictions.length > 0) {
            const openHand = predictions.filter(gesture => gesture.class === 1);
            const pinchHand = predictions.filter(gesture => gesture.class === 3);
            // predictions[0]=openHand[0];
            // console.log(openHand[0].bbox[0]);
            if (predictions[0] = openHand[0]) {
                changeDataRotate(openHand[0].bbox);
            }
            if (predictions[0] = pinchHand[0]) {
                changeDataPosition(pinchHand[0].bbox);
                console.log(pinchHand[0].bbox);

            }
        }
    }
    );
}
//Method to Change prediction data into useful information
function changeDataPosition(value) {
    let midvalX = value[0] + value[2] / 2;
    let midvalY = value[1] + value[3] / 2;
    let midvalZ = value[1] / value[3];

    document.querySelector(".hand-1 #hand-x span").innerHTML = midvalX;
    document.querySelector(".hand-1 #hand-y span").innerHTML = midvalY;

    moveTheBox({ x: (midvalX - 300) / 600, y: (midvalY - 250) / 500, z:  midvalZ*.35-.15});
}
function changeDataRotate(value) {
    let midvalX = value[0] + value[2] / 2;
    let midvalY = value[1] + value[3] / 2;

    document.querySelector(".hand-1 #hand-x span").innerHTML = midvalX;
    document.querySelector(".hand-1 #hand-y span").innerHTML = midvalY;

    rotateTheBox({ x: (midvalX - 300) / 600, y: (midvalY - 250) / 500 });
}

//Method to use prediction data to render cude accordingly
function moveTheBox(value) {
    cube.position.x = ((window.innerWidth * value.x) / window.innerWidth) * 6;
    cube.position.y = -((window.innerHeight * value.y) / window.innerHeight) * 6;
    cube.position.z = value.z * 5;
    // cube.position.z = ((window.innerHeight * value.y) / window.innerHeight) * 5;
    renderer.render(scene, camera);
}
function rotateTheBox(value) {
    cube.rotation.y = ((window.innerWidth * value.x) / window.innerWidth) * 10;
    cube.rotation.x = ((window.innerHeight * value.y) / window.innerHeight) * 10;
    renderer.render(scene, camera);
}
