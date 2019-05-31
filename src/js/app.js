/* eslint-disable */
import * as THREE from 'three';
import { TweenMax, TimelineMax, TweenLite, Sine } from 'gsap';
import $ from 'jquery';
// import jQueryBridget from "jquery-bridget";
// import Flickity from "flickity";
import * as ScrollMagic from 'scrollmagic';
import ScrollBar from 'smooth-scrollbar';
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax, TweenLite, Sine);

// jQueryBridget( 'flickity', Flickity, $ );

/* Detect Mobile
// ================================ */
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

/* Cursor Follow
// ================================ */
if (!isMobile) {
	var cursorFollow = {
		config: {
			cursorMain: document.querySelector('.cursor'),
			cursorCore: document.querySelector('.cursor__core'),
			cursorRing: document.querySelector('.cursor__ring'),
			cursorArrows: document.querySelector('.cursor__arrows'),
			cursorEye: document.querySelector('.cursor__eye'),
			cursorEmail: document.querySelector('.cursor__mail'),
			cursorTextPath: document.querySelector('.cursor__text'),
			parallaxElement: document.querySelector('.parallax-element')
		},
		initCursor: () => {
			document.addEventListener("mousemove", e => {
				// add listener to track the current mouse position
				let clientX = e.clientX,
						clientY = e.clientY;

				// background movement
				let bgX = Math.max(-100, Math.min(100, document.querySelector('body').clientWidth / 2 - clientX)),
						bgY = Math.max(-100, Math.min(100, window.document.querySelector('body').clientHeight / 2 - clientY));
				TweenMax.to(cursorFollow.config.parallaxElement, 3, {
					autoAlpha: 1,
					x: bgX,
					y: bgY,
					ease: Power1.easeOut
				})

				// transform the innerCursor to the current mouse position
				// use requestAnimationFrame() for smooth performance
				const render = () => {
					//innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
					// if you are already using TweenMax in your project, you might as well
					// use TweenMax.set() instead
					TweenMax.set(cursorFollow.config.cursorMain, {
						x: clientX,
						y: clientY
					});
				};
				requestAnimationFrame(render);
			});
		}
	}
	// cursorFollow.initCursor();
}

/* Image Canvas
// ================================ */
var hoverEffect = function(opts) {
	var vertex = `
		varying vec2 vUv;
		void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;

	var fragment = `
		varying vec2 vUv;

		uniform sampler2D texture;
		uniform sampler2D texture2;
		uniform sampler2D disp;

		// uniform float time;
		// uniform float _rot;
		uniform float dispFactor;
		uniform float effectFactor;

		// vec2 rotate(vec2 v, float a) {
		//  float s = sin(a);
		//  float c = cos(a);
		//  mat2 m = mat2(c, -s, s, c);
		//  return m * v;
		// }

		void main() {

		vec2 uv = vUv;

		// uv -= 0.5;
		// vec2 rotUV = rotate(uv, _rot);
		// uv += 0.5;

		vec4 disp = texture2D(disp, uv);

		vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
		vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);

		vec4 _texture = texture2D(texture, distortedPosition);
		vec4 _texture2 = texture2D(texture2, distortedPosition2);

		vec4 finalTexture = mix(_texture, _texture2, dispFactor);

		gl_FragColor = finalTexture;
		// gl_FragColor = disp;
		}
	`;

	var parent = opts.parent || console.warn("no parent");
	var dispImage = opts.displacementImage || console.warn("displacement image missing");
	var image1 = opts.image1 || console.warn("first image missing");
	var image2 = opts.image2 || console.warn("second image missing");
	var intensity = opts.intensity || 1;
	var speedIn = opts.speedIn || 1.6;
	var speedOut = opts.speedOut || 1.2;
	var userHover = (opts.hover === undefined) ? true : opts.hover;
	var easing = opts.easing || Expo.easeOut;

	var mobileAndTabletcheck = function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	};

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera(
		parent.offsetWidth / -2,
		parent.offsetWidth / 2,
		parent.offsetHeight / 2,
		parent.offsetHeight / -2,
		1,
		1000
	);

	camera.position.z = 1;

	var renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: false
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0xffffff, 0.0);
	renderer.setSize(parent.offsetWidth, parent.offsetHeight);
	parent.appendChild(renderer.domElement);

	var loader = new THREE.TextureLoader();
	loader.setCrossOrigin('anonymous');
	var texture1 = loader.load(image1);
	var texture2 = loader.load(image2);

	var disp = loader.load(dispImage);
	disp.wrapS = disp.wrapT = THREE.RepeatWrapping;

	texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
	texture1.minFilter = texture2.minFilter = THREE.LinearFilter;

	texture1.anisotropy = renderer.getMaxAnisotropy();
	texture2.anisotropy = renderer.getMaxAnisotropy();

	var mat = new THREE.ShaderMaterial({
		uniforms: {
			effectFactor: { type: "f", value: intensity },
			dispFactor: { type: "f", value: 0.0 },
			texture: { type: "t", value: texture1 },
			texture2: { type: "t", value: texture2 },
			disp: { type: "t", value: disp }
		},

		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: false,
		opacity: 1.0
	});

	var geometry = new THREE.PlaneBufferGeometry(
		parent.offsetWidth,
		parent.offsetHeight,
		1
	);
	var object = new THREE.Mesh(geometry, mat);
	scene.add(object);

	var addEvents = function(){
		var evtIn = "mouseenter";
		var evtOut = "mouseleave";
		if (mobileAndTabletcheck()) {
			evtIn = "touchstart";
			evtOut = "touchend";
		}
		parent.addEventListener(evtIn, function(e) {
			TweenMax.to(mat.uniforms.dispFactor, speedIn, {
				value: 1,
				ease: easing
			});
		});

		parent.addEventListener(evtOut, function(e) {
			TweenMax.to(mat.uniforms.dispFactor, speedOut, {
				value: 0,
				ease: easing
			});
		});

		var tl = new TimelineMax();


		// document.addEventListener('wheel', function() {
			// var tl = new TimelineMax();
			// tl.to(mat.uniforms.dispFactor, 1, {
			// 	value: 1,
			// 	ease: easing,
			// 	repeat: -1,
			// 	yoyo: true
			// })
			// tl.to(mat.uniforms.dispFactor, 1, {
			// 	value: 0,
			// 	ease: easing,
			// 	// repeat: -1,
			// 	// yoyo: true
			// })
			// tl.play()
		// })
		var processing = false;
		$("#app").on('mousewheel', function() {
			if (processing === false) {
				processing = true;
				tl.to(mat.uniforms.dispFactor, 1, {
					value: 1,
					ease: easing,
					// repeat: -1,
					// yoyo: true
				})
				tl.play()
				// do something
				setTimeout(function() {
					processing = false;
					tl.pause()
					tl.to(mat.uniforms.dispFactor, 1, {
						value: 0,
						ease: easing,
					})
				}, 1000); // waiting 250ms to change back to false.
			}
		});
	};

	if (userHover) {
		addEvents();
	}

	window.addEventListener("resize", function(e) {
		renderer.setSize(parent.offsetWidth, parent.offsetHeight);
	});


	this.next = function(){
		TweenMax.to(mat.uniforms.dispFactor, speedIn, {
			value: 1,
			ease: easing
		});
	}

	this.previous = function(){
		TweenMax.to(mat.uniforms.dispFactor, speedOut, {
			value: 0,
			ease: easing
		});
	};

	var animate = function() {
		requestAnimationFrame(animate);

		renderer.render(scene, camera);
	};
	animate();
};

$(document).ready(function(e) {
	Array.from(document.querySelectorAll(".displacement-hover")).forEach(e => {
		const t = Array.from(e.querySelectorAll("img"));

		new hoverEffect({
			parent: e,
			intensity: e.dataset.intensity || void 0,
			speedIn: e.dataset.speedin || void 0,
			speedOut: e.dataset.speedout || void 0,
			easing: e.dataset.easing || void 0,
			hover: e.dataset.hover || void 0,
			image1: t[0].getAttribute("data-src"),
			image2: t[1].getAttribute("data-src"),
			displacementImage: e.dataset.displacement
		});
	});

	const controller = new ScrollMagic.Controller({
		globalSceneOptions: {
			triggerHook: 0
		},
		// refreshInterval: 0
	});

	const tween = new TimelineMax();
	
	tween
		.to('#app', 1, {
			background: '#fff',
			ease: Sine.easeInOut,
		})
		.to('.header-text', 1, {
			color: '#3A3A3A',
			ease: Sine.easeInOut,
		}, 0)
		.to('.slide-text-1', 1.5, {
			opacity: 0,
			ease: Sine.easeInOut,
		}, -1)
		.to('.project-slider', 10, {
			x: -3950,
			ease: Sine.easeInOut,
		}, -1)
		.to('.slide-text-2', 1.5, {
			opacity: 1,
			ease: Sine.easeInOut,
		}, 9)
		.to('#app', 1, {
			background: '#3429BC',
			ease: Sine.easeInOut,
		}, 9)
		.to('.header-text', 1, {
			color: '#fff',
			ease: Sine.easeInOut,
		}, 9)


	// const bgTween = TweenMax.to('#app', {
	// 	backgroundColor: '#fff',
	// 	ease: Sine.easeInOut
	// })
	
	// const artemSlider = new TimelineMax();
	const scene = new ScrollMagic.Scene({
		triggerElement: '.artem-slider',
		triggerHook: 0,
		duration: 4500,
	})
		.setTween(tween)
		.setPin('.artem-slider', { pushFollowers: true })
		.addTo(controller);
	
	// const scrollbar = ScrollBar.init(document.querySelector('.artem-slider'))
	// // ScrollBar.initAll()
	// scrollbar.addListener(() => {
	// 	scene.refresh()
	// })
});

/* Flickity Slider
// ================================ */
// var $slider = $('.project-slider');
// $slider.flickity({
// 	cellAlign: "left",
// 	pageDots: false,
// 	contain: true,
// 	percentPosition: false,
// 	arrowShape: "M98.8,42.4v15.7H30.3l25.3,14.7v15.9L1.2,56.9V43.6l54.5-32.3V27L30.3,42.4H98.8z"
// });

/* Mouse Events
// ================================ */
if (!isMobile) {
	const $body = $("body");
	$(".project-slider").mouseenter(function() {
		$body.addClass("project-slider__hover");
	}).mouseleave(function() {
		$body.removeClass("project-slider__hover");
	});
	$('.project-slide__inner').mouseenter(function() {
		$body.addClass('project-slider__item-hover');
	}).mouseleave(function() {
		$body.removeClass('project-slider__item-hover');
	});
	// $slider.on( 'pointerDown.flickity', function( event, pointer ) {
	// 	$body.addClass("project-slider__grab");
	// 	console.log(pointer);
	// 	document.ontouchmove = function (e) {
	// 		e.preventDefault();
	// 	}
	// }).on( 'pointerUp.flickity', function( event, pointer ) {
	// 	$body.removeClass("project-slider__grab");
	// 	document.ontouchmove = function (e) {
	// 		return true;
	// 	}
	// });
}
